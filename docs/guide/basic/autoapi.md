---
outline: deep
---
# 自动API控制器
- 创建应用程序服务后，您通常需要创建一个API控制器，以将此服务公开为 HTTP（REST） API 终端节点。API控制器只将方法调用重定向到应用程序服务，并使用 [HttpGet]、[HttpPost]、[Route]...等。
- ABP按照约定将您的应用程序服务配置为 API 控制器。

## 配置
- 基本配置很简单。只需配置并使用方法，如下所示：AbpAspNetCoreMvcOptionsConventionalControllers.Create
```csharp
[DependsOn(BookStoreApplicationModule)]
public class BookStoreWebModule : AbpModule
{
    public override void PreConfigureServices(ServiceConfigurationContext context)
    {
        PreConfigure<AbpAspNetCoreMvcOptions>(options =>
        {
            options
                .ConventionalControllers
                // 创建BookStoreApplicationModule模块下的自动api
                .Create(typeof(BookStoreApplicationModule).Assembly);
            // 如果单纯的不需要某一个控制器，可以这么移除，还可以在service上添加[RemoteService(IsEnabled = false)]特性
            options.ControllersToRemove.Add(typeof(AbpLanguagesController));                
        });
    }
}
```
- BookStoreApplicationModule模块下的service都会在swagger上显示

## IRemoteService 接口
- 如果一个类实现了IRemoteService接口，则会自动选择它作为API控制器。

## 命名约定
- Get：如果方法名称以 'GetList'、'GetAll' 或 'Get' 开头，则使用。
- Put：如果方法名称以 'Put' 或 'Update' 开头，则使用。
- Delete：如果方法名称以 'Delete' 或 'Remove' 开头，则使用。
- Post：如果方法名称以 'Create'、'Add'、'Insert' 或 'Post' 开头，则使用。
- Patch：如果方法名称以 'Patch' 开头，则使用。
- 默认Post
