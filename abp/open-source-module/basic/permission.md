---
sidebar:
  sort: 2
---

# 权限模块
::: info 
<span style="color:red;font-size:20px">当前模块聚合到BasicManagement模块,包含：</span>
- 账户模块
- 权限模块
- 设置模块
- 功能模块
- 租户模块
- 调度模块
- 审计日志模块

<span style="color:red;font-size:20px">所以在使用以上功能，只需要集成BasicManagement模块(默认已集成)</span>
:::

## 概述

- 权限模块（Permission Module）是框架核心业务模块之一，基于 ABP 声明式权限设计理念构建，与账户模块、用户模块深度耦合，专注于提供“用户-角色-权限”的精细化层级管控方案，实现对系统资源（接口、页面、操作按钮等）的访问控制，保障系统资源访问的安全性和可控性。
- 请参考[权限定义和使用](/abp/open-srouce-framework/authorization)

##  核心功能

### 权限项定义与管理

支持系统级、模块级、功能级的权限项分层定义，核心能力包括：
- 权限分层：按“系统-模块-功能”三级划分（如“AbpIdentity.Users.Create”），便于归类管理；
- 权限元数据管理：包含权限唯一名称、显示名称、描述、启用状态等元数据配置；
- 权限依赖：支持配置权限间依赖关系（如“创建用户”依赖“查看用户”权限）；

###  权限授予与回收

实现权限的灵活分配与回收，核心能力包括：
- 多主体支持：支持向角色（主流方式）和用户（个体微调）直接授予权限；
- 权限继承：用户自动继承所属角色的权限，支持用户专属权限叠加；
- 批量操作：支持批量授予/回收某一权限组的所有权限，提升管理效率；
- 操作追溯：记录权限授予/回收的时间、操作人等信息，支持审计追溯。

### 运行时权限校验

提供多层级权限校验方式，核心能力包括：
- API接口校验：通过 [Authorize(PermissionName)] 特性自动拦截未授权请求；
- 业务逻辑校验：通过 IPermissionChecker 服务手动校验权限；

###  多租户权限隔离

针对多租户系统提供权限隔离机制，核心能力包括：
- 租户权限独立：各租户可独立管理自身角色和权限，权限仅对当前租户生效；
- 宿主管控：宿主可定义租户级通用权限，支持宿主管理员跨租户权限管理；
- 数据隔离：通过多租户过滤器自动隔离不同租户的权限数据。

###  权限日志与审计

记录权限相关关键操作日志，核心能力包括：
- 操作日志：记录权限授予/回收的详细信息；
- 校验日志：记录权限校验失败的请求信息，便于排查非法访问；
- 日志持久化：支持日志存储与查询，便于管理员审计。

## 数据库配置

- 配置数据库连接字符串，在 appsettings.json 中设置目标数据库连接信息（以 MySQL 为例）

```json

"ConnectionStrings": {
    "Default": "Server=localhost;Database=YourDbName;Uid=root;Pwd=yourPassword;"
}
    
```

- 不使用Default数据库连接字符串

```json

"ConnectionStrings": {
    "AbpPermissionManagement": "Server=localhost;Database=YourDbName;Uid=root;Pwd=yourPassword;"
}
    
```

##  自定义表前缀

- 通过配置 AbpPermissionManagementDbProperties.DbTablePrefix 自定义数据表前缀，例如：

```csharp

public override void PreConfigureServices(ServiceConfigurationContext context)
{
    // 自定义表前缀为 "Sys_"，生成表如 Sys_Permissions、Sys_PermissionGrants
    AbpPermissionManagementDbProperties.DbTablePrefix = "Sys_";
}
    
```

##  数据表说明

|表名|核心作用|关键字段说明|
|---|---|---|
|AbpPermissions|权限定义表，存储系统所有权限项元数据|Id（权限标识）、Name（权限名称）、DisplayName（显示名称）、Description（描述）、IsEnabled（是否启用）、ParentName（父权限名称）、CreationTime（创建时间）|
|AbpPermissionGrants|权限授予记录表，权限校验的核心依据|Id（授予记录标识）、Name（权限名称）、ProviderName（主体类型：Role/User）、ProviderKey（主体ID）、TenantId（租户ID）、CreationTime（授予时间）|
|AbpPermissionGroups|权限组表，实现权限项分组管理（可选）|Id（权限组标识）、Name（组名称）、DisplayName（显示名称）、Description（组描述）|
