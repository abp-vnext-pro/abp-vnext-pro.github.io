---
sidebar:
  sort: 7
---

# 跨域(CORS)

- 允许指定策略

```json [appsetting.json]
 "Cors": {
    "Enabled": true,
    "CorsOrigins": "http://localhost:4200,http://localhost:4201"
  },
```

- 配置跨域

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
