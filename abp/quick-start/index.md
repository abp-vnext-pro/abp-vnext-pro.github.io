---
group:
  icon: meteor-icons:microchip
  text: 简介
  sort: 1
---

### 快速开始

## 前置准备

::: info 环境要求
在启动项目前，你需要确保你的环境满足以下要求：
- [dotnet core 9.0](https://dotnet.microsoft.com/en-us/download/dotnet/9.0)
- [nodejs 20.15.0+](https://nodejs.org/zh-cn/)
- [pnpm](https://www.pnpm.cn/installation)
- [mysql](https://dev.mysql.com/downloads/installer/)
- [redis](https://redis.io/docs/getting-started/installation/)
- [rabbitmq 可选](https://www.rabbitmq.com/download.html)

:::

## CLI
### 安装 CLI 工具
```bash
dotnet tool install Lion.AbpPro.Cli -g
```
### 更新 CLI 工具
```bash
dotnet tool update Lion.AbpPro.Cli -g
```
### 创建Vben2项目

```bash
lion.abp new -t pro -c 公司名称 -p 项目名称 -v 版本(默认LastRelease)
```

- nuget版本

```bash
lion.abp new -t pro-nuget -c 公司名称 -p 项目名称 -v 版本(默认LastRelease)
```


- 模块

```bash
lion.abp new -t pro-module -c 公司名称 -p 项目名称 -m 模块名称 -v 版本(默认LastRelease) 
```


## 创建Vben5项目

### 登录
```bash
lion.abp login -token 你的token
```

### 创建项目
```bash
# 源码版本
lion.abp create -t pro -c 公司名称 -p 项目名称  -o 输出路径 -v 版本(默认LastRelease)

# nuget版本，没有网关
lion.abp create -t pro-nuget -c 公司名称 -p 项目名称 -o 输出路径 -v 版本(默认LastRelease)

# nuget版本，有网关
lion.abp create -t pro-nuget-gateways -c 公司名称 -p 项目名称 -o 输出路径 -v 版本(默认LastRelease)
```

::: danger 注意
VS 编译项目字符串超过 256 个字符,把项目拷贝到磁盘根目录 OR 使用 Rider 开发
- 在windows上创建源码版本的项目会存在:生成模板失败Access to the path xx is denied.
    - 解决方式: 指定-o 参数， 也就是你的想要要生成的路径地址
:::

### 修改配置
- 修改service下 xxx.HttpApi.Host-> appsettings.Development.json 配置
  - Mysql 连接字符串
  - Redis 连接字符串
  - RabbitMQ 连接字符串(可选)
```json
  "ConnectionStrings": {
    "Default": "Data Source=localhost;Port=3306;Database=LionAbpProDB;uid=root;pwd=1q2w3E*;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true"
  },
  "Redis": {
    "Configuration": "localhost:6379,password=1q2w3E*,defaultdatabase=1"
  }，
  "Cap": {
    "RabbitMq": {
      "HostName": "localhost",
      "UserName": "admin",
      "Password": "1q2w3E*",
      "Port": 5672
    }
  }  
```
- 修改 DbMigrator-> appsettings.Development.json 数据库连接字符串
```json
  "ConnectionStrings": {
    "Default": "Data Source=localhost;Port=3306;Database=LionAbpProDB;uid=root;pwd=1q2w3E*;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true"
  } 
```  
- 右键单击.DbMigrator 项目,设置为启动项目运行，按 F5(或 Ctrl + F5) 运行应用程序
- 启动后端service下的host项目，访问后台 `http://localhost:44315/login`
- 登录账号密码 <span style="color:red;font-size:22px">admin/1q2w3E*</span>


::: danger 注意

- 初始的种子数据在数据库中创建了 admin 用户(密码为1q2w3E*) 用于登录应用程序. 所以, 对于新数据库至少使用 .DbMigrator 一次.
- 如果是通过lion.abp new -t pro.all创建的项目，请在Lion.AbpPro.EntityFrameworkCore目录下执行dotnet ef migrations add init 生成迁移文件
:::


## 前端Vben2.8
- 安装[pnpm](https://www.pnpm.cn/installation)

在你的代码目录内打开终端，并执行以下命令:

::: danger 注意

注意存放代码的目录及所有父级目录不能存在中文、韩文、日文以及空格，否则安装依赖后启动会出错。

:::

### 获取源码项目
- 代码生成的文件夹下Vben28

```bash
# 进入项目目录
cd vben28

# 安装依赖
pnpm install

# 启动项目
pnpm run dev
```
### 访问

::: tip 注意
- 访问 `http://localhost:4200`
- Vben2.8版本本地调试首次访问会比较慢，长达几分钟，请耐心等待(Vben5已解决)。
- 登录账号密码 admin/1q2w3E*
:::


## 前端Vben5
- 安装[pnpm](https://www.pnpm.cn/installation)
在你的代码目录内打开终端，并执行以下命令:

::: danger 注意

注意存放代码的目录及所有父级目录不能存在中文、韩文、日文以及空格，否则安装依赖后启动会出错。

:::

::: tip 注意

- Vben5 版本的前端项目,需要找作者购买源码
- 联系方式: 510423039@qq.com
- 微信号：WJLXRzzZ
:::


执行以下命令运行项目:

```bash
# 在项目根目录下执行
pnpm i

# 运行指定项目 and版本(apps/web-antd)
pnpm run dev:antd
```
### 访问

::: tip 注意
- 访问 `http://localhost:4200`
- 登录账号密码 admin/1q2w3E*
:::
