---
sidebar:
  sort: 14
---

# SignalR
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
5. 前端
- 登录成功之后调用useSignalR连接
```javascript
import { useEventbus } from '@vben/hooks';
import { useUserStore } from '@vben/stores';

import * as signalR from '@microsoft/signalr';
import { notification } from 'ant-design-vue';

import { useAuthStore } from '#/store';

const eventbus = useEventbus();
let connection: signalR.HubConnection;
export function useSignalR() {
  /**
   * 开始连接SignalR
   */
  async function startConnect() {
    try {
      const userStore = useUserStore();
      if (userStore.checkUserLoginExpire()) {
        console.debug('未检测到用户信息,登录之后才会链接SignalR.');
        return;
      }
      connectionsignalR();
      await connection.start();
    } catch (error) {
      console.error(error);
      setTimeout(() => startConnect(), 5000);
    }
  }

  /**
   * 关闭SignalR连接
   */
  function closeConnect(): void {
    connection?.stop();
  }

  async function connectionsignalR() {
    const userStore = useUserStore();
    const token = userStore.userInfo?.token;
    connection = new signalR.HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_WEBSOCKET_URL, {
        accessTokenFactory: () => token,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // 重连规则：重连次数<300：间隔1s;重试次数<3000:间隔3s;重试次数>3000:间隔30s
          const count = retryContext.previousRetryCount / 300;
          if (count < 1) {
            // 重试次数<300,间隔1s
            return 1000;
          } else if (count < 10) {
            // 重试次数>300:间隔5s
            return 1000 * 5;
          } // 重试次数>3000:间隔30s
          else {
            return 1000 * 30;
          }
        },
      })
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    // 接收普通文本消息
    connection.on('ReceiveTextMessageAsync', ReceiveTextMessageHandlerAsync);
    // 接收广播消息
    connection.on(
      'ReceiveBroadCastMessageAsync',
      ReceiveBroadCastMessageHandlerAsync,
    );
    // 接收强制下线消息
    connection.on('ForceOutAsync', ForceOutAsync);
  }

  /**
   * 接收文本消息
   * @param message 消息体
   */
  function ReceiveTextMessageHandlerAsync(message: any) {
    // 发布事件
    eventbus.publish('ReceiveTextMessageHandlerAsync', message);
    if (message.messageLevel === 10) {
      notification.warn({
        description: message.content,
        message: message.title,
      });
    }
    if (message.messageLevel === 20) {
      notification.info({
        message: message.title,
        description: message.content,
      });
    }
    if (message.messageLevel === 30) {
      notification.error({
        message: message.title,
        description: message.content,
      });
    }
  }

  /**
   * 接收广播消息
   * @param message 消息体
   */
  function ReceiveBroadCastMessageHandlerAsync(message: any) {
    // 发布事件
    eventbus.publish('ReceiveTextMessageHandlerAsync', message);
    if (message.messageLevel === 10) {
      notification.warn({
        message: message.title,
        description: message.content,
      });
    }
    if (message.messageLevel === 20) {
      notification.info({
        message: message.title,
        description: message.content,
      });
    }
    if (message.messageLevel === 30) {
      notification.error({
        message: message.title,
        description: message.content,
      });
    }
  }

  /**
   * 强制下线通知
   * @param message 消息体
   */
  async function ForceOutAsync(message: any) {
    console.warn('收到强制下线通知:', message);
    const authStore = useAuthStore();
    notification.warn({
      description: message.message,
      message: '',
      duration: 600,
    });
    await authStore.logout();
  }
  return { startConnect, closeConnect };
}

```
