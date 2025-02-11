
::: tip 注意
- cli支持windows,mac,linux
:::

## 创建开源后端项目

### 安装Cli
```bash
dotnet tool install Lion.AbpPro.Cli -g
```

### 更新Cli
```bash
dotnet tool update Lion.AbpPro.Cli -g
```

### 三个项目模板
- 源码版本

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

## 创建付费后端项目

### 登录
```bash
lion.abp login -token 你的token
```

<a href="github-token" target="_blank">如何创建token,请参考这个文档</a>

### 创建项目
```bash
# 源码版本
lion.abp create -t pro -c 公司名称 -p 项目名称

# nuget版本，没有网关
lion.abp create -t pro-nuget -c 公司名称 -p 项目名称

# nuget版本，有网关
lion.abp create -t pro-nuget-gateways -c 公司名称 -p 项目名称
```

## 问题
1. 在windows上创建源码版本的项目会存在:生成模板失败Access to the path xx is denied.
- 暂时没有找到问题，权限的都试过了。
- 可以通过下载[Lion.AbpPro.Cli.exe](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/Lion.AbpPro.Cli.exe)
- 在下载的路径下打开cmd执行lion.abp命令即可解决