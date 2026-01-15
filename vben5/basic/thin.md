---
sidebar:
  sort: 4
---
# 精简代码
## 应用精简
* 首先，确认你需要的 UI 组件库版本，然后删除对应的应用，比如你选择使用 Ant Design Vue，那么你可以删除其他应用， 只需要删除下面两个文件夹即可：
```bash
apps/web-ele
apps/web-naive
```

## Mock 服务精简
* 如果你不需要Mock服务，你可以直接删除apps/backend-mock文件夹。同时在你的应用下.env.development文件中删除VITE_NITRO_MOCK变量。
```bash
# 是否开启 Nitro Mock服务，true 为开启，false 为关闭
VITE_NITRO_MOCK=false
```

## 安装依赖
* 到这里，你已经完成了精简操作，接下来你可以安装依赖，并启动你的项目：
```bash
pnpm i
```

## 命令调整
* 在精简后，你可能需要根据你的项目调整命令，在根目录下的package.json文件中，你可以调整scripts字段，移除你不需要的命令。
```json
{
  "scripts": {
    "build:antd": "pnpm run build --filter=@vben/web-antd",
    "build:docs": "pnpm run build --filter=@vben/docs",
    "build:ele": "pnpm run build --filter=@vben/web-ele",
    "build:naive": "pnpm run build --filter=@vben/web-naive",
    "build:play": "pnpm run build --filter=@vben/playground",
    "dev:antd": "pnpm -F @vben/web-antd run dev",
    "dev:docs": "pnpm -F @vben/docs run dev",
    "dev:ele": "pnpm -F @vben/web-ele run dev",
    "dev:play": "pnpm -F @vben/playground run dev",
    "dev:naive": "pnpm -F @vben/web-naive run dev"
  }
}   
```
