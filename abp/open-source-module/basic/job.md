---
sidebar:
  sort: 6
---

# 后台任务模块
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
- 切换到Hangfire
- 请参考[定时任务模块](/abp/open-srouce-framework/job)

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
    "AbpBackgroundManagement": "Server=localhost;Database=YourBackgroundDbName;Uid=root;Pwd=yourPassword;"
}
    
```
## 自定义表前缀
- 通过配置 AbpIdentityDbProperties.DbTablePrefix 自定义数据表前缀，例如：

```csharp
public override void PreConfigureServices(ServiceConfigurationContext context)
{
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    // 自定义表前缀为 "Sys_"，生成表如 Sys_BackgroundJobs
    AbpBackgroundManagementDbProperties.DbTablePrefix = "Sys_";
}
}
```

## 数据表说明

|表名|核心作用|关键字段说明|
|---|---|---|
|AbpBackgroundJobs|后台任务表|Name（任务名称）、JobType（任务类型全称）、Args（任务参数）、CronExpression（Cron表达式）、IsEnabled（是否启用）、Priority（任务优先级）、LastExecutionTime（上次执行时间）、NextExecutionTime（下次执行时间）、CreationTime（创建时间）、LastModificationTime（最后修改时间）|
