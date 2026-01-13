---
sidebar:
  sort: 1
---

## 模块机制

ABP框架是一个模块化应用程序开发平台，它提供了一套完整的模块生命周期管理机制。每个模块都可以定义自己的服务、配置和初始化逻辑。

### 模块生命周期

ABP vNext提供了完整的模块生命周期，主要包括以下阶段：

- **PreConfigureServices** - 在添加依赖注入或其他配置之前执行
- **ConfigureServices** - 添加依赖注入或其他配置
- **PostConfigureServices** - 在添加依赖注入或其他配置之后执行
- **OnPreApplicationInitialization** - 初始化所有模块之前执行
- **OnApplicationInitialization** - 初始化所有模块
- **OnPostApplicationInitialization** - 初始化所有模块之后执行
- **OnApplicationShutdown** - 应用关闭时执行

**OnPreApplicationInitialization**和**OnPostApplicationInitialization**方法用于在**OnApplicationInitialization**之前或之后覆盖和编写代码。请注意，在这些方法中编写的代码将在所有其他模块的**OnApplicationInitialization**方法之前/之后执行。

### 模块依赖关系

ABP框架会根据模块之间的依赖关系自动确定模块的加载顺序。模块通过[DependsOn]特性来声明依赖关系：

```csharp
[DependsOn(
    typeof(AbpAutofacModule),
    typeof(AbpEntityFrameworkCoreModule),
    typeof(AbpAspNetCoreMvcModule)
)]
public class MyModule : AbpModule
{
    // 模块实现
}
```

模块的加载顺序遵循以下规则：
1. 依赖模块总是先于被依赖模块加载
2. 在满足依赖关系的前提下，相同层级的模块可以并行加载以提高性能

### 加载流程

1. 进入到Startup
```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddApplication<xxxManagementHttpApiHostModule>();
    }
}
```

2. 查看AddApplication源码会调用AbpApplicationFactory.CreateAsync
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

3. 进入AbpApplicationWithExternalServiceProvider，我们可以看到继承AbpApplicationBase
```csharp
internal class AbpApplicationWithExternalServiceProvider : AbpApplicationBase, IAbpApplicationWithExternalServiceProvider
{
    public AbpApplicationWithExternalServiceProvider(
        [NotNull] Type startupModuleType,
        [NotNull] IServiceCollection services,
        Action<AbpApplicationCreationOptions>? optionsAction
        ) : base(
            startupModuleType,
            services,
            optionsAction)
    {
        services.AddSingleton<IAbpApplicationWithExternalServiceProvider>(this);
    }

    void IAbpApplicationWithExternalServiceProvider.SetServiceProvider([NotNull] IServiceProvider serviceProvider)
    {
        Check.NotNull(serviceProvider, nameof(serviceProvider));

        // ReSharper disable once ConditionIsAlwaysTrueOrFalseAccordingToNullableAPIContract
        if (ServiceProvider != null)
        {
            if (ServiceProvider != serviceProvider)
            {
                throw new AbpException("Service provider was already set before to another service provider instance.");
            }

            return;
        }

        SetServiceProvider(serviceProvider);
    }
```

4. 查看AbpApplicationBase构造函数
```csharp
 internal AbpApplicationBase(
        [NotNull] Type startupModuleType,
        [NotNull] IServiceCollection services,
        Action<AbpApplicationCreationOptions>? optionsAction)
    {
        services.AddCoreServices();
        services.AddCoreAbpServices(this, options);
        // 加载模块
        Modules = LoadModules(services, options);
    }
```

5. 查看加载模块逻辑
```csharp
public IAbpModuleDescriptor[] LoadModules(
    IServiceCollection services,
    Type startupModuleType,
    PlugInSourceList plugInSources)
{
    Check.NotNull(services, nameof(services));
    Check.NotNull(startupModuleType, nameof(startupModuleType));
    Check.NotNull(plugInSources, nameof(plugInSources));
    // 扫描模块
    var modules = GetDescriptors(services, startupModuleType, plugInSources);
    // 按照模块的依赖性重新排序
    modules = SortByDependency(modules, startupModuleType);
    return modules.ToArray();
}
```

### 服务配置阶段

在上面第二步我们可以看到有一个**await app.ConfigureServicesAsync()**;
- 在这个方法中可以看到依次执行每个模块的**PreConfigureServices，ConfigureServices，PostConfigureServices**

```csharp
public virtual async Task ConfigureServicesAsync()
    {
        CheckMultipleConfigureServices();

        var context = new ServiceConfigurationContext(Services);
        Services.AddSingleton(context);

        foreach (var module in Modules)
        {
            if (module.Instance is AbpModule abpModule)
            {
                abpModule.ServiceConfigurationContext = context;
            }
        }

        //PreConfigureServices
        foreach (var module in Modules.Where(m => m.Instance is IPreConfigureServices))
        {
            try
            {
                await ((IPreConfigureServices)module.Instance).PreConfigureServicesAsync(context);
            }
            catch (Exception ex)
            {
                throw new AbpInitializationException($"An error occurred during {nameof(IPreConfigureServices.PreConfigureServicesAsync)} phase of the module {module.Type.AssemblyQualifiedName}. See the inner exception for details.", ex);
            }
        }

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

        //PostConfigureServices
        foreach (var module in Modules.Where(m => m.Instance is IPostConfigureServices))
        {
            try
            {
                await ((IPostConfigureServices)module.Instance).PostConfigureServicesAsync(context);
            }
            catch (Exception ex)
            {
                throw new AbpInitializationException($"An error occurred during {nameof(IPostConfigureServices.PostConfigureServicesAsync)} phase of the module {module.Type.AssemblyQualifiedName}. See the inner exception for details.", ex);
            }
        }

        foreach (var module in Modules)
        {
            if (module.Instance is AbpModule abpModule)
            {
                abpModule.ServiceConfigurationContext = null!;
            }
        }

        _configuredServices = true;
    }
```

### 应用初始化阶段

再次查看第四步中有一个**services.AddCoreAbpServices(this, options);**，这个里面构造好其它的四个生命周期：

```csharp
internal static void AddCoreAbpServices(this IServiceCollection services,
    IAbpApplication abpApplication,
    AbpApplicationCreationOptions applicationCreationOptions)
{
    var moduleLoader = new ModuleLoader();
    var assemblyFinder = new AssemblyFinder(abpApplication);
    var typeFinder = new TypeFinder(assemblyFinder);
    if (!services.IsAdded<IConfiguration>())
    {
        services.ReplaceConfiguration(
            ConfigurationHelper.BuildConfiguration(
                applicationCreationOptions.Configuration
            )
        );
    }
    services.TryAddSingleton<IModuleLoader>(moduleLoader);
    services.TryAddSingleton<IAssemblyFinder>(assemblyFinder);
    services.TryAddSingleton<ITypeFinder>(typeFinder);
    services.TryAddSingleton<IInitLoggerFactory>(new DefaultInitLoggerFactory());
    services.AddAssemblyOf<IAbpApplication>();
    services.AddTransient(typeof(ISimpleStateCheckerManager<>), typeof(SimpleStateCheckerManager<>));
    // 注册生命周期
    services.Configure<AbpModuleLifecycleOptions>(options =>
    {
        // OnPreApplicationInitialization
        options.Contributors.Add<OnPreApplicationInitializationModuleLifecycleContributor>();
        // OnApplicationInitialization
        options.Contributors.Add<OnApplicationInitializationModuleLifecycleContributor>();
        // OnPostApplicationInitialization
        options.Contributors.Add<OnPostApplicationInitializationModuleLifecycleContributor>();
        // OnApplicationShutdown
        options.Contributors.Add<OnApplicationShutdownModuleLifecycleContributor>();
    });
}
```

注册了这四个生命周期，在什么时候调用呢？请继续往下看。

1. 继续回到Startup类
```csharp
public class Startup
{
    public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
    {
        app.InitializeApplication();
    }
}
```

2. 查看InitializeApplication
- 遍历刚刚注入的四个生命周期，执行Initialize初始化方法
```csharp
public void InitializeModules(ApplicationInitializationContext context)
{
    foreach (var contributor in _lifecycleContributors)
    {
        foreach (var module in _moduleContainer.Modules)
        {
            try
            {
                contributor.Initialize(context, module.Instance);
            }
            catch (Exception ex)
            {
                //
            }
        }
    }
    _logger.LogInformation("Initialized all ABP modules.");
}
```

### 模块开发最佳实践

#### 1. 模块配置

在模块中，可以使用不同的方法来配置服务和初始化逻辑：

- **PreConfigureServices**: 用于在其他模块配置之前添加配置，例如全局配置或安全配置
- **ConfigureServices**: 用于添加模块特定的服务和配置
- **PostConfigureServices**: 用于在其他模块配置之后进行最终配置，例如覆盖某些配置值

#### 2. 模块初始化

- **OnPreApplicationInitialization**: 用于在应用程序初始化之前执行逻辑，例如设置全局变量或初始化安全上下文
- **OnApplicationInitialization**: 用于应用程序初始化，例如创建默认数据或启动后台服务
- **OnPostApplicationInitialization**: 用于在应用程序初始化后执行逻辑，例如启动监控或发送启动通知
- **OnApplicationShutdown**: 用于清理资源和执行关闭前的清理操作

#### 3. 模块间的交互

模块之间可以通过以下方式交互：
- 依赖注入：通过接口或具体类型进行依赖注入
- 事件总线：使用本地或分布式事件总线进行模块间通信
- 配置系统：共享配置值和设置
- 领域服务：通过共享的领域服务进行业务逻辑交互

### 模块生命周期的详细说明

ABP vNext的模块生命周期确保了模块按正确的顺序加载、配置和初始化。模块的依赖关系决定了它们的加载顺序，而生命周期方法则确保了每个模块在应用程序启动过程中的正确执行时机。

通过合理利用这些生命周期方法，开发者可以确保模块按照预期的方式进行配置和初始化，从而构建出稳定、可扩展的应用程序。