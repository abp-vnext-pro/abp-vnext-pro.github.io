---
outline: deep
---
::: tip 前言

由于是展示项目，所以打包后相对较大，如果项目中没有用到的插件，可以删除对应的文件或者路由，不引用即可，没有引用就不会打包。

:::

## 构建

项目开发完成之后，执行以下命令进行构建：

**注意：** 请在项目根目录下执行以下命令

```bash
pnpm build
```

构建打包成功之后，会在根目录生成对应的应用下的 `dist` 文件夹，里面就是构建打包好的文件，例如: `apps/web-antd/dist/`


## IIS部署
### History模式
- 修改.env.production配置
    - VITE_ROUTER_HISTORY=history

### 安装Iss url write模块
- 在dist下添加web.config
```xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Handle History Mode and custom 404/500" stopProcessing="true">
          <match url="(.*)" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```
