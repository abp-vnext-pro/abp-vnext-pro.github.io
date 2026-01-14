---
sidebar:
  sort: 3
---

# 多租户
- vben2.8和vben5前后端都是支持多租户的。
- vben5如果要闭关多租户，只需要通过以下设置即可，**前后端都会自动屏蔽租户相关功能**。
- vben2.8如果要闭关多租户，需要手动注释前端登录界面租户选项

### 启用或者关闭
- 在appsetting.json配置
```json
  "MultiTenancy": {
    "Enabled": true
  }
```
- 如果要关闭租户，只要把IsEnabled设置为false

### Vben5前端
- 如果开启多租户，前端登录界面会加载租户选项。
- 如果关闭多租户，前端登录界面会关闭租户选项，并且屏蔽租户权限和租户的所有菜单。

### 效果
- 开启多租户
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/tanant-1.png)

- 关闭多租户
    - 上面所看到的租户相关的全部会隐藏

::: tip 注意
- Abp会自动解析出租户，后续所有的接口请求，请求头都带上租户Id(__tenant)，Abp会根据租户Id，自动过滤数据。
- 如果使用独立数据库，会自动切换到对应的数据库。
:::    