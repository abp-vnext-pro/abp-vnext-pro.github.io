# 微服务

::: tip 注意
- ABP vNext Pro 既可以单体部署,也可以按照模块化方式独立部署，实现微服务。
:::

## 场景示例
- 需要把ABP vNext Pro提供的模块独立部署(ServiceA),自己的业务模块独立部署(ServiceB)。
- 2个服务如何进行通信?
- 业务模块权限如何处理？

1. 用cli生成ABP vNext Pro项目
- 姑且叫这个项目为ServiceA

```bash
# 创建一个nuget版本的项目，根据自己需求创建
lion.abp new -t pro-nuget -c Lion -p ServiceA
```
2. 用cli生产一个ABP vNext Pro模块项目
- 姑且叫这个项目为ServiceB

```bash
# 创建一个nuget版本的项目，根据自己需求创建
lion.abp new -t pro-module -c Lion -p Business -m ServiceB
```
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/service.png)

### 服务间通信
- 我们创建的项目，标准模板都会有一个xxxx.xxx.HttpApi.Client的模块,通过这个模块,只要我们稍加配置接口就可以实现服务直接的通信。
<a href="csharpclientproxy" target="_blank">详细信息可以参考此文档</a>

- 比如ServiceB需要请求ServiceA的接口我们需要怎么操作?
1. 查看Lion.ServiceA.HttpApi.Client
2. 我们发现RemoteServiceName叫做Default,这个名字可以改,比如改成ServiceA
```csharp
    [DependsOn(
        typeof(ServiceAApplicationContractsModule),
        typeof(BasicManagementHttpApiClientModule),
        typeof(NotificationManagementHttpApiClientModule),
        typeof(DataDictionaryManagementHttpApiClientModule),
        typeof(LanguageManagementHttpApiClientModule)
    )]
    public class ServiceAHttpApiClientModule : AbpModule
    {
        public const string RemoteServiceName = "ServiceA";//"Default";

        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddHttpClientProxies(
                typeof(ServiceAApplicationContractsModule).Assembly,
                RemoteServiceName
            );
        }
    }
}
```
3. 我们在ServiceB的appsetting.json下面添加一下配置
```json
  "RemoteServices": {
    // BookStoreService 这个名字在BookStore.HttpApi.Client的module定义
    "ServiceA": {
      "BaseUrl": "http://localhost:44315/"
    } 
  } 
```
4. 在ServiceB的Application层添加Lion.ServiceA.HttpApi.Client引用
5. 在ServiceB的Application层添加ServiceAHttpApiClientModule模块依赖
6. 这个时候你就直接注入接口就可以使用了。直接注入IUserAppService
7. 至此服务间通信已经完成

### 权限

::: tip 注意
- ABP vNext Pro 暂时没有添加动态权限模块，后续会补充，暂时通过静态方式解决
:::
1. 我们新建一个公共类库(Lion.Service.Permissions)，只需要引用Volo.Abp.Authorization.Abstractions即可
- 添加一下代码
```csharp
public class ServicePermissionsModule : AbpModule
{
}
```
```csharp
public class ServicePermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        // 权限定义
        // 可以把业务模块的权限定义在这里，
    }
}
```
2. 把ServicePermissionsModule这个模块添加到ServiceA的Application层,这个时候ServiceA会自动扫描权限

3. 服务和服务之间的token怎么处理
- 替换IRemoteServiceHttpClientAuthenticator实现
4. 添加在ServiceB的Application层

```csharp
[Dependency(ReplaceServices = true)]
[ExposeServices(typeof(IRemoteServiceHttpClientAuthenticator))]
public class AccessTokenRemoteServiceHttpClientAuthenticator : IRemoteServiceHttpClientAuthenticator, ITransientDependency
{
    private readonly IAccountAppService _accountAppService;

    public AccessTokenRemoteServiceHttpClientAuthenticator(IAccountAppService accountAppService)
    {
        _accountAppService = accountAppService;
    }

    public async Task Authenticate(RemoteServiceHttpClientAuthenticateContext context)
    {
        // 分配一个账户给ServiceB,这个账户有权限访问ServiceA接口的权限,调用登录接口获取token
        var result = await _accountAppService.LoginAsync(new LoginInput(){
            Name = "admin",
            Password = "1q2w3E*"
        });
        context.Request.Headers.Add("Authorization", "Bearer " + result.Token);
    }
}
```



