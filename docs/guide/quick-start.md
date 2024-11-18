---
outline: deep
---

# 快速开始 {#quick-start}

## 前置准备

::: info 环境要求
在启动项目前，你需要确保你的环境满足以下要求：
- [dotnet core 8.0](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [nodejs 20.15.0+](https://nodejs.org/zh-cn/)
- [pnpm](https://www.pnpm.cn/installation)
- [mysql](https://dev.mysql.com/downloads/installer/)
- [redis](https://redis.io/docs/getting-started/installation/)
- [rabbitmq 可选](https://www.rabbitmq.com/download.html)

:::

## 后端
### 安装 CLI 工具
```bash
dotnet tool install Lion.AbpPro.Cli -g
```
### 创建项目

```bash
lion.abp new -t pro -c 公司名称 -p 项目名称  -o 输出路径(可选)
lion.abp new -t pro.all -c 公司名称 -p 项目名称  -o 输出路径(可选)
lion.abp new -t pro.module -c 公司名称 -p 项目名称  -m 模块名称  -o 输出路径(可选)
```
:::

::: danger 注意
VS 编译项目字符串超过 256 个字符,把项目拷贝到磁盘根目录 OR 使用 Rider 开发
:::

### 后端修改配置
- 修改 HttpApi.Host-> appsettings.json 配置
  - Mysql 连接字符串
  - Redis 连接字符串
  - RabbitMQ 连接字符串(可选)
- 修改 DbMigrator-> appsettings.json 数据库连接字符串
- 右键单击.DbMigrator 项目,设置为启动项目运行，按 F5(或 Ctrl + F5) 运行应用程序

::: danger 注意

初始的种子数据在数据库中创建了 admin 用户(密码为1q2w3E*) 用于登录应用程序. 所以, 对于新数据库至少使用 .DbMigrator 一次.

:::


## 前端Vben2.8

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

## 前端Vben5

在你的代码目录内打开终端，并执行以下命令:

::: danger 注意

注意存放代码的目录及所有父级目录不能存在中文、韩文、日文以及空格，否则安装依赖后启动会出错。

:::

::: tip 注意

- Vben5 版本的前端项目,需要找作者购买源码
- 联系方式: 510423039@qq.com
- 微信号：WJLXRzzZ
- 微信号：LX2668812066
:::

### 获取源码项目

```bash
git clone https://github.com/abp-vnext-pro/abp-vnext-pro-vben5.git
```


执行以下命令运行项目:

```bash
# 在项目根目录下执行
pnpm i

# 运行指定项目 and版本(apps/web-antd)
pnpm run dev:antd
```

