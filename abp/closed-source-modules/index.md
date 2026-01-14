---
group:
  text: 💎Vben5模块
  sort: 5
  collapsed: true
---

# 动态菜单模块
::: tip 注意
- 当前模块需要付费使用,需要找作者购买源码(购买vben5版本即可)
- 联系方式: 510423039@qq.com
- 微信号：WJLXRzzZ
:::
## Vben5如何启用动态菜单
- 调整对应项目下的preferences.ts

```ts
import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  app: {
    accessMode: 'backend', // 默认值frontend|backend 默认值frontend可不填写
  }
});

- 如果切换了动态菜单,需要清理浏览器缓存。
```
## 后端集成
1. 在对应的层添加对应的引用
2. 添加 DependsOn(typeof(DynamicMenuManagementXxxModule)) 特性到对应模块
    - Lion.AbpPro.DynamicMenuManagement.Application
    - Lion.AbpPro.DynamicMenuManagement.Application.Contracts
    - Lion.AbpPro.DynamicMenuManagement.Domain
    - Lion.AbpPro.DynamicMenuManagement.Domain.Shared
    - Lion.AbpPro.DynamicMenuManagement.EntityFrameworkCore
    - Lion.AbpPro.DynamicMenuManagement.HttpApi
    - Lion.AbpPro.DynamicMenuManagement.HttpApi.Client
3. 在自己的dbcontext中实现接口：IDynamicMenuManagementDbContext
4. 在 EntityFrameworkCore 层添加数据库配置在 AbpProDbContext.cs 的 OnModelCreating()方法中添加 builder.ConfigureDynamicMenuManagement();
5. 执行ef迁移


### 如何配置单独数据库
- 数据库连接名称：DynamicMenuManagement
- 在appsetting.json下配置

```json
 "ConnectionStrings": {
    "Default": "Data Source=localhost;Database=LionAbpProDB;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true",
    "DynamicMenuManagement": "Data Source=localhost;Database=DynamicMenuManagement;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true"
  }
```

### 如何修改表前缀
- DynamicMenuManagementDbProperties.DbTablePrefix
    - 重新指定即可
```csharp
public static class DynamicMenuManagementDbProperties
{
    public static string DbTablePrefix { get; set; } = "Abp";
    public static string DbSchema { get; set; } = null;
    public const string ConnectionStringName = "DynamicMenuManagement";
}
```

::: warning 数据库连接
如果没有指定DynamicMenuManagement数据连接名称,都会使用**Default**的数据库连接.
:::

![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/menu1.png)
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/menu2png.png)

::: tip 注意
- 动态菜单的授权策略就是权限管理的授权策略。
:::
