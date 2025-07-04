---
group:
  icon: meteor-icons:grid 
  text: 模块
  sort: 4
---

# 基础模块
::: info BasicManagement

- 当前模块是一个集合，包含abp默认自带的模块，搭建项目默认都会带上这些模块。
- 包含以下模块：
    - 账户模块
    - 权限模块
    - setting模块
    - feature模块
    - 租户模块
:::

- [Github仓库地址](https://github.com/WangJunZzz/abp-vnext-pro/tree/main/aspnet-core/modules/BasicManagement)
- [Gitee仓库地址](https://gitee.com/WangJunZzz/abp-vnext-pro/tree/main/aspnet-core/modules/BasicManagement)


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