---
outline: deep
---
# 双因素验证
双因素验证（Two - Factor Authentication，简称 2FA）是一种安全验证方法，也被称为双因素认证或双重认证。


## 集成
1. 添加引用Lion.AbpPro.TwoFactor
2. 添加AbpProTwoFactoryModule
3. 调用一下方法进行验证
```csharp
public interface ITwoFactorProvider
{
    /// <summary>
    /// 获取二维码
    /// </summary>
    /// <param name="userName">用户名(最好不要使用中文)</param>
    Task<GetQRCodeDto> GetQRCodeAsync(string userName);

    /// <summary>
    /// 验证二维码
    /// </summary>
    Task<bool> VerifyCodeAsync(string secret, string code);
}
```
4. 下载对应的验证器APP
- Microsoft Authenticator
- Google Authenticator

5. 登录接口提供了需要2FA验证
```csharp
public interface IAccountAppService: IApplicationService
{
    /// <summary>
    /// 用户名密码登录
    /// </summary>
    Task<LoginOutput> LoginAsync(LoginInput input);
    /// <summary>
    /// 双因素验证登录
    /// </summary>
    Task<LoginOutput> Login2FAAsync(Login2FAInput input);
}
```

## 使用
### 默认Setting配置
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/2fa-setting.png)
- 颁发者,可以配置你的项目名称，这个名称将会显示在认证APP上
- 二维码图片大小，默认3

### 账户如何开启双因素验证
1. 点击右上角我的头像，进入我的账户.
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/2fa-profile.png)
2. 打开Microsoft Authenticator或者Google Authenticator
3. 扫描二维码
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/2fa-app.jpg)
4. 输入验证码，点击开启既可以。
5. **开始之后登录时每次需要打开APP输入验证码才能登录**

### 账户如何关闭双因素验证
1. 点击右上角我的头像，进入我的账户.
2. 输入验证码关闭
- ![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/2fa-close.png)

## 忘记验证码怎么办?
- 我们可能因为换手机了，或者其它原因倒是忘记验证码了。
- 这个时候联系管理员，在用户管理，操作重置双因素验证，然后你在继续上述步骤重新绑定即可。
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/2fa-reset.png)

## 说明
- 启用双因素验证，在abpuser表的TwoFactorEnabled字段会设置为true
- 当前账户的双因素密钥保存在扩展字段中
```json
{"TwoFactorySecret":"REPEYQKXUUFKS62GQHGAWRMBCKV7KU6G"}
```

