---
sidebar:
  sort: 5
---
# Gitee

::: tip 注意
- 当前模块需要付费使用,需要找作者购买源码(购买vben5版本即可)
- 联系方式: 510423039@qq.com
- 微信号：WJLXRzzZ
:::

## 配置
1. 添加引用Lion.AbpPro.Oidc
2. 添加AbpProOidcModule模块依赖
3. 通过setting配置github登录相关

### 配置项说明

| 配置项 | 说明 | 示例 |
|--------|------|------|
| HostUrl | 企业微信API基础地址 | https://qyapi.weixin.qq.com |
| ClientId | ClientId | wx1234567890abcdef |
| ClientSecret | ClientSecret | secret_key |
| ClientName | 应用名称 | 应用名称  |
| RedirectUrl | 回调地址 | https://domain.com/callback |

- 回调地址格式：
1. redirect_uri:回调地址 https//domain.com/auth/oidc-login,只需要把https//domain.com替换为你的域名即可，**然后进行urlencode编码放入到完整的回调地址中**
2. client_id=配置的client_id

- 完整地址：

1. **https://gitee.com/oauth/authorize?client_id=你的clientId&redirect_uri=你的回调地址&response_type=code&state=Gitee**




