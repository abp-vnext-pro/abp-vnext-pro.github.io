---
sidebar:
  sort: 3
---
# 数据字典模块


## 如何集成
- 在对应的层添加对应的引用
- 添加 DependsOn(typeof(DataDictionaryManagementXxxModule)) 特性到对应模块
    - Lion.AbpPro.DataDictionaryManagement.Application
    - Lion.AbpPro.DataDictionaryManagement.Application.Contracts
    - Lion.AbpPro.DataDictionaryManagement.Domain
    - Lion.AbpPro.DataDictionaryManagement.Domain.Shared
    - Lion.AbpPro.DataDictionaryManagement.EntityFrameworkCore
    - Lion.AbpPro.DataDictionaryManagement.HttpApi
    - Lion.AbpPro.DataDictionaryManagement.HttpApi.Client
- 在自己的dbcontext中实现接口：IDataDictionaryManagementDbContext
- 在 EntityFrameworkCore 层添加数据库配置在 AbpProDbContext.cs 的 OnModelCreating()方法中添加 builder.ConfigureDataDictionaryManagement();

## 如何配置单独数据库
- 数据库连接名称：DataDictionaryManagement
- 在appsetting.json下配置

```json
 "ConnectionStrings": {
    "Default": "Data Source=localhost;Database=LionAbpProDB;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true",
    "DataDictionaryManagement": "Data Source=localhost;Database=DataDictionaryManagement;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true"
  }
```
## 配置不同租户的数据库连接
- 在租户管理的数据库连接字符串管理中配置
- 这个要事先把表结构生成

## 如何修改表前缀
- DataDictionaryManagementDbProperties.DbTablePrefix
    - 重新指定即可
```csharp
public static class DataDictionaryManagementDbProperties
{
    public static string DbTablePrefix { get; set; } = "Abp";
    public static string DbSchema { get; set; } = null;
    public const string ConnectionStringName = "DataDictionaryManagement";
}
```

::: warning 数据库连接
如果没有指定DataDictionaryManagement数据连接名称,都会使用**Default**的数据库连接.
:::

## 表结构说明
**DataDictionary** 表结构：

| 字段名               | 描述         | 类型                       |
| :------------------- | :----------- | :------------------------- |
| Id                   | Id           | Guid                       |
| TenantId             | 租户 id      | Guid?                      |
| Code                 | 字典编码     | string                     |
| DisplayText          | 显示名       | string                     |
| Description          | 描述         | DateTime                   |
| Details              | 字典明细     | List
| IsDeleted            | 是否删除     | bool                       |
| DeleterId            | 删除人       | Guid?                      |
| DeletionTime         | 删除时间     | DateTime                   |
| LastModifierId       | 最后修改人   | Guid?                      |
| LastModificationTime | 最后修改时间 | DateTime                   |
| CreatorId            | 创建人       | Guid?                      |
| CreationTime         | 创建时间     | DateTime                   |

**DataDictionaryDetail** 表结构：

| 字段名               | 描述              | 类型     |
| :------------------- | :---------------- | :------- |
| Id                   | Id                | Guid     |
| DataDictionaryId     | 所属字典 Id       | Guid     |
| Order                | 排序              | Int      |
| Code                 | 字典编码          | string   |
| IsEnabled            | 启/停用(默认启用) | bool     |
| DisplayText          | 显示名            | string   |
| Description          | 描述              | DateTime |
| IsDeleted            | 是否删除          | bool     |
| DeleterId            | 删除人            | Guid?    |
| DeletionTime         | 删除时间          | DateTime |
| LastModifierId       | 最后修改人        | Guid?    |
| LastModificationTime | 最后修改时间      | DateTime |
| CreatorId            | 创建人            | Guid?    |
| CreationTime         | 创建时间          | DateTime | 

## 默认领域服务
- 注入既可以使用IDataDictionaryManager操作数据字典相关功能。