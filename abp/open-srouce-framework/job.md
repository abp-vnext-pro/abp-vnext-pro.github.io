---
sidebar:
  sort: 9
---

# 后台任务

本文档介绍如何在ABP项目中集成并使用Hangfire作为后台任务处理框架，采用Redis进行持久化存储。



## 集成 Hangfire

### 安装相关包

在你的 Host 层项目中安装以下 NuGet 包：

- `Volo.Abp.BackgroundJobs.HangFire`
- `Hangfire.Redis.StackExchange`

### 添加模块依赖

在你的模块类上添加 `AbpBackgroundJobsHangfireModule` 依赖：

```csharp
[DependsOn(
    typeof(AbpBackgroundJobsHangfireModule)
)]
```

### 配置服务

在模块的 [ConfigureServices]方法中配置 Hangfire 服务：

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    context.Services.AddAbpProHangfire();
}
```

### 配置 Dashboard

在 [OnApplicationInitialization] 方法中添加 Hangfire Dashboard 配置：

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

### 配置 Redis 连接

在 [appsettings.json]文件中添加 Hangfire 的 Redis 配置：

```json
{
  "Hangfire": {
    "Redis": {
      "Host": "localhost:6379,password=1q2w3E*",
      "DB": "2"
    }
  }
}
```

## 一次性任务

下面是一个通过后台任务发送邮件的示例。

### 定义任务参数

```csharp
public class EmailSendingArgs
{
    public string EmailAddress { get; set; }
    public string Subject { get; set; }
    public string Body { get; set; }
}
```

### 定义任务执行逻辑

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

### 触发任务执行

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

### 安装相关包

在 Application 层项目中安装 `Volo.Abp.BackgroundWorkers.Hangfire` 包。

### 添加模块依赖

```csharp
[DependsOn(
    typeof(AbpBackgroundWorkersHangfireModule)
)]
```

### 定义定时任务

```csharp
public class MyLogWorker : HangfireBackgroundWorkerBase
{
    public MyLogWorker()
    {
        RecurringJobId = nameof(MyLogWorker);
        CronExpression = Cron.Minutely(); // 每分钟执行一次
    }

    public override Task DoWorkAsync(CancellationToken cancellationToken = default)
    {
        using var uow = LazyServiceProvider.LazyGetRequiredService<IUnitOfWorkManager>().Begin();
        Logger.LogInformation("Executed MyLogWorker..!");
        return Task.CompletedTask;
    }
}
```

### 注册定时任务

在模块的初始化方法中注册定时任务：

```csharp
public override async Task OnApplicationInitializationAsync(ApplicationInitializationContext context)
{
    await context.AddBackgroundWorkerAsync<MyLogWorker>();
}
```

### 防止并发执行

使用 `DisableConcurrentExecution` 特性可以防止同一任务被多个工作者并发执行：

```csharp
public class MyJob
{
    [DisableConcurrentExecution(timeoutInSeconds: 60)] // 超时时间 60 秒
    public void LongRunningTask()
    {
        // 任务逻辑，例如：
        Console.WriteLine("任务开始...");
        System.Threading.Thread.Sleep(10000); // 模拟长时间运行
        Console.WriteLine("任务结束。");
    }
}
```

## 高级用法

### 自动重试机制

Hangfire 提供了 [AutomaticRetry] 特性来自动重试失败的任务：

```csharp
public class MyJob
{
    [AutomaticRetry(Attempts = 3, OnAttemptsExceeded = AttemptsExceededAction.Fail)]
    public void TaskWithRetry()
    {
        // 任务逻辑，可能会抛出异常
        Console.WriteLine("任务执行中...");
        // 模拟随机失败
        if (new Random().Next(0, 2) == 0)
        {
            throw new Exception("任务执行失败！");
        }
        Console.WriteLine("任务执行成功！");
    }
}
```

### 自定义重试间隔

可以自定义每次重试之间的间隔时间：

```csharp
public class MyJob
{
    // 重试 3 次，间隔分别为 10 秒、20 秒、30 秒
    [AutomaticRetry(Attempts = 3, DelaysInSeconds = new int[] { 10, 20, 30 })]
    public void TaskWithCustomDelays()
    {
        // 任务逻辑...
    }
}
```

### 针对特定异常重试

只对指定类型的异常进行重试：

```csharp
public class MyJob
{
    // 只对 NetworkException 和 TimeoutException 重试
    [AutomaticRetry(Attempts = 3, OnlyOn = new[] { typeof(NetworkException), typeof(TimeoutException) })]
    public void TaskWithSpecificExceptions()
    {
        // 任务逻辑...
    }
}
```

### 忽略特定异常

对某些异常类型不进行重试：

```csharp
public class MyJob
{
    // 对 ArgumentException 不重试，其他异常重试
    [AutomaticRetry(Attempts = 3, ExceptOn = new[] { typeof(ArgumentException) })]
    public void TaskWithIgnoredExceptions()
    {
        // 任务逻辑...
    }
}
```

### 全局重试策略配置

可以通过全局配置设置默认的重试策略：

```csharp
builder.Services.AddHangfire(config =>
{
    // 全局默认重试 5 次，使用指数退避策略
    config.UseAutomaticRetry(5);
});
```

注意：任务方法上的 `[AutomaticRetry]` 特性会覆盖全局配置。