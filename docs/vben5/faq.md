---
outline: deep
---

# 常见问题

## 依赖问题

在 `Monorepo` 项目下，需要养成每次 `git pull`代码都要执行`pnpm install`的习惯，因为经常会有新的依赖包加入，项目在`.husky/git-merge`已经配置了自动执行`pnpm install`，但是有时候会出现问题，如果没有自动执行，建议手动执行一次。

## 关于缓存更新问题

项目配置默认是缓存在 `localStorage` 内，所以版本更新后可能有些配置没改变。

解决方式是每次更新代码的时候修改 `package.json` 内的 `version` 版本号. 因为 localStorage 的 key 是根据版本号来的。所以更新后版本不同前面的配置会失效。重新登录即可

## 关于修改配置文件的问题

当修改 `.env` 等环境文件以及 `vite.config.ts` 文件时，vite 会自动重启服务。

自动重启有几率出现问题，请重新运行项目即可解决.

## 本地运行报错

由于 vite 在本地没有转换代码，且代码中用到了可选链等比较新的语法。所以本地开发需要使用版本较高的浏览器(`Chrome 90+`)进行开发

## 页面切换后页面空白

这是由于开启了路由切换动画,且对应的页面组件存在多个根节点导致的，在页面最外层添加`<div></div>`即可

**错误示例**

```vue
<template>
  <!-- 注释也算一个节点 -->
  <h1>text h1</h1>
  <h2>text h2</h2>
</template>
```

**正确示例**

```vue
<template>
  <div>
    <h1>text h1</h1>
    <h2>text h2</h2>
  </div>
</template>
```

::: tip 提示

- 如果想使用多个根标签，可以禁用路由切换动画
- template 下面的根注释节点也算一个节点

:::

## 打包文件过大

- 首先，完整版由于引用了比较多的库文件，所以打包会比较大。可以使用精简版来进行开发

- 其次建议开启 gzip，使用之后体积会只有原先 1/3 左右。gzip 可以由服务器直接开启。如果是这样，前端不需要构建 `.gz` 格式的文件，如果前端构建了 `.gz` 文件，以 nginx 为例，nginx 需要开启 `gzip_static: on` 这个选项。

- 开启 gzip 的同时还可以同时开启 `brotli`，比 gzip 更好的压缩。两者可以共存

**注意**

- gzip_static: 这个模块需要 nginx 另外安装，默认的 nginx 没有安装这个模块。

- 开启 `brotli` 也需要 nginx 另外安装模块

## 内网部署，图标加载不出来
- 以antd版本为例
- 在apps/web-antd/src/bootstrap.ts 下添加一下代码：
```ts
// 加载本地图标
import '#/hooks/useLoadIcon';
```
- useLoadIcon里面包含了很多图标，会导致首次加载变慢，你可以只需要加载对应的，比如你只使用了antd的图标，就只用antd的。

```ts
import { addCollection } from '@vben/icons';

import AntDesignIcons from '@iconify/json/json/ant-design.json'; // 你只使用了antd的图标，就只用antd的。其它的都可以注释
import CarbonIcons from '@iconify/json/json/carbon.json';
import EpIcons from '@iconify/json/json/ep.json';
import IcIcons from '@iconify/json/json/ic.json';
import LogosIcons from '@iconify/json/json/logos.json';
import LucideIcons from '@iconify/json/json/lucide.json';
import MdiIcons from '@iconify/json/json/mdi.json';
import OuiIcons from '@iconify/json/json/oui.json';
import PhosphorIcons from '@iconify/json/json/ph.json';
import UnIcons from '@iconify/json/json/uil.json';

addCollection(AntDesignIcons);
addCollection(LucideIcons);
addCollection(CarbonIcons);
addCollection(IcIcons as any);
addCollection(LogosIcons as any);
addCollection(PhosphorIcons as any);
addCollection(UnIcons);
addCollection(OuiIcons);
addCollection(MdiIcons);
addCollection(EpIcons);

```