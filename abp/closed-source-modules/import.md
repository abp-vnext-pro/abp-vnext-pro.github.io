# 导入导出模块
::: tip 注意
- 当前模块需要付费使用,需要找作者购买源码(购买vben5版本即可)
- 联系方式: 510423039@qq.com
- 微信号：WJLXRzzZ
:::


## 如何集成模块
- [导入组件Magicodes](https://github.com/dotnetcore/Magicodes.IE)
1. 在对应的层添加对应的引用
2. 添加 DependsOn(typeof(ImportExportManagementXxxModule)) 特性到对应模块
    - Lion.AbpPro.ImportExportManagement.Application
    - Lion.AbpPro.ImportExportManagement.Application.Contracts
    - Lion.AbpPro.ImportExportManagement.Domain
    - Lion.AbpPro.ImportExportManagement.Domain.Shared
    - Lion.AbpPro.ImportExportManagement.EntityFrameworkCore
    - Lion.AbpPro.ImportExportManagement.HttpApi
    - Lion.AbpPro.ImportExportManagement.HttpApi.Client
3. 在自己的dbcontext中实现接口：IImportExportManagementDbContext
4. 在 EntityFrameworkCore 层添加数据库配置在 AbpProDbContext.cs 的 OnModelCreating()方法中添加 builder.ConfigureImportExportManagement();
5. 执行ef迁移


## 如何配置单独数据库
- 数据库连接名称：ImportExportManagement
- 在appsetting.json下配置

```json
 "ConnectionStrings": {
    "Default": "Data Source=localhost;Database=LionAbpProDB;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true",
    "ImportExportManagement": "Data Source=localhost;Database=ImportExportManagement;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true"
  }
```
## 配置不同租户的数据库连接
- 在租户管理的数据库连接字符串管理中配置
- 这个要事先把表结构生成

## 如何修改表前缀
- ImportExportManagementDbProperties.DbTablePrefix
    - 重新指定即可
```csharp
public static class ImportExportManagementDbProperties
{
    public static string DbTablePrefix { get; set; } = "Abp";
    public static string DbSchema { get; set; } = null;
    public const string ConnectionStringName = "ImportExportManagement";
}
```

::: warning 数据库连接
如果没有指定ImportExportManagement数据连接名称,都会使用**Default**的数据库连接.
:::

## 导入用户示例

1. 在你的项目下添加导入导出的Lion.AbpPro.ImportExport类库依赖
::: tip 注意
这是一个共享类，里面定义了基础实现逻辑,需要结合ImportExportManagement模块使用,单独出来,是为了其它模块做导出,其它模块只需要引用这个类库即可。
:::

2. 在你的项目下新建一个导入Excel的贡献者，实现ImportExcelContributor,同时定义导入的dto
```csharp
public class UserTemplateImportDto
{
    [ImporterHeader(Name = "用户名", IsAllowRepeat = false)]
    [MaxLength(30, ErrorMessage = "用户名超出最大限制,请修改!")]
    [Required(ErrorMessage = "用户名不能为空")]
    public string UserName { get; set; }

    [ImporterHeader(Name = "名称")]
    [MaxLength(30, ErrorMessage = "名称超出最大限制,请修改!")]
    [Required(ErrorMessage = "名称不能为空")]
    public string Name { get; set; }

    [ImporterHeader(Name = "邮箱")]
    [Required(ErrorMessage = "邮箱不能为空")]
    [EmailAddress(ErrorMessage = "邮箱格式不正确")]
    public string Email { get; set; }

    [ImporterHeader(Name = "手机号")]
    [Required(ErrorMessage = "手机号不能为空")]
    public string Phone { get; set; }

    [ImporterHeader(Name = "密码")]
    [Required(ErrorMessage = "密码不能为空")]
    public string Password { get; set; }

    [ImporterHeader(Name = "角色")] 
    public string RoleNames { get; set; }
}
```
3. 重写ImportExcelContributor的Name,设置你的导入名称
4. 重写ImportExcelContributor的ImportAsync,如果模板和数据和dto定义的一致，那么就可以直接在这里处理你的导入逻辑就可以了

```csharp
public class UserImportExcelContributor : ImportExcelContributor<UserTemplateImportDto>
{
    // 指定一个导入名称，这里是必须的
    public override string Name => "导入用户";

    protected override async Task<ImportExportResult> ImportAsync(Guid id, ICollection<UserTemplateImportDto> list)
    {
        var result = new ImportExportResult();

        var index = 2;

        Logger.LogInformation($"开始导入用户, 数量:{list.Count}");
        var hasError = false;
        foreach (var item in list)
        {
            try
            {
                // todo 处理业务逻辑
            }
            catch (Exception e)
            {
                var error = new DataRowErrorInfo();
                // todo 这里如果某一行有错误，可以把错误信息添加到error.FieldErrors中
                error.RowIndex = index; // 第几行
                error.FieldErrors.Add("用户名", e.Message); // 错误信息放到用户名那一列
                result.RowErrors.Add(error);
                hasError = true;
            }

            index++;
        }

        result.Success = !hasError;
        return result;
    }

}
```
5. 如果导入的数据不符合业务逻辑，可以在当前行的某一列设置错误，会生成错误的excel返回出去
6. 注册导入贡献者
```csharp
public override void ConfigureServices(ServiceConfigurationContext context)
{
    Configure<ImportExcelContributorOptions>(options =>
    {
        options.Contributors.Add(nameof(UserImportExcelContributor), typeof(UserImportExcelContributor));
    });
}
```
7.直接启动项目，在导入管理，新增导入的时候会自动带出来你刚刚新增的导入类型，直接上传导入文件即可。