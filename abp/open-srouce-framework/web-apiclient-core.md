---
outline: deep
---

# WebApiClient
- [github开源地址](https://github.com/dotnetcore/WebApiClient)
- 高性能高可扩展性的声明式http客户端库

## 使用场景
- 我们需要和第三方对接，对方使用的是Http方式，在.net中我们都是通过HttpClientFactory去调用，其中我们需要写很多重复的代码。

## 集成
- 查看Lion.AbpPro.HttpClient

## 示例
- 比如我们调用第三方服务的接口地址是：http://localhost:5048/
- 它有一个获取天气信息的接口：地址是：http://localhost:5048/api/WeatherForecast/Get

1. 定义一个接口
```csharp
/// <summary>
/// Demo
/// </summary>
public interface IDemoHttpClient : IHttpApi
{
    /// <summary>
    /// 获取天气信息
    /// </summary>
    [HttpGet("api/WeatherForecast/Get")]
    Task<IEnumerable<WeatherForecast>> GetAsync(CancellationToken token = default);


    [HttpPost("api/WeatherForecast/Demo1")]
    Task<IEnumerable<WeatherForecast>> PostAsync([JsonContent] WeatherForecast weatherForecasts, CancellationToken token = default);
}
```

2. 模块注入
```csharp
public class SevenHttpClientModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        // 示例项目
        context.Services.AddHttpApi<IDemoHttpClient>().ConfigureHttpApi(options => { options.HttpHost = new Uri("http://localhost:5048/"); });
    }
}
```

3. 调用的时候直接在service中注入IDemoHttpClient即可。