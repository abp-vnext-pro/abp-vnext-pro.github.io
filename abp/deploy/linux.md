# Linux 部署(宝塔)
1. 前提：安装好宝塔环境
2. [宝塔官方地址](https://www.bt.cn/new/product_linux.html)

:::warning 
部署好之后记得查看防火墙,跨域配置
:::

## 安装环境

### Net安装

![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-1.png)

### MySql安装
- 点击左侧菜单“软件管理”，安装系统软件：MySQL(选择对应数据库，这里用mysql演示)、Redis(可选)、RabbitMQ(可选)

![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-5.png)

### Redis安装
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-3.png)

### RabbitMQ安装
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-4.png)

## 后端部署

### 生成数据库
- 修改Lion.AbpPro.DbMigrator的appsetting.json为线上数据库地址
- 运行Lion.AbpPro.DbMigrator项目,会生成数据库结构和种子数据

### 修改配置
- 生产环境读取appsetting.Production.json配置，请确保已配置

### 发布项目
- 在Lion.AbpPro.HttpApi.Host.csproj路径下打开cmd或者powershell,执行一下命令

```bash
dotnet publish Lion.AbpPro.HttpApi.Host.csproj -c Release -o publish/adminapi /p:UseAppHost=false
```
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-7.png)

- 在/publish/adminapi下压缩当前项目amdinapi.zip

### 上传项目
1. 点击左侧菜单“文件”，新增目录/www/wwwroot/abppro

![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-6.png)

2. 上传amdinapi.zip,在执行解压

![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-8.png)
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-9.png)

### 创建项目
1. 点击左侧菜单“网站”，选择Net项目,点击新建项目

![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-10.png)
2. 创建项目

![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-11.png)
```bash
dotnet Lion.AbpPro.HttpApi.Host.dll --urls=http://*44312
```

### 开放端口
1. 宝塔端
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-13.png)

2. 云服务器端(腾讯云示例)
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-14.png)

### 是否启动成功
- 无错误日志，正常启动，服务器放行44312端口，通过ip+port访问项目
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-12.png)

- 浏览器输入ip+port会跳转到后端登录页面,既部署成功
- 默认用户名密码:admin/1q2w3E*

## 前端部署

### Nginx安装
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-16.png)

### 修改配置
- env.production 接口地址为以上你发布的地址,如果配置了域名改成域名即可
```js
# 后端接口地址
VITE_APP_API_ADDRESS=http://ip:port

# websocket地址
VITE_WEBSOCKET_URL=http://ip:port/signalr/notification
```
### 还原项目
- 在项目根目录下执行 pnpm install

### 构建项目
- 如果你的项目中使用了 antd，需要执行下面的命令
- 执行了命令之后会在apps/web-antd或者apps/web-ele或者apps/web-naive目录下有个dist文件夹
- 进入到dist文件夹,全选所有文件,压缩成dist.zip

```bash
pnpm run build:antd
```

- 如果你的项目中使用了 element-ui，需要执行下面的命令

```bash
pnpm run build:ele
```
- 如果你的项目中使用了 naive，需要执行下面的命令

```bash
pnpm run build:naive
```

### 上传项目
- 上传web.zip到/www/wwwroot/public下
- dist.zip重命名为adminweb.zip
- 解压项目
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-15.png)

### 创建Html项目
1. 点击左侧菜单“网站”，选择Html项目,点击新建项目
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-17.png)
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-18.png)

2. 修改Nginx配置
- 添加以下配置
```bash
    underscores_in_headers on;  # 启用下划线支持 多租户的租户id通过请求头传毒
    location / {
        try_files $uri $uri/ /index.html; # 解决刷新404
    }
```
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/linux-baota-19.png)

### 开放端口
- 当前前端用的44313端口，请在宝塔上和云服务器端开放

### 修改跨越配置
- 修改appsetting.Production.json配置
```json
  "Cors": {
    "Enabled": true,
    "CorsOrigins": "http://localhost:4200,http://ip:44313"
  },
```

### 是否启动成功
- 浏览器通过ip+port访问项目
- 默认用户名密码:admin/1q2w3E*

### Nginx完整配置
```bash
server
{
    listen 44313;
    listen [::]:44313;
    server_name 139.155.114.244_44313;
    index index.html index.htm default.htm default.html;
    root /www/wwwroot/public/adminweb;
    #CERT-APPLY-CHECK--START
    # 用于SSL证书申请时的文件验证相关配置 -- 请勿删除并保持这段设置在优先级高的位置
    include /www/server/panel/vhost/nginx/well-known/139.155.114.244_44313.conf;
    #CERT-APPLY-CHECK--END

    #SSL-START SSL相关配置，请勿删除或修改下一行带注释的404规则
    #error_page 404/404.html;
    #SSL-END

    #ERROR-PAGE-START  错误页配置，可以注释、删除或修改
    #error_page 404 /404.html;
    #error_page 502 /502.html;
    #ERROR-PAGE-END

    #REWRITE-START URL重写规则引用,修改后将导致面板设置的伪静态规则失效
    include /www/server/panel/vhost/rewrite/html_139.155.114.244_44313.conf;
    #REWRITE-END
    underscores_in_headers on;  # 启用下划线支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    #禁止访问的文件或目录
    location ~ ^/(\.user.ini|\.htaccess|\.git|\.env|\.svn|\.project|LICENSE|README.md)
    {
        return 404;
    }

    #一键申请SSL证书验证目录相关设置
    location ~ \.well-known{
        allow all;
    }

    #禁止在证书验证目录放入敏感文件
    if ( $uri ~ "^/\.well-known/.*\.(php|jsp|py|js|css|lua|ts|go|zip|tar\.gz|rar|7z|sql|bak)$" ) {
        return 403;
    }

    location ~ .*\\.(gif|jpg|jpeg|png|bmp|swf)$
    {
        expires      30d;
        error_log /dev/null;
        access_log /dev/null;
    }

    location ~ .*\\.(js|css)?$
    {
        expires      12h;
        error_log /dev/null;
        access_log /dev/null;
    }
    access_log  /www/wwwlogs/139.155.114.244_44313.log;
    error_log  /www/wwwlogs/139.155.114.244_44313.error.log;
}
```
