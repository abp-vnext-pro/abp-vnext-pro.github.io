# 发布订阅
### mitt
- 集成了mitt实现发布订阅
- 封装成hook

### hook
```ts
import { onUnmounted } from 'vue';

import mitt from 'mitt';

type IEventbus = {
  publish: (eventName: string, content: any) => void;
  subscribe: (eventName: string, callback: (content: any) => void) => void;
};

const emitter = mitt();

/**
 * @description: 发布事件
 * @param {*} eventName 事件名称
 * @param {*} content 事件内容
 */
const publish = (eventName: string, content: any) => {
  emitter.emit(eventName, content);
};

/**
 * @description: 订阅事件
 * @param {*} eventName 事件名称
 * @param {*} callback 回调的函数
 */
const subscribe = (eventName: string, callback: (content: any) => void) => {
  emitter.on(eventName, (content) => callback(content));
};

/**
 * @description: 导出useEventbus
 */
export const useEventbus = (): IEventbus => {
  // 销毁的事件
  onUnmounted(() => {
    // 清空所有的事件，避免多组件互相清理
    emitter.all.clear();
  });

  return {
    publish,
    subscribe,
  };
};

```

### 如何使用?
```ts
import { useEventbus } from '@vben/hooks';
const eventbus = useEventbus();
// 发布事件
eventbus.publish('name', '内容');

//订阅事件
eventbus.subscribe('ReceiveTextMessageHandlerAsync', (content) => {
  // todo 
});
```