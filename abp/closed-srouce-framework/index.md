---
group:
  text: 💎Vben5功能
  sort: 4
  collapsed: true  
---

::: tip 注意
- 当前模块需要付费使用,需要找作者购买源码(购买vben5版本即可)
- 联系方式: 510423039@qq.com
- 微信号：WJLXRzzZ
:::

# 无感刷新

::: tip 前言

此功能只有vben5版本才支持
:::

无感刷新（Seamless Token Refresh）是一种在用户会话期间自动管理和更新身份验证令牌（通常是访问令牌）的技术。其主要目的是在用户的访问令牌过期时，通过后台静默地刷新令牌，从而确保用户无需手动重新登录，维持流畅的用户体验。

## RefreshToken
- 当用户登录成功,接口会返回accessToken和refreshToken
- 如果用户在操作系统的时候接口返回401，此时系统会自动调用接口通过refreshToken自动获取刷新accessToken
- 接口地址：api/app/account/refresh-token
- token信息保存在AbpProUserRefreshToken表中
- 每个refresh-token只能使用一次

## 配置
- appsetting.json
```json
  "Jwt": {
    "Audience": "Lion.AbpPro",
    "SecurityKey": "dzehzRz9a8asdfasfdadfasdfasdfafsdadfasbasdf=",
    "Issuer": "Lion.AbpPro",
    "ExpirationTime": 2 , // 单位小时，accessToken有效时间
    "RefreshExpirationTime": 168 // 7*24 单位小时，refreshToken有效时间 默认7天
  }
```

## 效果
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/refresh-token.gif)

