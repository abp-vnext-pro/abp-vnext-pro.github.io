---
sidebar:
  sort: 8
---

# 审计日志模块

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
- 审计日志模块（Audit Log Module）是框架安全管控体系的核心业务模块，基于 ABP 审计日志框架构建，提供系统操作全链路的日志记录、存储、查询与分析能力，实现对用户操作、系统行为的追溯与审计，保障系统操作合规性，助力安全事件排查与责任界定。

##  核心功能

###  操作日志记录
自动或手动记录系统关键操作行为，核心记录范围包括：
- 用户操作记录：记录用户登录/登出、账户信息修改、权限分配、数据增删改查等核心业务操作；
- 系统行为记录：记录系统启动/关闭、配置变更、模块加载、异常抛出等系统级行为；
- 请求日志记录：记录 HTTP 请求详情（请求地址、请求方法、请求参数、响应状态、响应时间、客户端 IP、浏览器信息等）；

### 日志核心信息存储
规范日志数据存储结构，确保审计追溯的完整性，核心存储信息包括：
- 操作主体信息：操作用户ID、用户名、租户ID、租户名称（多租户场景）；
- 操作上下文信息：操作时间、客户端IP地址、客户端名称（浏览器/应用）、操作地点（IP解析）；
- 操作内容信息：操作类型、操作描述、涉及的业务对象（如用户ID、订单ID）、操作前后数据对比；
- 操作结果信息：操作状态（成功/失败）、错误信息（操作失败时）、耗时（接口/操作执行时长）。

###  日志查询与筛选
提供多维度的日志查询能力，支持精准定位目标日志，核心查询方式包括：
- 基础条件查询：按操作时间范围、操作用户、租户、操作类型、操作状态等基础条件筛选；
- 高级条件查询：按请求地址、客户端IP、业务对象ID、错误关键词等精准查询；
- 日志排序：支持按操作时间、耗时等字段升序/降序排序；
- 分页查询：支持分页加载大量日志数据，提升查询性能与体验。


##  数据库配置
- 配置数据库连接字符串，在 appsettings.json 中设置目标数据库连接信息（以 MySQL 为例）

```json


"ConnectionStrings": {
    "Default": "Server=localhost;Database=YourDbName;Uid=root;Pwd=yourPassword;"
}
    
```

- 不使用Default数据库连接字符串（独立存储审计日志数据，提升主库性能）

```json


"ConnectionStrings": {
    "AbpAuditLogging": "Server=localhost;Database=YourAuditLogDbName;Uid=root;Pwd=yourPassword;"
}
    
```

## 自定义表前缀

- 通过配置 AbpAuditLoggingDbProperties.DbTablePrefix 自定义数据表前缀，例如：

```csharp

public override void PreConfigureServices(ServiceConfigurationContext context)
{
    // 自定义表前缀为 "Sys_"，生成表如 Sys_AuditLogs、Sys_AuditLogActions
    AbpAuditLoggingDbProperties.DbTablePrefix = "Sys_";
}
    
```

##  数据表说明
|表名|核心作用|关键字段说明|
|---|---|---|
|AbpAuditLogs|审计日志主表，存储操作主体与上下文核心信息|Id（日志唯一标识）、TenantId（租户ID）、UserId（操作用户ID）、UserName（用户名）、ClientIpAddress（客户端IP）、ClientName（客户端名称）、BrowserInfo（浏览器信息）、ExecutionTime（操作时间）、ExecutionDuration（耗时，毫秒）、Status（操作状态：Success/Failed）、Exception（异常信息）|
|AbpAuditLogActions|审计日志操作详情表，存储具体操作内容（一对多关联主表）|Id、AuditLogId（关联AbpAuditLogs.Id）、ServiceName（服务名称）、MethodName（方法名称）、Parameters（请求参数）、ActionName（操作名称）、EntityId（业务对象ID）、EntityTypeFullName（业务对象类型）|
|AbpEntityChanges|实体变更日志表，存储业务实体数据变更记录|Id、TenantId、UserId、UserName、ChangeTime（变更时间）、EntityId（实体ID）、EntityTypeFullName（实体类型）、ChangeType（变更类型：Create/Update/Delete）、AuditLogId（关联审计日志主表，可为空）|
|AbpEntityPropertyChanges|实体属性变更表，存储实体具体字段的变更前后值（一对多关联实体变更表）|Id、EntityChangeId（关联AbpEntityChanges.Id）、PropertyName（属性名称）、PropertyTypeFullName（属性类型）、OriginalValue（变更前值）、NewValue（变更后值）|