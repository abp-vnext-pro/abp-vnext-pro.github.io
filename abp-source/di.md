---
sidebar:
  sort: 2
---

## 依赖注入

ABP的依赖注入系统是基于Microsoft的依赖注入扩展库（Microsoft.Extensions.DependencyInjection nuget包）开发的。所以我们采用**dotnet自带的注入方式也是支持的**。
- 由于ABP是一个模块化框架,因此每个模块都定义它自己的服务并在它自己的单独模块类中通过依赖注入进行注册.例:
```csharp
public class BlogModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        //在此处注入依赖项
        // dotnet自带依赖注入方式也是支持的
        context.Services.AddTransient
        context.Services.AddScoped
        context.Services.AddSingleton
    }
}
```

## 依赖注入生命周期

在.NET中，依赖注入有三种生命周期：

- **Transient**：瞬时生命周期，每次从服务容器获取服务时都会创建一个新的实例。
- **Scoped**：作用域生命周期，在单个请求范围内使用同一个实例。
- **Singleton**：单例生命周期，整个应用程序生命周期内只创建一次实例。

## Autofac
Autofac 是.Net世界中最常用的依赖注入框架之一. 相比.Net Core标准的依赖注入库, 它提供了更多高级特性, 比如动态代理和属性注入.
### 集成
1.安装 Volo.Abp.Autofac nuget 包到你的项目 (对于一个多项目应用程序, 建议安装到可执行项目或者Web项目中.)
2.模块添加 AbpAutofacModule 依赖:
```csharp
    [DependsOn(typeof(AbpAutofacModule))]
    public class MyModule : AbpModule
    {
        //...
    }
}
```
3.配置 AbpApplicationCreationOptions 用 Autofac 替换默认的依赖注入服务. 根据应用程序类型, 情况有所不同
- ASP.NET Core 应用程序
```csharp
public class Program
{
    public static int Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    internal static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            })
            .UseAutofac(); //Integrate Autofac!
}
```
- 控制台应用程序
```csharp
namespace AbpConsoleDemo
{
    class Program
    {
        static void Main(string[] args)
        {
            using (var application = AbpApplicationFactory.Create<AppModule>(options =>
            {
                options.UseAutofac(); //Autofac integration
            }))
            {
                //...
            }
        }
    }
}
```

## 依照约定的注册

ABP框架提供了多种约定接口，用于自动注册服务。实现这些接口的类会自动注册到依赖注入容器中：

- **ITransientDependency** - 注册为transient生命周期.
- **ISingletonDependency** - 注册为singleton生命周期.
- **IScopedDependency** - 注册为scoped生命周期.

### 默认特定类型

一些特定类型会默认注册到依赖注入。ABP框架会自动识别并注册以下类型：

- 模块类注册为singleton.
- MVC控制器（继承Controller或AbpController）被注册为transient.
- MVC页面模型（继承PageModel或AbpPageModel）被注册为transient.
- MVC视图组件（继承ViewComponent或AbpViewComponent）被注册为transient.
- 应用程序服务（实现IApplicationService接口或继承ApplicationService类）注册为transient.
- 存储库（实现IRepository接口）注册为transient.
- 域服务（实现IDomainService接口）注册为transient.

### 依赖注入约定的高级配置

ABP框架还提供了额外的特性来控制依赖注入行为：

- **ExposeServicesAttribute**：指定一个类应该暴露为哪些服务
- **DependencyAttribute**：提供额外的依赖注入配置选项
- **RuntimeServiceAttribute**：指定服务是否应在运行时创建

## 手动注册

在某些情况下,你可能需要向IServiceCollection手动注册服务,尤其是在需要使用自定义工厂方法或singleton实例时.在这种情况下,你可以像Microsoft文档描述的那样直接添加服务.

```csharp
public class BlogModule : AbpModule
{
    public override void ConfigureServices(ServiceConfigurationContext context)
    {
        context.Services.AddTransient<ITestMicrosoftManager, TestMicrosoftManager>();
    }
}
```

## 如何使用

### 构造函数注入

- 构造方法注入是将依赖项注入类的首选方式

```csharp
public class MyService : ITransientDependency
{
    private readonly ITestManager _testManager;

    public MyService(ITestManager testManager)
    {
        _testManager = testManager;
    }

    public void DoSomething()
    {
        _testManager.Print();
    }
}
```

### 属性注入

- Microsoft依赖注入库不支持属性注入.但是,ABP可以与第三方DI提供商（例如Autofac）集成,以实现属性注入。
- 属性注入依赖项通常被视为可选依赖项.这意味着没有它们,服务也可以正常工作.Logger就是这样的依赖项,MyService可以继续工作而无需日志记录.

```csharp
public class MyService : ITransientDependency
{
    public ILogger<MyService> Logger { get; set; }

    public MyService()
    {
        Logger = NullLogger<MyService>.Instance;
    }

    public void DoSomething()
    {
        //...使用 Logger 写日志...
    }
}
```

### IServiceProvider

直接从IServiceProvider解析服务.在这种情况下,你可以将IServiceProvider注入到你的类并使用

```csharp
public class MyService : ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public MyService(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public void DoSomething()
    {
        var taxCalculator = _serviceProvider.GetService<ITaxCalculator>();
        //...
    }
}
```

## 服务替换

在某些情况下，需要替换某些接口的实现.
- ITestManager有一个默认实现DefaultManager,但是我现在想替换成TestReplaceManager,该如何操作呢?

### 原生dotnet方式替换

```csharp
services.Replace(ServiceDescriptor.Transient<ITestManager, TestReplaceManager>());
```

### Abp支持

- 加上Dependency特性标签
- 加上ExposeServices特性标签

```csharp
[Dependency(ReplaceServices = true)]
[ExposeServices(typeof(ITestManager))]
public class TestReplaceManager : ITestManager, ITransientDependency
{
	public void Print()
	{
		Console.WriteLine("TestReplaceManager");
	}
}
```

## 服务命名和别名

ABP框架支持为同一服务注册多个实现，这在需要根据不同条件使用不同实现时非常有用：

```csharp
// 注册多个实现
[ExposeServices(typeof(IMessageSender), typeof(EmailSender), typeof(SmsSender))]
public class EmailSender : ITransientDependency
{
    // ...
}

public class SmsSender : ITransientDependency
{
    // ...
}
```

## 条件注册

ABP框架支持基于条件的依赖注入注册，允许根据配置或其他条件来决定是否注册某个服务：

```csharp
public class BlogModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        if (Configuration.GetSection("ExternalServices:Payment").Exists())
        {
            Configure<AbpVirtualFileSystemOptions>(options =>
            {
                // 只有在配置存在时才进行注册
            });
        }
    }
}
```

## 问题

1. 有时候我们实现了ITransientDependency,ISingletonDependency,IScopedDependency但是再运行是还是提示依赖注入失败?
- 实现类的名称拼写错误
- 比如接口名称为ITestAppService,但是实现类为DefaultTessAppService,这个时候编译不会报错，但是运行报错,下面会基于源码分析。

```csharp
public class DefaultTessAppService : ApplicationService, ITestAppService
{
   // ....
}
```

2. 我通过[Dependency(ReplaceServices = true)]替换服务没有生效?
- 请添加[ExposeServices(typeof(ITestManager))]显示暴露服务,下面会基于源码分析。

### 源码分析

1. 进入到Startup.AddApplication源码
```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplication<xxxManagementHttpApiHostModule>();
    }
}
```

2. 进入到await app.ConfigureServicesAsync()源码
```csharp
public async static Task<IAbpApplicationWithExternalServiceProvider> CreateAsync(
    [NotNull] Type startupModuleType,
    [NotNull] IServiceCollection services,
    Action<AbpApplicationCreationOptions>? optionsAction = null)
{
    var app = new AbpApplicationWithExternalServiceProvider(startupModuleType, services, options =>
    {
        options.SkipConfigureServices = true;
        optionsAction?.Invoke(options);
    });

    await app.ConfigureServicesAsync();
    return app;
}
```

3. 主要查看ConfigureServices下的Services.AddAssembly(assembly)方法。
```csharp
 public virtual async Task ConfigureServicesAsync()
    {
        
        // 省略...

        var assemblies = new HashSet<Assembly>();

        //ConfigureServices
        foreach (var module in Modules)
        {
            if (module.Instance is AbpModule abpModule)
            {
                if (!abpModule.SkipAutoServiceRegistration)
                {
                    var assembly = module.Type.Assembly;
                    if (!assemblies.Contains(assembly))
                    {
                        Services.AddAssembly(assembly);
                        assemblies.Add(assembly);
                    }
                }
            }

            try
            {
                await module.Instance.ConfigureServicesAsync(context);
            }
            catch (Exception ex)
            {
                throw new AbpInitializationException($"An error occurred during {nameof(IAbpModule.ConfigureServicesAsync)} phase of the module {module.Type.AssemblyQualifiedName}. See the inner exception for details.", ex);
            }
        }

        // 省略...
    }
```

4.进入下面AddAssembly下AddType的逻辑
```csharp
public class DefaultConventionalRegistrar : ConventionalRegistrarBase
{
    public override void AddType(IServiceCollection services, Type type)
    {
        if (IsConventionalRegistrationDisabled(type))
        {
            return;
        }
        // 查看是否有DependencyAttribute特性标签
        var dependencyAttribute = GetDependencyAttributeOrNull(type);
        // 判断是否有实现接口，注入对于的类型。
        var lifeTime = GetLifeTimeOrNull(type, dependencyAttribute);

        if (lifeTime == null)
        {
            return;
        }

        var exposedServiceTypes = GetExposedServiceTypes(type);

        TriggerServiceExposing(services, type, exposedServiceTypes);

        foreach (var exposedServiceType in exposedServiceTypes)
        {
            var serviceDescriptor = CreateServiceDescriptor(
                type,
                exposedServiceType,
                exposedServiceTypes,
                lifeTime.Value
            );

            if (dependencyAttribute?.ReplaceServices == true)
            {
                services.Replace(serviceDescriptor);
            }
            else if (dependencyAttribute?.TryRegister == true)
            {
                services.TryAdd(serviceDescriptor);
            }
            else
            {
                services.Add(serviceDescriptor);
            }
        }
    }
}

    // GetLifeTimeOrNull

    protected virtual ServiceLifetime? GetLifeTimeOrNull(Type type, DependencyAttribute? dependencyAttribute)
    {
        return dependencyAttribute?.Lifetime ?? GetServiceLifetimeFromClassHierarchy(type) ?? GetDefaultLifeTimeOrNull(type);
    }
    // abp 三个生命周期
    protected virtual ServiceLifetime? GetServiceLifetimeFromClassHierarchy(Type type)
    {
        if (typeof(ITransientDependency).GetTypeInfo().IsAssignableFrom(type))
        {
            return ServiceLifetime.Transient;
        }

        if (typeof(ISingletonDependency).GetTypeInfo().IsAssignableFrom(type))
        {
            return ServiceLifetime.Singleton;
        }

        if (typeof(IScopedDependency).GetTypeInfo().IsAssignableFrom(type))
        {
            return ServiceLifetime.Scoped;
        }

        return null;
    }
```

5.重点到了,看下为什么名称错误为什么导致注入失败。
- 通过接口的名称去获取实现。
- 也能解释有时候不显示指定ExposeServices可能替换失败的问题

```csharp
public class ExposeServicesAttribute : Attribute, IExposedServiceTypesProvider
{
    // 省略...

    private static List<Type> GetDefaultServices(Type type)
    {
        var serviceTypes = new List<Type>();

        foreach (var interfaceType in type.GetTypeInfo().GetInterfaces())
        {
            var interfaceName = interfaceType.Name;
            if (interfaceType.IsGenericType)
            {
                interfaceName = interfaceType.Name.Left(interfaceType.Name.IndexOf('`'));
            }

            // 查询到实现类的名称是否是移除I
            if (interfaceName.StartsWith("I"))
            {
                interfaceName = interfaceName.Right(interfaceName.Length - 1);
            }
            // 查询到实现类的名称是否以接口名结尾
            if (type.Name.EndsWith(interfaceName))
            {
                serviceTypes.Add(interfaceType);
            }
        }

        return serviceTypes;
    }
}
```

## 最佳实践

### 1. 合理选择生命周期

- Transient: 用于轻量级、无状态的服务
- Scoped: 用于需要在单个请求中保持状态的服务
- Singleton: 用于全局共享的、无状态的服务

### 2. 避免循环依赖

- 设计时应避免出现A依赖B，B又依赖A的情况
- 使用接口隔离和依赖倒置原则

### 3. 正确命名实现类

- 按照约定，实现类应该以接口名结尾（例如：IRepository -> DefaultRepository）
- 避免拼写错误导致的注册失败

### 4. 使用特性控制注册行为

- 使用[Dependency]特性来控制替换和注册行为
- 使用[ExposeServices]特性来明确指定暴露的服务类型
- 使用[ExposeServices]特性来注册多个接口实现