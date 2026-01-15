---
sidebar:
  sort: 6
---

# 功能模块

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


##  概述

- 功能模块（Feature Module）是框架功能管控体系的核心业务模块，基于 ABP 功能管理框架构建，提供功能项的定义、启用/禁用、租户差异化授权等能力，支持按租户订阅套餐精细化管控功能访问权限，适配 SaaS 场景下不同租户的功能分级需求，实现功能的灵活扩展与精准管控。

##  核心功能

###  功能项定义与管理
支持功能项的标准化定义与全生命周期管理，核心能力包括：
- 功能项定义：支持通过代码定义系统功能项，指定功能名称、显示名称、描述、、数据类型（布尔型/数值型/文本型）等元信息；
- 功能项分组：支持按业务模块对功能项分组（如“用户管理功能组”“订单管理功能组”），提升管理可读性；



##  数据库配置

- 配置数据库连接字符串，在 appsettings.json 中设置目标数据库连接信息（以 MySQL 为例）

```json


"ConnectionStrings": {
    "Default": "Server=localhost;Database=YourDbName;Uid=root;Pwd=yourPassword;"
}
    
```

- 不使用Default数据库连接字符串（独立存储功能相关数据）

```json


"ConnectionStrings": {
    "AbpFeatureManagement": "Server=localhost;Database=YourFeatureDbName;Uid=root;Pwd=yourPassword;"
}
    
```

##  自定义表前缀

- 通过配置 AbpFeatureManagementDbProperties.DbTablePrefix 自定义数据表前缀，例如：

```csharp


public override void PreConfigureServices(ServiceConfigurationContext context)
{
    // 自定义表前缀为 "Sys_"，生成表如 Sys_Features、Sys_TenantFeatures
    AbpFeatureManagementDbProperties.DbTablePrefix = "Sys_";
}
    
```

##  数据表说明

|表名|核心作用|关键字段说明|
|---|---|---|
|AbpFeatures|功能项定义表，存储系统所有功能项的元信息，用于统一管理功能项的基础配置与属性|GroupName（非空，功能分组名称）、Name（非空，功能项名称）、ParentName（父功能项名称）、DisplayName（非空，功能项显示名称）、Description（功能项描述）、DefaultValue（功能项默认值）、IsVisibleToClients（非空，是否对客户端可见）、IsAvailableToHost（非空，是否对宿主可用）、AllowedProviders（允许的提供者）、ValueType（值类型）、ExtraProperties（额外属性）|
|AbpFeatureValues|功能值配置表，存储不同提供者（如租户、用户）的功能启用状态与具体配置值|Name（非空，功能项名称）、Value（非空，功能配置值）、ProviderName（提供者名称）、ProviderKey（提供者键值）|
|AbpFeatureGroups|功能分组表，存储功能分组的元信息，用于对功能项进行分类管理|Name（varchar(128)，非空，分组名称）、DisplayName（varchar(256)，非空，分组显示名称）、ExtraProperties（text，额外属性）|