---
sidebar:
  sort: 8
---

# 快速Curd

## 添加依赖

- Lion.AbpPro.Ddd.Application
- Lion.AbpPro.Ddd.Application.Contracts
1. 在Application层添加Lion.AbpPro.Ddd.Application包引用,同时添加AbpProDddApplicationModule模块依赖
2. 在Application.Contracts层添加Lion.AbpPro.Ddd.Application.Contracts包引用,同时添加AbpProDddApplicationContractsModule模块依赖

## 定义实体

1. 在Domain层定义实体
```csharp
/// <summary>
/// 演示聚合
/// </summary>
public class DemoAggregate : FullAuditedAggregateRoot<Guid>, IMultiTenant
{
    public Guid? TenantId { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }
}
```

## Application.Contracts层

1. 在Application,Contracts层定义接口

```csharp
public interface IDemoAppService: IAbpProCrudAppService<
DemoGetOutput,
DemoGetListOutput,
Guid,
DemoGetListInput,
DemoCreateInput,
DemoUpdateInput>
{
    // Guid是实体的主键类型
}
```
2. DemoGetOutput获取详情的输出参数
- 需要继承EntityDto
```csharp
public class DemoGetOutput : EntityDto<Guid>
{
    public Guid Id { get; set; }

    public string Name { get; set; }

    public string Description { get; set; }

    public DateTime CreationTime { get; set; }
}
```
3. DemoGetListOutput获取分页列表的输出参数
- 需要继承EntityDto
```csharp
public class DemoGetListOutput : EntityDto<Guid>
{
    public string Name { get; set; }

    public string Description { get; set; }

    public DateTime CreationTime { get; set; }
}
```
4. DemoGetListInput获取分页列表的输入参数
- 需要继承AbpProPagedInput
```csharp
public class DemoGetListInput : AbpProPagedInput
{
    public string Name { get; set; }

    public string Description { get; set; }
}
```
5. DemoCreateInput创建的输入参数
```csharp
public class DemoCreateInput
{
    
    public string Name { get; set; }

    public string Description { get; set; }
    
}
```
6. DemoUpdateInput更新输入参数
```csharp
public class DemoUpdateInput
{
    
    public Guid Id { get; set; }
    
    public string Name { get; set; }

    public string Description { get; set; }
    
}
```

## Application层实现

```csharp
public class DemoAppService : AbpProCrudAppService<
    DemoAggregate,
    DemoGetOutput,
    DemoGetListOutput,
    Guid,
    DemoGetListInput,
    DemoCreateInput,
    DemoUpdateInput>, IDemoAppService
{
    public DemoAppService(IRepository<DemoAggregate, Guid> repository) : base(repository)
    {
    }
}
```

## 控制器映射

1. 如果没有开启service自动映射为控制器，则需要手动映射
2. 在Lion.AbpPro.HttpApi下添加控制器
#### 手动创建

```csharp

namespace Lion.AbpPro.Controllers;

public class DemoController : AbpProController,IDemoAppService
{
    private readonly IDemoAppService _demoAppService;

    public DemoController(IDemoAppService demoAppService)
    {
        _demoAppService = demoAppService;
    }

    public async Task<DemoGetOutput> GetAsync(Guid id)
    {
        return await _demoAppService.GetAsync(id);
    }

    public async Task<PagedResultDto<DemoGetListOutput>> GetListAsync(DemoGetListInput input)
    {
        return await _demoAppService.GetListAsync(input);
    }

    public async Task<DemoGetOutput> CreateAsync(DemoCreateInput input)
    {
        return await _demoAppService.CreateAsync(input);
    }

    public async Task<DemoGetOutput> UpdateAsync(Guid id, DemoUpdateInput input)
    {
        return await _demoAppService.UpdateAsync(id,input);
    }

    public async Task DeleteAsync(Guid id)
    {
         await _demoAppService.DeleteAsync(id);
    }

    public async Task DeleteAsync(IEnumerable<Guid> ids)
    {
        await _demoAppService.DeleteAsync(ids);
    }
}
```
2. 如果开启了自定映射，不需要处理
- 如何开启
```csharp
// 在host的module中添加
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    PreConfigure<AbpAspNetCoreMvcOptions>(options =>
    {
        // AbpProApplicationModule程序集下所有的service自动映射为控制器
        // 接口生成的地址是标准的resultful格式
        options.ConventionalControllers.Create(typeof(AbpProApplicationModule).Assembly);
    });
}
```
- 开启了之后是resultful格式，如果需要全部要post请手动设置，可以在service上添加httppost特性

## 效果
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/curd.png)