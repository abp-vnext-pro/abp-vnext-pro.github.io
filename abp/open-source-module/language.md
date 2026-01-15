---
sidebar:
  sort: 4
---
# 多语言模块
::: info LanguageManagement

- 支持动态新增和修改多语言(这个多语言是针对后端的)。
    - 前后端的多语言是分开的，前端的多语言比如按钮的多语言是在前端定义的/locales文件夹下
- 当前模块在生成项目的时候**默认会集成**
:::

- [Github仓库地址](https://github.com/WangJunZzz/abp-vnext-pro/tree/main/aspnet-core/modules/LanguageManagement)
- [Gitee仓库地址](https://gitee.com/WangJunZzz/abp-vnext-pro/tree/main/aspnet-core/modules/LanguageManagement)


## 如何集成
- 在对应的层添加对应的引用
- 添加 DependsOn(typeof(LanguageManagementXxxModule)) 特性到对应模块
    - Lion.AbpPro.LanguageManagement.Application
    - Lion.AbpPro.LanguageManagement.Application.Contracts
    - Lion.AbpPro.LanguageManagement.Domain
    - Lion.AbpPro.LanguageManagement.Domain.Shared
    - Lion.AbpPro.LanguageManagement.EntityFrameworkCore
    - Lion.AbpPro.LanguageManagement.HttpApi
    - Lion.AbpPro.LanguageManagement.HttpApi.Client
- 在自己的dbcontext中实现接口：ILanguageManagementDbContext
- 在 EntityFrameworkCore 层添加数据库配置在 AbpProDbContext.cs 的 OnModelCreating()方法中添加 builder.ConfigureLanguageManagement();


## 如何配置单独数据库
- 数据库连接名称：LanguageManagement
- 在appsetting.json下配置

```json
 "ConnectionStrings": {
    "Default": "Data Source=localhost;Database=LionAbpProDB;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true",
    "LanguageManagement": "Data Source=localhost;Database=LanguageManagement;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true"
  }
```
## 配置不同租户的数据库连接
- 在租户管理的数据库连接字符串管理中配置
- 这个要事先把表结构生成

## 如何修改表前缀
- LanguageManagementDbProperties.DbTablePrefix
    - 重新指定即可
```csharp
public static class LanguageManagementDbProperties
{
    public static string DbTablePrefix { get; set; } = "Abp";
    public static string DbSchema { get; set; } = null;
    public const string ConnectionStringName = "LanguageManagement";
}
```

::: warning 数据库连接
如果没有指定LanguageManagement数据连接名称,都会使用**Default**的数据库连接.
:::

## 表结构说明
**Language** 表结构：

| 字段名               | 描述         | 类型                       |
| :------------------- | :----------- | :------------------------- |
| Id                   | Id           | Guid                       |
| TenantId             | 租户 id      | Guid?                      |
| CultureName                 | 语言名称     | string                     |
| UiCultureName          | Ui语言名称       | string                     |
| DisplayName          | 显示名称         | string                   |
| FlagIcon              | 图标     | string           |
| IsEnabled            | 是否启用     | bool                       |
| IsDefault            | 是否默认语言     | bool                       |
| IsDeleted            | 是否删除     | bool                       |
| DeleterId            | 删除人       | Guid?                      |
| DeletionTime         | 删除时间     | DateTime                   |
| LastModifierId       | 最后修改人   | Guid?                      |
| LastModificationTime | 最后修改时间 | DateTime                   |
| CreatorId            | 创建人       | Guid?                      |
| CreationTime         | 创建时间     | DateTime                   |

**LanguageText** 表结构：

| 字段名               | 描述              | 类型     |
| :------------------- | :---------------- | :------- |
| Id                   | Id                | Guid     |
| CultureName     | 语言名称      | string     |
| ResourceName                | 资源名称              | string      |
| Name                 | 名称          | string   |
| Value            | Value | string     |
| IsDeleted            | 是否删除          | bool     |
| DeleterId            | 删除人            | Guid?    |
| DeletionTime         | 删除时间          | DateTime |
| LastModifierId       | 最后修改人        | Guid?    |
| LastModificationTime | 最后修改时间      | DateTime |
| CreatorId            | 创建人            | Guid?    |
| CreationTime         | 创建时间          | DateTime | 
