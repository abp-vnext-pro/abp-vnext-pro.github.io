# 启动预热

::: tip 注意
- 启动程序首次访问接口响应时间很长，Starter模块处理
:::

## 安装

- 添加以下 NuGet 包到你的项目
  - Lion.AbpPro.Starter
- 添加 [DependsOn(typeof(AbpProStarterModule))] 到你的项目模块类.


## Starter模块
- 只要实现IAbpProStarterContributor接口，程序会在启动之后执行
```csharp
public interface IAbpProStarterContributor
{
    Task RunAsync();
}
```

## 可以用来做什么？
- 当我们需要一些在程序启动的时候做一些默认设置的时候可以使用，比如加载数据到内存，程序预热

### 程序预热
- 配置appsetting.json
```json
{
    "Preheat":{
        // 是否启用
        "Enabled": true,
        // get请求 
        "RequestUrl": "http://localhost:44315/api/abp/application-configuration?IncludeLocalizationResources=false" 
    }
}
```

```csharp
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Lion.AbpPro.Starter;

public class PreheatAbpProStarterContributor : IAbpProStarterContributor, ITransientDependency
{
    private readonly IHttpClientFactory _httpClientFactory;
    private PreheatOptions _options;
    private ILogger<PreheatAbpProStarterContributor> _logger;

    public PreheatAbpProStarterContributor(IHttpClientFactory httpClientFactory, IOptions<PreheatOptions> options)
    {
        _httpClientFactory = httpClientFactory;
        _options = options.Value;
    }

    public async Task RunAsync()
    {
        if (!_options.Enabled)
        {
            return;
        }

        try
        {
            _logger.LogInformation($"开始预热:{_options.RequestUrl}");
            await _httpClientFactory.CreateClient().GetAsync(_options.RequestUrl);
            _logger.LogInformation($"预热成功");
        }
        catch (Exception ex)
        {
            // ignore
            _logger.LogError(ex, $"程序预热失败:{_options.RequestUrl}");
        }
    }
}
```