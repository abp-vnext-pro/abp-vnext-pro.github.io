---
outline: deep
---

# 切换数据库
- 当前默认数据库是mysql
- 以下操作将演示如何切换数据库,从mysql切换到sqlserver
- 其它数据库流程类似，Oracle可能需要额外修改

## 如何切换到SqlServer
1. 在Directory.Build.Volo.targets添加Volo.Abp.EntityFrameworkCore.SqlServer NuGet包
```xml
<ItemGroup>
    <PackageReference Update="Volo.Abp.EntityFrameworkCore.SqlServer" Version="9.0.3"/>
</ItemGroup>
```

2. 修改Lion.AbpPro.EntityFrameworkCore层nuget包引用
```xml
<ItemGroup>
    <!-- <PackageReference Include="Volo.Abp.EntityFrameworkCore.MySQL" /> -->
    <!-- mysql切换为sqlserver -->
    <PackageReference Include="Volo.Abp.EntityFrameworkCore.SqlServer"  />
</ItemGroup>
```
3. 调整Lion.AbpPro.EntityFrameworkCore层的模块依赖
```csharp
    [DependsOn(
        typeof(AbpProDomainModule),
        typeof(BasicManagementEntityFrameworkCoreModule),
        // typeof(AbpEntityFrameworkCoreMySQLModule),
          // mysql切换为sqlserver 
         typeof(AbpEntityFrameworkCoreSqlServerModule),
        typeof(DataDictionaryManagementEntityFrameworkCoreModule),
        typeof(NotificationManagementEntityFrameworkCoreModule),
        typeof(LanguageManagementEntityFrameworkCoreModule)
        )]
    public class AbpProEntityFrameworkCoreModule : AbpModule
   {
        public override void PreConfigureServices(ServiceConfigurationContext context)
        {
            AbpProEfCoreEntityExtensionMappings.Configure();
        }

        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddAbpDbContext<AbpProDbContext>(options =>
            {
                options.AddDefaultRepositories(includeAllEntities: true);
            });
            
            Configure<AbpDbContextOptions>(options =>
            {
                // options.UseMySQL();
                // mysql切换为sqlserver 
                options.UseSqlServer();
            });
        }
    }
}    
```
5. 修改Lion.AbpPro.EntityFrameworkCore层下的AbpProMigrationsDbContextFactory
```csharp
// var builder = new DbContextOptionsBuilder<AbpProDbContext>()
//                 .UseMySql(configuration.GetConnectionString("Default"), MySqlServerVersion.LatestSupportedServerVersion);
    <!-- mysql切换为sqlserver -->
var builder = new DbContextOptionsBuilder<AbpProDbContext>().UseSqlServer(configuration.GetConnectionString("Default"));                
```
6. 删除Lion.AbpPro.EntityFrameworkCore层下Migrations的所有文件

7. 修改Lion.AbpPro.DbMigrator下的appsettings.json数据库连接字符串为SqlServer连接字符串

8. 在Lion.AbpPro.EntityFrameworkCore层下执行迁移命令
```bash
dotnet ef migrations add Initial
```
9. 运行Lion.AbpPro.DbMigrator

10. 修改Lion.AbpPro.HttpApi.Host项目的数据库字符串为SqlServer连接字符串

11. 运行Lion.AbpPro.HttpApi.Host项目

12. 迁移完成,用户名：admin 密码：1q2w3E*

## 如何切换到PostgreSQL
1. 在Directory.Build.Volo.targets添加Volo.Abp.EntityFrameworkCore.PostgreSql NuGet包
```xml
<ItemGroup>
    <PackageReference Update="Volo.Abp.EntityFrameworkCore.PostgreSql" Version="9.0.3"/>
</ItemGroup>
```

2. 修改Lion.AbpPro.EntityFrameworkCore层nuget包引用
```xml
<ItemGroup>
    <!-- <PackageReference Include="Volo.Abp.EntityFrameworkCore.MySQL" /> -->
    <!-- mysql切换为PostgreSql -->
    <PackageReference Include="Volo.Abp.EntityFrameworkCore.PostgreSql"  />
</ItemGroup>
```
3. 调整Lion.AbpPro.EntityFrameworkCore层的模块依赖
```csharp
    [DependsOn(
        typeof(AbpProDomainModule),
        typeof(BasicManagementEntityFrameworkCoreModule),
        // typeof(AbpEntityFrameworkCoreMySQLModule),
          // mysql切换为PostgreSql 
         typeof(AbpEntityFrameworkCorePostgreSqlModule),
        typeof(DataDictionaryManagementEntityFrameworkCoreModule),
        typeof(NotificationManagementEntityFrameworkCoreModule),
        typeof(LanguageManagementEntityFrameworkCoreModule)
        )]
    public class AbpProEntityFrameworkCoreModule : AbpModule
   {
        public override void PreConfigureServices(ServiceConfigurationContext context)
        {
            AbpProEfCoreEntityExtensionMappings.Configure();
        }

        public override void ConfigureServices(ServiceConfigurationContext context)
        {
            context.Services.AddAbpDbContext<AbpProDbContext>(options =>
            {
                options.AddDefaultRepositories(includeAllEntities: true);
            });
            //若提示时间戳问题：InvalidCastException: Cannot write DateTime with Kind=Local to PostgreSQL type 'timestamp with time zone', only UTC is supported. Note that it's not possible to mix DateTimes with different Kinds in an array/range. See the Npgsql.EnableLegacyTimestampBehavior AppContext switch to enable legacy behavior. 添加以下配置解决：
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
            AppContext.SetSwitch("Npgsql.DisableDateTimeInfinityConversions", true);
            //若Postgresql没有安装Guid拓展，请添加以下配置：
            Configure<AbpSequentialGuidGeneratorOptions>(options =>
            {
                options.DefaultSequentialGuidType = SequentialGuidType.SequentialAsString;
            });
            
            Configure<AbpDbContextOptions>(options =>
            {
                // options.UseMySQL();
                // mysql切换为PostgreSql
                options.UseNpgsql();
            });
        }
    }
}    
```
5. 修改Lion.AbpPro.EntityFrameworkCore层下的AbpProMigrationsDbContextFactory
```csharp
// var builder = new DbContextOptionsBuilder<AbpProDbContext>()
//                 .UseMySql(configuration.GetConnectionString("Default"), MySqlServerVersion.LatestSupportedServerVersion);
    <!-- mysql切换为PostgreSql -->
var builder = new DbContextOptionsBuilder<AbpProDbContext>().UseNpgsql(configuration.GetConnectionString("Default"));                
```
6. 删除Lion.AbpPro.EntityFrameworkCore层下Migrations的所有文件

7. 修改Lion.AbpPro.DbMigrator下的appsettings.json数据库连接字符串为PostgreSql连接字符串
```json
"ConnectionStrings": {
    "Default": "Host=127.0.0.1;Port=5432;Database=demo;Username=demo;Password=demo;Pooling=true;"
  }
```

8. 在Lion.AbpPro.EntityFrameworkCore层下执行迁移命令
```bash
dotnet ef migrations add Initial
```
9. 运行Lion.AbpPro.DbMigrator

10. 修改Lion.AbpPro.HttpApi.Host项目的数据库字符串为PostgreSql连接字符串
```json
"ConnectionStrings": {
    "Default": "Host=127.0.0.1;Port=5432;Database=demo;Username=demo;Password=demo;Pooling=true;"
  }
```

11. 运行Lion.AbpPro.HttpApi.Host项目

12. 迁移完成,用户名：admin 密码：1q2w3E*
