---
sidebar:
  sort: 2
---

# 钉钉

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
| ClientId | AppKey | wx1234567890abcdef |
| ClientSecret | AppSecret | secret_key |
| ClientName | 应用名称 | 应用名称  |
| RedirectUrl | 回调地址 | https://domain.com/callback |

- 回调地址格式：
1. redirect_uri:回调地址 https//domain.com/auth/oidc-login,只需要把https//domain.com替换为你的域名即可，**然后进行urlencode编码放入到完整的回调地址中**
2. client_id=配置的client_id

- 完整地址：

1. **https://login.dingtalk.com/oauth2/auth?client_id=ding8m78mrovsjydeiq5&response_type=code&scope=openid corpid&state=DingTalk&redirect_uri=http%3A%2F%2Flocalhost%3A4200%2Fauth%2Foidc-login**


##钉钉开发者平台配置

1. 登录[钉钉开放平台](https://open.dingtalk.com/)
2. 创建企业内部应用或第三方应用
3. 获取以下信息：
   - AppKey (对应ClientId)
   - AppSecret (对应ClientSecret)
   - 回调地址 (RedirectUrl)

