---
outline: deep
---
## 第三方登录
::: tip 
第三方登录是一种在 Web 网站（也包括移动应用）上使用户能够凭借其在其他平台（如社交媒体平台、大型互联网服务提供商等）的已有账号来登录本网站的认证方式。
例如，一个网站允许用户使用微信账号登录，而不是要求用户在该电商网站上重新注册账号并设置密码。用户点击微信登录按钮后，会跳转到微信授权页面，在用户授权后，电商网站就可以获取用户的基本信息（如头像、昵称等），从而完成登录流程。
::: 


### Github登录

1. 添加引用Lion.AbpPro.Oidc
2. 添加AbpProOidcModule模块依赖
3. 通过setting配置github登录相关
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/login-github.png)


### 如何集成其他登录方式
- 比如我们要集成Gitee登录
1. 首先实现IExternalLoginProvider接口
    - 这个接口有2个方法，获取access_token和获取用户信息
```csharp
public interface IExternalLoginProvider
{
    /// <summary>
    /// 获取access_token
    /// </summary>
    Task<GetAccessTokenResult> GetAccessTokenAsync(string code);

    /// <summary>
    /// 获取用户信息
    /// </summary>
    Task<GetUserInfoResult> GetUserInfoAsync(string accessToken);
}
```

2. 配置setting
- 我在代码中AbpProOidcSettingDefinitionProvider有一个github的配置
- 复制ConfigGithub方法，把github改成gitee即可
```csharp
public class AbpProOidcSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        ConfigGithub(context);
    }

    private void ConfigGithub(ISettingDefinitionContext context)
    {
        context.Add(
            new SettingDefinition(AbpProOidcSettings.OidcSetting.Github.Enabled,
                    "false",
                    L("Lion.AbpPro:Oidc.Enabled"),
                    L("Lion.AbpPro:Oidc.Enabled"))
                .WithProperty(AbpProOidcSettings.OidcSetting.Default,
                    AbpProOidcSettings.OidcSetting.Github.Group)
                .WithProperty(AbpProSettingConsts.ControlType.Default,
                    AbpProSettingConsts.ControlType.TypeCheckBox)
                .WithProperty(AbpProOidcSettings.OidcSetting.Tag,
                    AbpProOidcSettings.OidcSetting.Tag) ) ;


        context.Add(
            new SettingDefinition(AbpProOidcSettings.OidcSetting.Github.ClientName,
                    "",
                    L("Lion.AbpPro:Oidc.ClientName"),
                    L("Lion.AbpPro:Oidc.ClientName"))
                .WithProperty(AbpProOidcSettings.OidcSetting.Default,
                    AbpProOidcSettings.OidcSetting.Github.Group)
                .WithProperty(AbpProOidcSettings.OidcSetting.Tag,
                    AbpProOidcSettings.OidcSetting.Tag)
                .WithProperty(AbpProSettingConsts.ControlType.Default,
                    AbpProSettingConsts.ControlType.TypeText));

        context.Add(
            new SettingDefinition(AbpProOidcSettings.OidcSetting.Github.ClientId,
                    "",
                    L("Lion.AbpPro:Oidc.ClientId"),
                    L("Lion.AbpPro:Oidc.ClientId"))
                .WithProperty(AbpProOidcSettings.OidcSetting.Default,
                    AbpProOidcSettings.OidcSetting.Github.Group)
                .WithProperty(AbpProSettingConsts.ControlType.Default,
                    AbpProSettingConsts.ControlType.TypeText)
                .WithProperty(AbpProOidcSettings.OidcSetting.Tag,
                    AbpProOidcSettings.OidcSetting.Tag));


        context.Add(
            new SettingDefinition(AbpProOidcSettings.OidcSetting.Github.ClientSecret,
                    "",
                    L("Lion.AbpPro:Oidc.ClientSecret"),
                    L("Lion.AbpPro:Oidc.ClientSecret"))
                .WithProperty(AbpProOidcSettings.OidcSetting.Default,
                    AbpProOidcSettings.OidcSetting.Github.Group)
                .WithProperty(AbpProOidcSettings.OidcSetting.Tag,
                    AbpProOidcSettings.OidcSetting.Tag)
                .WithProperty(AbpProSettingConsts.ControlType.Default,
                    AbpProSettingConsts.ControlType.TypeText));


        context.Add(
            new SettingDefinition(AbpProOidcSettings.OidcSetting.Github.RedirectUrl,
                    "",
                    L("Lion.AbpPro:Oidc.RedirectUrl"),
                    L("Lion.AbpPro:Oidc.RedirectUrl"))
                .WithProperty(AbpProOidcSettings.OidcSetting.Default,
                    AbpProOidcSettings.OidcSetting.Github.Group)
                .WithProperty(AbpProOidcSettings.OidcSetting.Tag,
                    AbpProOidcSettings.OidcSetting.Tag)
                .WithProperty(AbpProSettingConsts.ControlType.Default,
                    AbpProSettingConsts.ControlType.TypeText));

        context.Add(
            new SettingDefinition(AbpProOidcSettings.OidcSetting.Github.HostUrl,
                    "",
                    L("Lion.AbpPro:Oidc.HostUrl"),
                    L("Lion.AbpPro:Oidc.HostUrl"))
                .WithProperty(AbpProOidcSettings.OidcSetting.Default,
                    AbpProOidcSettings.OidcSetting.Github.Group)
                .WithProperty(AbpProOidcSettings.OidcSetting.Tag,
                    AbpProOidcSettings.OidcSetting.Tag)
                .WithProperty(AbpProSettingConsts.ControlType.Default,
                    AbpProSettingConsts.ControlType.TypeText));

        context.Add(
            new SettingDefinition(AbpProOidcSettings.OidcSetting.Github.Icon,
                    "",
                    L("Lion.AbpPro:Oidc.Icon"),
                    L("Lion.AbpPro:Oidc.Icon"))
                .WithProperty(AbpProOidcSettings.OidcSetting.Default,
                    AbpProOidcSettings.OidcSetting.Github.Group)
                .WithProperty(AbpProSettingConsts.ControlType.Default,
                    AbpProSettingConsts.ControlType.TypeText)
                .WithProperty(AbpProOidcSettings.OidcSetting.Tag,
                    AbpProOidcSettings.OidcSetting.Tag));
        
        context.Add(
            new SettingDefinition(AbpProOidcSettings.OidcSetting.Github.AuthUri,
                    "",
                    L("Lion.AbpPro:Oidc.AuthUri"),
                    L("Lion.AbpPro:Oidc.AuthUri"))
                .WithProperty(AbpProOidcSettings.OidcSetting.Default,
                    AbpProOidcSettings.OidcSetting.Github.Group)
                .WithProperty(AbpProOidcSettings.OidcSetting.Tag,
                    AbpProOidcSettings.OidcSetting.Tag)
                .WithProperty(AbpProSettingConsts.ControlType.Default,
                    AbpProSettingConsts.ControlType.TypeText)
                .WithProperty(AbpProOidcSettings.OidcSetting.Tag,
                    AbpProOidcSettings.OidcSetting.Tag));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<AbpProLocalizationResource>(name);
    }
}
```
3. 注入服务
- 通过keyService的方式注入
- **这里的注入名称和上面你配置setting的认证地址的url里面的state="Github"保持一致，登录的时候会通过这个去找对应的实现。**
```csharp
public class AbpProOidcModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddKeyedTransient<IExternalLoginProvider, GithubExternalLoginProvider>(AbpProOidcConsts.Github);
    }
}
```
4. 通过一系列的操作之后，就集成对应的第三方登录

### Setting参数说明
- 是否启用(Setting.Group.Oidc.Github.Enabled)
    - 勾选中前端登录界面则会显示对应的登录方式
- 应用名称(Setting.Group.Oidc.Github.ClientName)
    - 授权登录的应用名称，比如我示例的叫做AbpPro,这个参数可能在调用第三方接口需要用到
- ClientId(Setting.Group.Oidc.Github.ClientId)
    - 第三方登录颁发的ClientId
- ClientSecret(Setting.Group.Oidc.Github.ClientSecret)
    - 第三方登录颁发的ClientSecret  
- 重定向Url(Setting.Group.Oidc.Github.RedirectUrl)
    - 第三方登录那边也需要设置一样的地址，也就是你授权成功的回调地址
- HostUrl(Setting.Group.Oidc.Github.HostUrl)
    - 第三方登录官方地址
- Icon(Setting.Group.Oidc.Github.Icon)
    - 图标,显示在登录界面的样式
- 认证地址(Setting.Group.Oidc.Github.AuthUri)
    - 前端点击第三方登录的跳转地址，比如github的https://github.com/login/oauth/authorize?client_id=127fc528f611879fba03&state=Github
    - **state有特殊意义这里下面会详细说明**


### 说明
- 只要有第三方登录启用了，前端会自动渲染出来
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/login-ex.png)