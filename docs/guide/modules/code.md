# 代码生成模块

- 通过定义实体,自动生成CURD.

## 安装

- Lion.Abp.CodeManagement.Application
- Lion.Abp.CodeManagement.Application.Contracts
- Lion.Abp.CodeManagement.Domain
- Lion.Abp.CodeManagement.Domain.Shared
- Lion.Abp.CodeManagement.EntityFrameworkCore
- Lion.Abp.CodeManagement.HttpApi
- Lion.Abp.CodeManagement.HttpApi.Client


## 模块依赖

- 添加 DependsOn(typeof(CodeManagementXxxModule)) 特性到对应模块。
- 在EntityFrameworkCore层添加数据库配置在AbpProDbContext.cs的OnModelCreating()方法中添加builder.ConfigureCodeManagement();
