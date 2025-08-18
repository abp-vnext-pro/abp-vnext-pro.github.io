---
sidebar:
  sort: 5
---

# 跨域(CORS)

- 允许指定策略

```json [appsetting.json]
"Cors": {
    "Enabled": true,
    // 逗号分隔
    "CorsOrigins": "http://*.com,http://localhost:4200"
  },
``` 
- 配置跨域

```csharp
      public override void ConfigureServices(ServiceConfigurationContext context)
      {
          context.Services.AddAbpProCors();
      }

      public override void OnApplicationInitialization(ApplicationInitializationContext context)
      {
          var app = context.GetApplicationBuilder();
          app.UseAbpProCors();
      }
```
