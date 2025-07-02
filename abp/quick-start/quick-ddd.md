---
group:
  sort: 3
---

# 领域驱动设计
## 什么是DDD?
ABP框架提供的**基础设施**使基于**领域驱动设计**的开发更易实现. DDD在[维基百科中的定义](https://zh.wikipedia.org/wiki/%E5%9F%9F%E9%A9%B1%E5%8A%A8%E5%BC%80%E5%8F%91)如下:
> **领域驱动设计(DDD)** 是一种通过将实现连接到持续进化的模型来满足复杂需求的软件开发方法. 领域驱动设计的前提是:
>
> + 把项目的主要重点放在核心领域和领域逻辑上
> + 把复杂的设计放在领域模型上
> + 发起技术专家和领域专家之间的创造性协作,以迭代方式完善解决特定领域问题的概念模型

## 项目分层
ABP框架遵循DDD原则和模式去实现分层应用程序模型,该模型由四个基本层组成:
+ **表示层**: 为用户提供接口. 使用_应用层_实现与用户交互.
    - 这里我们是vben admin 前后端分离的方式
+ **应用层**: 表示层与领域层的中介,编排业务对象执行特定的应用程序任务. 使用应用程序逻辑实现用例.
    - 在abp中就是xx.Application和 xx.Application.Contract层
+ **领域层**: 包含业务对象以及业务规则. 是应用程序的核心.
    - 在abp中就是xx.Domain和xx.Domain.Shared层
+ **基础设施层**: 提供通用的技术功能,支持更高的层,主要使用第三方类库.
    - 在abp中就是xx.EntityFrameworkCore层

## 解决方案说明:
* 下图是使用Cli的创建的解决方案:
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/app.png)
### 0.Solution Items
* 这个下面是一些关于nuget的设置
* Directory.Build.targets如果存在这个文件,dotnet会自动发现这个
* global.json 设置dotnet版本
* NuGet.Config 设置nuget的地址
### 展现层
* abp vnext pro 提供vben2.8和vben5的版本
### 应用层
* 应用层也被分为了两个项目:
    - Lion.AbpPro.CodeManagement.Application.Contracts包含接口的定义及接口依赖的DTO,此项目可以被展现层或其它客户端应用程序引用.
    - Lion.AbpPro.CodeManagement.Application是应用层中必需的,它实现了Lion.AbpPro.CodeManagementApplication.Contracts项目中定义的接口.
### 领域层
* 领域层分为两个项目:
    - Lion.AbpPro.CodeManagement.Domain是领域层中必需的,它包含之前介绍的构建组成(实体,值对象,领域服务,规约,仓储接口等).
    - Lion.AbpPro.CodeManagement.Domain.Shared是领域层中很薄的项目,它只包含领域层与其它层共享的数据类型的定义.例如,枚举,常量等.
### 远程服务层
* Lion.AbpPro.CodeManagement.HttpApi包含了HTTP API的定义.它通常包含MVC Controller 和 Model(如果有).因此,你可以在此项目中提供HTTP API.
- Lion.AbpPro.CodeManagement.HttpApi.Client当C#客户端应用程序需要调用IssueTracking.HttpApi的API时,这个项目非常有用.客户端程序仅需引用此项目就可以通过依赖注入方式,远程调用应用服务.它是通过ABP框架的动态C#客户端API代理系统来实现的.
### 基础设施层
* 你可能只创建一个基础设施项目来完成所有抽象类的定义及外部类的集成,又或者为不同的依赖创建多个不同的项目.
* 我们建议采用一种平衡的方法:为主要的依赖的库(例如 Entity Framework Core)创建一个独立的项目,为其它的依赖库创建一个公共的基础设施项目.
* 解决方案中包含两个用于集成Entity Framework Core的项目:
    - Lion.AbpPro.CodeManagement.EntityFrameworkCore是必需的,因为需要集成EF Core.应用程序的数据库上下文(DbContext),数据库对象映射,仓储接口的实现,以及其它与EF Core相关的内容都位于此项目中.
    - Lion.AbpPro.CodeManagement.EntityFrameworkCore.DbMigrations是管理Code First方式数据库迁移记录的特殊项目.此项目定义了一个独立的DbContext来追踪迁移记录.只有当添加一个新的数据库迁移记录或添加一个新的应用模块时,才会使用此项目,否则,其它情况无需修改此项目内容.
## 项目依赖关系
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/project.png)

之前已介绍了这些项目.现在,我们来解释依赖的原因:

+ `Domain.Shared` 所有项目直接或间接依赖此项目.此项目中的所有类型都可以被其它项目所引用.
+ `Domain` 仅依赖`Domain.Shared`项目,因为`Domain.Shared`本就属于领域层的一部分.例如,`Domain.Shared`项目中的枚举类型 `IssueType` 被`Domain`项目中的`Issue`实体所引用.
+ `Application.Contracts` 依赖`Domain.Shared`项目,可以在DTO中重用`Domain.Shared`中的类型.例如,`Domain.Shared`项目中的枚举类型 `IssueType` 同样被`Contracts`项目中的`CreateIssueDto`DTO所引用.
+ `Application` 依赖`Application.Contracts`项目,因为此项目需要实现应用服务的接口及接口使用的DTO.另外也依赖`Domain`项目,因为应用服务的实现必须依赖领域层中的对象.
+ `EntityFrameworkCore` 依赖`Domain`项目,因为此项目需要将领域对象(实体或值对象)映射到数据库的表,另外还需要实现`Domain`项目中的仓储接口.
+ `HttpApi` 依赖`Application.Contracts`项目,因为Controllers需要注入应用服务.
+ `HttpApi.Client` 依赖`Application.Contracts`项目,因为此项目需要使用应用服务.
+ `Web` 依赖`HttpApi`项目,因为此项目对外提供HTTP APIs.另外Pages或Components 需要使用应用服务,所以还间接依赖了`Application.Contracts`项目