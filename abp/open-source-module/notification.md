---
outline: deep
---
# 站内信模块
- 通过站内信模块，可以发布公告、通知、消息等。
- 通过站内信模块，用户可以发送站内信给其他用户。

## 如何集成
- 在对应的层添加对应的引用
- 添加 DependsOn(typeof(NotificationManagementXxxModule)) 特性到对应模块
    - Lion.AbpPro.NotificationManagement.Application
    - Lion.AbpPro.NotificationManagement.Application.Contracts
    - Lion.AbpPro.NotificationManagement.Domain
    - Lion.AbpPro.NotificationManagement.Domain.Shared
    - Lion.AbpPro.NotificationManagement.EntityFrameworkCore
    - Lion.AbpPro.NotificationManagement.HttpApi
    - Lion.AbpPro.NotificationManagement.HttpApi.Client
- 在自己的dbcontext中实现接口：INotificationManagementDbContext
- 在 EntityFrameworkCore 层添加数据库配置在 AbpProDbContext.cs 的 OnModelCreating()方法中添加 builder.ConfigureNotificationManagement();


## 如何配置单独数据库
- 数据库连接名称：NotificationManagement
- 在appsetting.json下配置

```json
 "ConnectionStrings": {
    "Default": "Data Source=localhost;Database=LionAbpProDB;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true",
    "NotificationManagement": "Data Source=localhost;Database=NotificationManagement;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true"
  }
```
## 配置不同租户的数据库连接
- 在租户管理的数据库连接字符串管理中配置
- 这个要事先把表结构生成

## 如何修改表前缀
- NotificationManagementDbProperties.DbTablePrefix
    - 重新指定即可
```csharp
public static class NotificationManagementDbProperties
{
    public static string DbTablePrefix { get; set; } = "Abp";
    public static string DbSchema { get; set; } = null;
    public const string  ConnectionStringName = "NotificationManagement";
}
```

::: warning 数据库连接
如果没有指定NotificationManagement数据连接名称,都会使用**Default**的数据库连接.
:::

## 功能
- 可以发送warning、information、error类型的站内信。
- 可以发送广播类型的站内信。
- 可以发送给指定人员。

### 后端发布通告
- 注入IMessageManager既可以发送消息
```csharp
namespace Lion.AbpPro.SignalR;

public interface IMessageManager
{
    /// <summary>
    /// 发送消息
    /// </summary>
    /// <param name="title">消息标题</param>
    /// <param name="content">消息内容</param>
    /// <param name="messageType">消息类型</param>
    /// <param name="messageLevel">消息级别</param>
    /// <param name="senderUserId">消息发送人，如果是广播消息，不需要传递</param>
    /// <param name="senderUserName">消息发送人userName</param>
    /// <param name="receiverUserId">消息接受人，如果是广播消息，不需要传递</param>
    /// <param name="receiverUserName">消息接受人userName，如果是广播消息，不需要传递</param>
    /// <param name="tenantId">租户Id</param>
    /// <param name="isPersistent">是否持久化,如果ture会在消息管理中出现,并且右上角也会存在</param>
    /// <returns></returns>
    Task SendMessageAsync(
        string title,
         string content, 
         MessageType messageType,
         MessageLevel messageLevel, 
         Guid senderUserId, 
         string senderUserName, 
         Guid? receiverUserId = null, 
         string receiverUserName = "",
         Guid? tenantId = null, 
         bool isPersistent = false);
}
```
- 调用结果展示
![](https://lion-abp-pro.oss-cn-shenzhen.aliyuncs.com/foods/e91cdf2c5ba24164b18e92cf876a2e00_gonggao.png)

### 前端发布通告
- 系统管理->通告管理->发布通告

## 配置
- 前端在env配置websocket地址
- VITE_WEBSOCKET_URL: 'http://xxx:44317/signalr/notification'

::: tip 注意
- 部署之后需要启用websocket功能，否则前端无法连上signalr
:::

## 表结构说明

**Notification** 表结构：

| 字段名                    | 描述           | 类型                           |
| :------------------------ | :------------- | :----------------------------- |
| Id                        | Id             | Guid                           |
| Title                     | 消息标题       | string                         |
| Content                   | 消息内容       | string                         |
| MessageType               | 消息类型       | MessageType                    |
| MessageLevel              | 消息等级       | MessageLevel                   |
| SenderId                  | 创建人         | 发送人                         |
| NotificationSubscriptions | 消息订阅者集合 | List             |
| IsDeleted                 | 是否删除       | bool                           |
| DeleterId                 | 删除人         | Guid?                          |
| DeletionTime              | 删除时间       | DateTime                       |
| LastModifierId            | 最后修改人     | Guid?                          |
| LastModificationTime      | 最后修改时间   | DateTime                       |
| CreatorId                 | 创建人         | Guid?                          |
| CreationTime              | 创建时间       | DateTime                       |

**NotificationSubscription** 表结构：

| 字段名               | 描述         | 类型      |
| :------------------- | :----------- | :-------- |
| Id                   | Id           | Guid      |
| ReceiveId            | 接收人       | Guid      |
| Read                 | 是否已读     | bool      |
| ReadTime             | 已读时间     | DateTime? |
| IsDeleted            | 是否删除     | bool      |
| DeleterId            | 删除人       | Guid?     |
| DeletionTime         | 删除时间     | DateTime  |
| LastModifierId       | 最后修改人   | Guid?     |
| LastModificationTime | 最后修改时间 | DateTime  |
| CreatorId            | 创建人       | Guid?     |
| CreationTime         | 创建时间     | DateTime  |