---
outline: deep
---

# 登录
::: tip 注意
- ABP vNext Pro 没有集成 IdentityServer4 或者 OpenIddict,而是直接使用默认的 Asp Net Core Identity。
- 减少系统复杂度
- 会对接第三方登录，如：微信、QQ、微博等只要实现了 OAuth2 协议即可
:::


## 登录接口

```cs [AccountAppService.cs]
public virtual async Task<LoginOutput> LoginAsync(LoginInput input)
{
    var result = await _signInManager.PasswordSignInAsync(input.Name, input.Password, false, true);
    if (result.IsNotAllowed)
    {
        throw new BusinessException(BasicManagementErrorCodes.UserLockedOut);
    }
    if (!result.Succeeded)
    {
        throw new BusinessException(BasicManagementErrorCodes.UserOrPasswordMismatch);
    }
    var user = await _userManager.FindByNameAsync(input.Name);
    return await BuildResult(user);
}
```

## 配置 AccessToken

```json [appsetting.json]
 "Jwt": {
    "Audience": "Lion.AbpPro",
    "SecurityKey": "dzehzRz9a8asdfasfdadfasdfasdfafsdadfasbasdf=",
    "Issuer": "Lion.AbpPro",
    "ExpirationTime": 30
  }
```

- Audience:接收对象
- Issuer:签发主体
- SecurityKey:密钥
- ExpirationTime:过期时间(单位小时)
