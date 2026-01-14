---
sidebar:
  sort: 4
---

# 跨域(CORS)
- 浏览器安全性可防止网页向不处理网页的域发送请求。 此限制称为同域策略。 同域策略可防止恶意站点从另一站点读取敏感数据。

## 同源
- **如果两个 URL 具有相同的方案、主机和端口，则它们同源。**
- 这两个 URL 同源：
  - https://example.com/foo.html
  - https://example.com/bar.html
  
- 这些 URL 的源与前两个 URL 不同：
  - https://example.net：不同的域
  - https://contoso.example.com/foo.html：不同的子域
  - http://example.com/foo.html：不同的方案
  - https://example.com:9000/foo.html：不同的端口

## 配置

```json [appsetting.json]
 "Cors": {
    "Enabled": true,
    "CorsOrigins": "http://localhost:4200,http://localhost:4201"
  },
```

## 代码实现

```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
       context.Services.AddAbpProCors();
}

/// <summary>
/// 配置跨域
/// </summary>
public static IServiceCollection AddAbpProCors(this IServiceCollection service)
{
    var corsOptions = service.BuildServiceProvider().GetRequiredService<IOptions<AbpProCorsOptions>>().Value;
    if (!corsOptions.Enabled) return service;
    
    service.AddCors(options =>
    {
        options.AddPolicy(AbpProAspNetCoreConsts.DefaultCorsPolicyName, builder =>
        {
            builder
                .WithOrigins(
                    corsOptions.CorsOrigins
                        .Split(",", StringSplitOptions.RemoveEmptyEntries)
                        .Select(o => o.RemovePostFix("/"))
                        .ToArray()
                )
                //.WithAbpExposedHeaders()
                .SetIsOriginAllowedToAllowWildcardSubdomains()
                .AllowAnyHeader()
                .AllowAnyMethod()
                //.AllowCredentials()
                // https://www.cnblogs.com/JulianHuang/p/14225515.html
                // https://learn.microsoft.com/zh-cn/aspnet/core/security/cors?view=aspnetcore-7.0
                .SetPreflightMaxAge((TimeSpan.FromHours(24)));
        });
    });
    return service;
}
```
