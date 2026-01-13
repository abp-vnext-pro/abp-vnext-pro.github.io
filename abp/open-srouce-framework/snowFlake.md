## 雪花算法

- 基于Yitter.IdGenerator
- [github源码地址](https://github.com/yitter/IdGenerator/tree/master)

## 集成

- 引入Lion.AbpPro.IdGenerator
- 添加模块依赖AbpProIdGeneratorModule

## 配置

- IdGeneratorOptions 用于配置 ID 生成器的参数。比如 WorkerId、时间戳位数、序列号位数等。
- 常见配置项有：
    - WorkerId：机器或进程的唯一标识（默认 6 位，最大 63）。
    - WorkerIdBitLength：WorkerId 的位数。
    - SeqBitLength：序列号的位数，影响每毫秒生成 ID 的数量。
    - BaseTime：时间戳基准（默认 1970-01-01）。

```CSharp
public class AbpProIdGeneratorModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        var logger = context.Services.BuildServiceProvider().GetRequiredService<ILogger<AbpProIdGeneratorModule>>();
        // 从环境变量或配置文件读取 WorkerId, 如果没有则随机生成从0-63 随机获取一个
        var workerId = Environment.GetEnvironmentVariable("WORKER_ID") ?? new Random().Next(0, 64).ToString();
        logger.LogInformation($"当前雪花算法WorkerId: {workerId}");
        var options = new IdGeneratorOptions
        {
            WorkerId = ushort.Parse(workerId)
        };
        YitIdHelper.SetIdGenerator(options);
    }
}
```

## 使用
```CSharp
var id = YitIdHelper.NextId();
```
