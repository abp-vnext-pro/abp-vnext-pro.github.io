---
sidebar:
  sort: 8
---

## SignalR
1. 基于Volo.Abp.AspNetCore.SignalR封装Lion.AbpPro.SignalR
2. 可以不依赖通知模块，实现发送消息，但是消息无法持久化，如果需要持久化，请集成通知模块配合使用
3. 集成：添加Lion.AbpPro.SignalR
4. 添加AbpProSignalRModule模块依赖

## 接口
1. Hub定义
2. 前端订阅
```csharp
namespace Lion.AbpPro.SignalR.Hubs
{
    public interface INotificationHub
    {
        /// <summary>
        /// 接受普通消息
        /// </summary>
        Task ReceiveTextMessageAsync(SendNotificationDto message);

        /// <summary>
        /// 接受广播消息
        /// </summary>
        Task ReceiveBroadCastMessageAsync(SendNotificationDto message);
    }
}
```
4. 在使用得地方注入IMessageManager接口即可使用
- isPersistent 是否持久化,如果ture会在消息管理中查询到记录，需要集成通知模块
```csharp
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
         bool isPersistent = true);
}

```