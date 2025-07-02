---
sidebar:
  sort:14
---
# 后台任务
- 当前文章讲述如何在abp中使用hangfire(redis持久化)作为后台任务

## 集成Hangfire
1. 添加Volo.Abp.BackgroundJobs.HangFire和Hangfire.Redis.StackExchange包(Host层)
2. 添加模块依赖
```csharp
[DependsOn(
    typeof(AbpBackgroundJobsHangfireModule)
)]
```
3. ConfigureServices中配置服务
```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    ConfigureHangfire(context);
}

private void ConfigureHangfire(ServiceConfigurationContext context)
{
    var redisStorageOptions = new RedisStorageOptions()
    {
        Db = context.Services.GetConfiguration().GetValue<int>("Hangfire:Redis:DB")
    };
    Configure<AbpBackgroundJobOptions>(options => { options.IsJobExecutionEnabled = true; });
    context.Services.AddHangfire(config =>
    {
        config.UseRedisStorage(
            context.Services.GetConfiguration().GetValue<string>("Hangfire:Redis:Host"), redisStorageOptions)
            // job自动过期时间
            .WithJobExpirationTimeout(TimeSpan.FromDays(7));
        //var delaysInSeconds = new[] { 10, 60, 60 * 3 }; // 重试时间间隔
        //const int Attempts = 3; // 重试次数
        //config.UseFilter(new AutomaticRetryAttribute() { Attempts = Attempts, DelaysInSeconds = delaysInSeconds });
        //config.UseFilter(new AutoDeleteAfterSuccessAttribute(TimeSpan.FromDays(7)));
        //config.UseFilter(new JobRetryLastFilter(Attempts));
    });
}
```

4. 配置Dashboard
- 在OnApplicationInitialization中添加一下代码
```csharp
app.UseConfiguredEndpoints(endpoints =>
       {
           endpoints.MapHealthChecks("/health"); 
           
           endpoints.MapHangfireDashboard("/hangfire", new DashboardOptions()
           {
               Authorization = new[] { new CustomHangfireAuthorizeFilter() },
               IgnoreAntiforgeryToken = true
           });
       });
```

## 一次性Job
- 通过job发送邮件
1. 定义job参数
```csharp
public class EmailSendingArgs
{
    public string EmailAddress { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
}
```
2. 定义job
```csharp
public class EmailSendingJob
    : AsyncBackgroundJob<EmailSendingArgs>, ITransientDependency
{
    private readonly IEmailSender _emailSender;
    public EmailSendingJob(IEmailSender emailSender)
    {
        _emailSender = emailSender;
    }

    public override async Task ExecuteAsync(EmailSendingArgs args)
    {
        await _emailSender.SendAsync(
            args.EmailAddress,
            args.Subject,
            args.Body
        );
    }
}
```

3. 创建job
```csharp
public class RegistrationService : ApplicationService
{
    private readonly IBackgroundJobManager _backgroundJobManager;

    public RegistrationService(IBackgroundJobManager backgroundJobManager)
    {
        _backgroundJobManager = backgroundJobManager;
    }

    public async Task RegisterAsync(string userName, string emailAddress, string password)
    {
        await _backgroundJobManager.EnqueueAsync(
            new EmailSendingArgs
            {
                EmailAddress = emailAddress,
                Subject = "You've successfully registered!",
                Body = "..."
            }
        );
    }
}
```

## 定时任务
1. 安装Volo.Abp.BackgroundWorkers.Hangfire包(Application层)
2. 添加模块依赖
```csharp
[DependsOn(
    typeof(AbpBackgroundWorkersHangfireModule)
    )]
```
3. 定义Job
```csharp
public class MyLogWorker : HangfireBackgroundWorkerBase
{
    public MyLogWorker()
    {
        RecurringJobId = nameof(MyLogWorker);
        CronExpression = Cron.Minutely();
    }

    public override Task DoWorkAsync(CancellationToken cancellationToken = default)
    {
        using var uow = LazyServiceProvider.LazyGetRequiredService<IUnitOfWorkManager>().Begin();
        Logger.LogInformation("Executed MyLogWorker..!");
        return Task.CompletedTask;
    }
}
```
4. 注册job
- 在moudle中注册
```csharp
public override async Task OnApplicationInitializationAsync(ApplicationInitializationContext context)
{
    await context.AddBackgroundWorkerAsync<MyLogWorker>();
}
```

