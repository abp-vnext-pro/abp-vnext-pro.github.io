---
sidebar:
  sort: 5
---

# 设置模块

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
- 设置模块（Setting Module）是框架配置管理体系的核心业务模块，基于 ABP 配置系统构建，提供多维度的配置项管理能力，支持系统级、租户级、用户级的配置隔离与继承，实现配置的统一存储、动态读取与灵活扩展，适配不同环境、不同租户、不同用户的个性化配置需求。
- 请参考[设置定义和使用](/abp/open-srouce-framework/setting)

## 核心功能

### 多层级配置管理
支持按层级划分配置范围，实现配置的精准管控与继承，核心层级包括：
- 系统级配置：全局统一生效的配置（如系统名称、默认时区、全局缓存策略等），由系统管理员维护；
- 租户级配置：仅对特定租户生效的配置（如租户专属主题、租户邮件服务器配置等），继承系统级配置，可覆盖系统默认值；
- 用户级配置：仅对特定用户生效的个性化配置（如用户界面布局、通知偏好、语言设置等），继承租户级配置，可覆盖租户默认值；
- 配置继承优先级：用户级配置 > 租户级配置 > 系统级配置，不存在则使用默认值。

### 配置项管理
提供配置项的完整生命周期管理，核心能力包括：
- 配置项定义：支持通过代码注解或配置类定义系统配置项，指定配置名称、默认值、数据类型、描述等元信息；
- 配置项读写：提供统一的 API 接口与服务，支持配置项的动态读取、修改、保存操作；
- 配置项验证：支持对配置值进行合法性验证（如数值范围、格式校验等），确保配置有效；
- 配置分组：支持按业务场景对配置项分组（如“系统基础配置”“邮件配置”“安全配置”），提升管理效率。

### 配置存储与缓存

保障配置访问的高效性与可靠性，核心能力包括：
- 多存储方式支持：默认支持数据库存储，可扩展至文件、Redis 等存储介质；
- 配置缓存优化：自动缓存常用配置项，减少数据库查询次数，提升系统性能；
- 缓存自动刷新：配置项修改后自动刷新缓存，确保配置变更实时生效；

### 动态配置与热更新
支持配置项的动态调整与实时生效，无需重启系统，核心能力包括：
- 热更新支持：修改配置项后无需重启应用，配置变更实时作用于系统；
- 配置变更通知：支持订阅配置变更事件，当指定配置项修改时触发自定义业务逻辑（如配置变更后重新初始化组件）；

### 配置权限管控
与权限模块深度集成，实现配置项的精细化权限控制，核心能力包括：
- 配置操作权限：按层级划分配置操作权限（如系统配置仅允许系统管理员修改，租户配置允许租户管理员修改）；
- 配置查看权限：控制不同角色对配置项的查看范围，避免敏感配置泄露；
- 权限自动校验：配置操作时自动校验当前用户权限，无权限操作时拦截并返回提示。


##  数据库配置

- 配置数据库连接字符串，在 appsettings.json 中设置目标数据库连接信息（以 MySQL 为例）

```json


"ConnectionStrings": {
    "Default": "Server=localhost;Database=YourDbName;Uid=root;Pwd=yourPassword;"
}
    
```

- 不使用Default数据库连接字符串（独立存储配置数据）

```json


"ConnectionStrings": {
    "AbpSettingManagement": "Server=localhost;Database=YourSettingDbName;Uid=root;Pwd=yourPassword;"
}
    
```

##  自定义表前缀

- 通过配置 AbpSettingManagementDbProperties.DbTablePrefix 自定义数据表前缀，例如：

```csharp


public override void PreConfigureServices(ServiceConfigurationContext context)
{
    // 自定义表前缀为 "Sys_"，生成表如 Sys_Settings、Sys_SettingDefinitions
    AbpSettingManagementDbProperties.DbTablePrefix = "Sys_";
}
    

## 数据表说明
|表名|核心作用|关键字段说明|
|---|---|---|
|AbpSettings|配置值存储表，存储各层级的具体配置数据|Id（配置记录唯一标识）、Name（配置项名称）、Value（配置值）、TenantId（租户ID，为空表示系统级）、UserId（用户ID，为空表示非用户级）、CreationTime（创建时间）、LastModificationTime（最后修改时间）|
|AbpSettingDefinitions|配置项定义表，存储系统所有配置项的元信息|Id、Name（配置项名称）、DisplayName（显示名称）、Description（描述）、DefaultValue（默认值）、ValueType（数据类型，如String/Int/Bool）、IsVisibleToClients（是否对客户端可见）、IsInherited（是否支持继承）、Group（配置分组）|
|AbpSettingDefinitionGroups|配置分组表，存储配置分组的元信息|Id、Name（分组名称）、DisplayName（显示名称）、Description（分组描述）、Order（显示顺序）|