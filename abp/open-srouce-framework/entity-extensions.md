---
sidebar:
  sort: 10
---

# 扩展属性
- 我们发现abp的默认都会有一个ExtraProperties属性，那么他的作用是什么呢？当我们使用abp的时候，需要对其原有的表进行扩展或者添加我们想要的字段，又不想改源码，以最小的方式实现，这个时候就体现它的价值了。
- 我们添加的数据都会在ExtraProperties以JSON对象方式进行存储。

##  如何添加
- 在Domain.Shared层中提供了一个xxxModuleExtensionConfigurator类 

### 示例
- 给AbpUser表扩展一个用户头像地址的属性

```csharp
 public static class JuiceModuleExtensionConfigurator
 {
        private static readonly OneTimeRunner OneTimeRunner = new OneTimeRunner();

        public static void Configure()
        {
            OneTimeRunner.Run(() =>
            {
                ConfigureExistingProperties();
                ConfigureExtraProperties();
            });
        }
        private static void ConfigureExtraProperties()
        {
            ObjectExtensionManager.Instance.Modules()
                .ConfigureIdentity(identity =>
                {
                    identity.ConfigureUser(user =>
                    {
                        user.AddOrUpdateProperty<string>( //property type: string
                            "AvatarUrl",
                            property =>
                            {
                                property.Attributes.Add( new StringLengthAttribute(128)); // 最大长度为28
                                // ...property.Attributes.Add( new RequiredAttribute()); 还有很多特性直接可以使用
                            }
                        );
                    });
                });
        }
 }
```

- 如何写入或者更新到数据库

```csharp
private readonly IdentityUserManager _userManager;
public TestAppService(IdentityUserManager userManager)
{
    _userManager = userManager;
}
public async Task AddUserAsync()
{
    var user = new IdentityUser(GuidGenerator.Create(), "test-user", "test@qq.com");
    user.ExtraProperties["AvatarUrl"] = "test-avatar-url";
    await _userManager.CreateAsync(user);
}
```
- 效果
![](https://lion-abp-pro.oss-cn-shenzhen.aliyuncs.com/foods/021ff0a2396a41fe9572aefee95a2fc6_extra.png)

## 疑问？
- 这个数据是一个json格式保存在数据库的扩展字段的?假如我的场景是要加索引呢?这个时候这种方式就不行了?

- **映射成数据库字段列**
    - 在EntityFrameworkCore层的xxxEfCoreEntityExtensionMappings下集成一下代码
```csharp
public static class JuiceEfCoreEntityExtensionMappings
{
    private static readonly OneTimeRunner OneTimeRunner = new OneTimeRunner();
    public static void Configure()
    {
        JuiceGlobalFeatureConfigurator.Configure();
        JuiceModuleExtensionConfigurator.Configure();
        OneTimeRunner.Run(() =>
        {
            ObjectExtensionManager.Instance
                .MapEfCoreProperty<IdentityUser, string>(
                    "AvatarUrl",
                    (entityBuilder, propertyBuilder) =>
                    {
                        propertyBuilder.HasMaxLength(128);
                    }
                );
        });
    }
}
```
- 执行ef core迁移
```bash
dotnet ef migrations addAvatarUrl
dotnet database update
```
- 效果
![](https://lion-abp-pro.oss-cn-shenzhen.aliyuncs.com/foods/da48a1496ece4c91880708f2d4e14428_extra1.png)

- 如何通过代码新增和编辑方式还是通过扩展字段操作和之前保持一致。

## 注意
- AutoMapper的时候记得需要mapper扩展属性(MapExtraProperties)，如下：
```csharp
public class AbpIdentityApplicationModuleAutoMapperProfile : Profile
{
    public AbpIdentityApplicationModuleAutoMapperProfile()
    {
        CreateMap<IdentityUser, IdentityUserDto>()
            .MapExtraProperties();

        CreateMap<IdentityRole, IdentityRoleDto>()
            .MapExtraProperties();
    }
}
```
- 我们自写自己的模块的时候，应该也支持ExtraProperties，这样灵活性会更好。

