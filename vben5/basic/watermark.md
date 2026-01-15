---
sidebar:
  sort: 6
---
# 页面水印

- 默认值：`false`

开启后网页会显示水印，在应用目录下的`preferences.ts`，开启或者关闭即可。

```ts
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  app: {
    watermark: true,
  },
});
```

如果你想更新水印的内容，可以这么做，参数可以参考 [watermark-js-plus](https://zhensherlock.github.io/watermark-js-plus/)：

```ts
import { useWatermark } from '@vben/hooks';

const { destroyWatermark, updateWatermark } = useWatermark();