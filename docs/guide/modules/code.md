# 代码生成器模块
::: tip 注意
- 当前模块需要付费使用,需要找作者购买源码(购买vben5版本即可)
- 联系方式: 510423039@qq.com
- 微信号：WJLXRzzZ
:::

- [Github仓库地址](https://github.com/abp-vnext-pro/abp-vnext-pro-framework/tree/main/modules/CodeManagement)

## 如何集成
### 后端
- 在example分支有集成示例：
    [Github-example仓库地址](https://github.com/WangJunZzz/abp-vnext-pro/tree/example)
1. 在对应的层添加对应的引用
2. 添加 DependsOn(typeof(CodeManagementXxxModule)) 特性到对应模块
    - Lion.AbpPro.CodeManagement.Application
    - Lion.AbpPro.CodeManagement.Application.Contracts
    - Lion.AbpPro.CodeManagement.Domain
    - Lion.AbpPro.CodeManagement.Domain.Shared
    - Lion.AbpPro.CodeManagement.EntityFrameworkCore
    - Lion.AbpPro.CodeManagement.HttpApi
    - Lion.AbpPro.CodeManagement.HttpApi.Client
3. 在自己的dbcontext中实现接口：ICodeManagementDbContext
4. 在 EntityFrameworkCore 层添加数据库配置在 AbpProDbContext.cs 的 OnModelCreating()方法中添加 builder.ConfigureCodeManagement();
5. 执行ef迁移

###  前端
- 在example分支有集成示例：
[Github-example仓库地址](https://github.com/abp-vnext-pro/abp-vnext-pro-vben5/tree/example)

1. 新建vben5项目之后，查看以上example仓库地址代码
2. 目前只支持antd的前端
3. 把example分支下的apps/web-antd/src/locales/zh-CN/code.json 拷贝到您的项目同级目录下
4. 把example分支下的apps/web-antd/src/locales/en-US/code.json 拷贝到您的项目同级目录下
5. 把example分支下的apps/web-antd/src/router/routes/modules/code.ts 拷贝到您的项目同级目录下
6. 把example分支下的apps/web-antd/src/views/textTemplate 拷贝到您的项目同级目录下
7. 启动后端,执行npm run nswag 刷新接口代理(记得把刷代理的接口json改成你本地启动的项目地址)
8. 启动前端npm run dev 就可以看到代码生成器的ui界面

## 如何配置单独数据库
- 数据库连接名称：CodeManagement
- 在appsetting.json下配置

```json
 "ConnectionStrings": {
    "Default": "Data Source=localhost;Database=LionAbpProDB;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true",
    "CodeManagement": "Data Source=localhost;Database=CodeManagement;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true"
  }
```
## 配置不同租户的数据库连接
- 在租户管理的数据库连接字符串管理中配置
- 这个要事先把表结构生成

## 如何修改表前缀
- CodeManagementDbProperties.DbTablePrefix
    - 重新指定即可
```csharp
public static class CodeManagementDbProperties
{
    public static string DbTablePrefix { get; set; } = "Abp";
    public static string DbSchema { get; set; } = null;
    public const string ConnectionStringName = "CodeManagement";
}
```

::: warning 数据库连接
如果没有指定CodeManagement数据连接名称,都会使用**Default**的数据库连接.
:::
