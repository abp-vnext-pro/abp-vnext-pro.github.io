# 主数据管理模块
::: tip 注意
- 当前模块需要付费使用,需要找作者购买源码(购买vben5版本即可)
- 联系方式: 510423039@qq.com
- 微信号：WJLXRzzZ
:::


## 如何集成
### 后端
1. 在对应的层添加对应的引用
2. 添加 DependsOn(typeof(MasterDataManagementXxxModule)) 特性到对应模块
    - Lion.AbpPro.MasterDataManagement.Application
    - Lion.AbpPro.MasterDataManagement.Application.Contracts
    - Lion.AbpPro.MasterDataManagement.Domain
    - Lion.AbpPro.MasterDataManagement.Domain.Shared
    - Lion.AbpPro.MasterDataManagement.EntityFrameworkCore
    - Lion.AbpPro.MasterDataManagement.HttpApi
    - Lion.AbpPro.MasterDataManagement.HttpApi.Client
3. 在自己的dbcontext中实现接口：IMasterDataManagementDbContext
4. 在 EntityFrameworkCore 层添加数据库配置在 AbpProDbContext.cs 的 OnModelCreating()方法中添加 builder.ConfigureMasterDataManagement();
5. 执行ef迁移


## 如何配置单独数据库
- 数据库连接名称：MasterDataManagement
- 在appsetting.json下配置

```json
 "ConnectionStrings": {
    "Default": "Data Source=localhost;Database=LionAbpProDB;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true",
    "MasterDataManagement": "Data Source=localhost;Database=MasterDataManagement;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true"
  }
```
## 配置不同租户的数据库连接
- 在租户管理的数据库连接字符串管理中配置
- 这个要事先把表结构生成

## 如何修改表前缀
- MasterDataManagementDbProperties.DbTablePrefix
    - 重新指定即可
```csharp
public static class MasterDataManagementDbProperties
{
    public static string DbTablePrefix { get; set; } = "AbpPro";
    public static string DbSchema { get; set; } = null;
    public const string ConnectionStringName = "MasterDataManagement";
}
```

::: warning 数据库连接
如果没有指定MasterDataManagement数据连接名称,都会使用**Default**的数据库连接.
:::
