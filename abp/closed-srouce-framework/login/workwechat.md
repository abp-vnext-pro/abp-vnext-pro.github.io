---
sidebar:
  sort: 3
---
# 企业微信

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
| AgentId | 应用AgentId | 1000001 |
| ClientId | 企业ID(corpid) | wx1234567890abcdef |
| ClientSecret | 应用Secret(corpsecret) | secret_key |
| ClientName | 应用名称 | 企业微信登录 |
| RedirectUrl | 回调地址 | https://domain.com/callback |

- 回调地址格式：
1. redirect_uri:回调地址 https//domain.com/auth/oidc-login,只需要把https//domain.com替换为你的域名即可，**然后进行urlencode编码放入到完整的回调地址中**
2. appid=配置的agentid
3. agentid=应用AgentId

- 完整地址：

1. **https://login.work.weixin.qq.com/wwlogin/sso/login/?login_type=CorpApp&appid=配置的CientId&agentid=应用AgentId&redirect_uri=https%3A%2F%2Fda3eb9217aaf.ngrok-free.app%2Fauth%2Foidc-login&state=WorkWechat**

## 企业微信后台配置
- 登录企业微信后台[https://work.weixin.qq.com/](https://work.weixin.qq.com/)
1. 创建应用
2. 添加回调地址：在企业微信授权登录下设置[官方地址](https://developer.work.weixin.qq.com/document/path/91335)
3. 获取应用ID和密钥
4. 网页授权及JS-SDK
5. 企业可信IP


