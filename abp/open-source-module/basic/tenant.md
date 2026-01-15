---
sidebar:
  sort: 4
---

# 租户模块
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

- 租户模块（Tenant Module）是框架多租户架构的核心业务模块，基于 ABP 多租户设计理念构建，提供租户全生命周期管理能力，实现不同租户间的资源隔离（数据、权限、配置等），支持 SaaS（软件即服务）场景下的多租户运营与管控，保障租户数据安全与业务独立。

## 核心功能

### 租户管理

提供完整的租户生命周期管控，核心能力包括：
- 租户创建：支持宿主管理员创建租户，配置租户基础信息（租户名称、管理员账户等）；
- 租户信息维护：支持修改租户基础信息；
- 租户删除：支持安全删除租户。

### 租户隔离
实现多维度的租户资源隔离，保障租户数据安全与业务独立，核心能力包括：
- 数据隔离：通过租户ID过滤机制，确保租户只能访问自身所属数据，支持共享数据与私有数据区分；
- 权限隔离：租户内的角色、权限仅对当前租户生效，租户管理员无法操作其他租户的权限资源；
- 配置隔离：支持租户自定义自身的系统配置（如邮件配置、缓存配置等），不影响其他租户；

###  租户管理员管理

支持租户管理员账户的专属管控，核心能力包括：
- 初始管理员创建：创建租户时自动生成租户初始管理员账户，用于租户首次登录与内部管理；
- 管理员权限管控：租户管理员默认拥有租户内全量管理权限，可由宿主精细化调整其权限范围；
- 管理员账户重置：支持宿主或租户超级管理员重置租户管理员密码，保障账户安全。


###  数据库配置

- 配置数据库连接字符串，在 appsettings.json 中设置目标数据库连接信息（以 MySQL 为例）

```json

"ConnectionStrings": {
    "Default": "Server=localhost;Database=YourDbName;Uid=root;Pwd=yourPassword;"
}
    
```

- 不使用Default数据库连接字符串（独立存储租户相关数据）

```json

"ConnectionStrings": {
    "AbpTenantManagement": "Server=localhost;Database=YourTenantDbName;Uid=root;Pwd=yourPassword;"
}
    
```

## ## 自定义表前缀

- 通过配置 AbpTenantManagementDbProperties.DbTablePrefix 自定义数据表前缀，例如：

```csharp

public override void PreConfigureServices(ServiceConfigurationContext context)
{
    // 自定义表前缀为 "Sys_"，生成表如 Sys_Tenants、Sys_TenantConnections
    AbpTenantManagementDbProperties.DbTablePrefix = "Sys_";
}
    
```

## ## 数据表说明

|表名|核心作用|关键字段说明|
|---|---|---|
|AbpTenants|租户核心信息表，存储租户基础配置|Id（租户唯一标识）、Name（租户名称）、CreationTime（创建时间）|
|AbpTenantConnections|租户数据库连接表，存储租户独立数据库配置（可选）|Id、TenantId（关联AbpTenants.Id）、Name（连接字符串名称）、Value（连接字符串）|
