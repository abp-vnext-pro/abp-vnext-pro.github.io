---
sidebar:
  sort: 2
---

# 基础模块
::: info 
<span style="color:red;font-size:22px">当前模块聚合到BasicManagement模块,包含：</span>
- 账户模块
- 权限模块
- 设置模块
- 功能模块
- 租户模块
- 调度模块
- 审计日志模块
:::

## 如何集成
- 在对应的层添加对应的引用
- 添加 DependsOn(typeof(DataDictionaryManagementXxxModule)) 特性到对应模块
    - Lion.AbpPro.BasicManagement.Application
    - Lion.AbpPro.BasicManagement.Application.Contracts
    - Lion.AbpPro.BasicManagement.Domain
    - Lion.AbpPro.BasicManagement.Domain.Shared
    - Lion.AbpPro.BasicManagement.EntityFrameworkCore
    - Lion.AbpPro.BasicManagement.HttpApi
    - Lion.AbpPro.BasicManagement.HttpApi.Client
- 在自己的dbcontext中实现接口：IBasicManagementDbContext
- 在 EntityFrameworkCore 层添加数据库配置在 AbpProDbContext.cs 的 OnModelCreating()方法中添加 builder.ConfigureBasicManagement();

