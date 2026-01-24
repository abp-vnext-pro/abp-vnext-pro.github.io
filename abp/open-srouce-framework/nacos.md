# Nacos
- [Nacos官方文档](https://nacos.io/)
- [Nacos dotnet Sdk 文档](https://nacos-sdk-csharp.readthedocs.io/en/latest/)

## 集成

1. 添加以下 NuGet 包到你的Host项目
  - Lion.AbpPro.Nacos

2. 在 Program.cs 进行如下配置
```csharp
builder.Host
           .UseAutofac()
           // 默认会使用JSON解析器来解析存在Nacos Server的配置
           .UseNacos() 
           .UseSerilog();
```

3. 修改 appsettings.json
```json
{
  "NacosConfig": {
    "Listeners": [
      {
        "Optional": false,
        "DataId": "abppro",
        "Group": "DEFAULT_GROUP"
      }
    ],
    "Namespace": "public",
    "ServerAddresses": [ "http://localhost:8848/" ],
    "UserName": "nacos",
    "Password": "nacos"
  }
}
```

4. 用.NET Core方式来读取Nacos配置
```csharp
[ApiController]
[Route("api/[controller]")]
public class ConfigController : ControllerBase
{
    private readonly IConfiguration _configuration;
    private readonly AppSettings _settings;
    private readonly AppSettings _sSettings;
    private readonly AppSettings _mSettings;

    public ConfigController(
        IConfiguration configuration,
        IOptions<AppSettings> options,
        IOptionsSnapshot<AppSettings> sOptions,
        IOptionsMonitor<AppSettings> _mOptions
        )
    {
        _logger = logger;
        _configuration = configuration;
        _settings = options.Value;
        _sSettings = sOptions.Value;
        _mSettings = _mOptions.CurrentValue;
    }

    [HttpGet]
    public string Get()
    {
        // ....

        return "ok";
    }

}
```
