---
sidebar:
  sort: 16
---

# 网关
- 基于Ocelot+Consul

## 服务注册

1. 添加配置(在host层)
```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    context.Services
        .AddAbpProHealthChecks()
        .AddAbpProConsul();
}
public override void OnApplicationInitialization(ApplicationInitializationContext context)
{
    var app = context.GetApplicationBuilder();

    app.UseAbpProConsul();
}
```
2. appsettings.json配置
```json
"Consul": {
  "Enabled": true,  //是否启用
  "ServiceUrl": "http://localhost:8500", // ocelot 服务地址
  "ClientName": "Lion.AbpPro.Api",  // 服务名称
  "ClientAddress": "localhost",  // 服务地址,不要带http://，不要带端口
  "ClientPort": 44315,  //服务端口
  "HealthUrl": "http://localhost:44315/health", // 服务健康检查地址
  "DeregisterCriticalServiceAfter": 30, // 服务停止多久后注销,单位秒
  "Interval": 30, // 服务检查间隔,单位秒
  "Timeout": 30 // 服务检查超时时间,单位秒
}
```
3. 启动服务会自动注册到consul

## 网关

1. 添加配置(在host层)
```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    context.Services.AddAbpProHealthChecks();
    context.Services.AddAbpProOcelot();
}
public override void OnApplicationInitialization(ApplicationInitializationContext context)
{
    var app = context.GetApplicationBuilder();
    app.UseCorrelationId();
    app.UseRouting();
    app.UseConfiguredEndpoints(endpoints => { endpoints.MapHealthChecks("/health"); });
    app.UseWebSockets();
    app.UseOcelot().Wait();
}
```    
2. appsettings.json配置
```json
{
  "GlobalConfiguration": {
  },
  "Routes": [
    {
      "DownstreamPathTemplate": "/{url}",
      "DownstreamScheme": "http",
      "ServiceName": "Lion.AbpPro.Api",  // 服务名称
      "LoadBalancerOptions": {
        "Type": "LeastConnection"
      },
      "UpstreamPathTemplate": "/gateway/{url}",
      "UpstreamHttpMethod": [
        "Get",
        "Post",
        "Put",
        "Delete"
      ]
    },
    {
      "DownstreamPathTemplate": "/{url}",
      "DownstreamScheme": "ws",
      "ServiceName": "Lion.AbpPro.Api", // 服务名称
      "LoadBalancerOptions": {
        "Type": "LeastConnection"
      },
      "UpstreamPathTemplate": "/ws/{url}",
      "UpstreamHttpMethod": [
        "Get",
        "Post",
        "Put",
        "Delete"
      ]
    }
  ]
}
```
3. 启动网关
请求：http://localhost:44314/gateway/xxxxxx你得服务地址
只要gateway开头都会自动跳转到你配置得服务
