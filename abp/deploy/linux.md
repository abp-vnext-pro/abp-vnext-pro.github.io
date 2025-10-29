---
group:
  icon: meteor-icons:microchip
  text: 部署
  sort: 6
---

# Linux 部署(宝塔)

## 后端

- 在 aspnetcore 目录下执行
- 修改 appsetting.Production.json 配置
  - 数据库连接
  - Redis 连接
  - Rabbitmq 连接(可选)

- 发布
  - 在Lion.AbpPro.HttpApi.Host.csproj路径下打卡cmd或者powershell打开,执行一下命令
  - 或者通过vs|rider页面发布
```bash
dotnet publish Lion.AbpPro.HttpApi.Host.csproj -c Release -o /app/publish /p:UseAppHost=false
```

- 打包上传到服务器
- 打开宝塔，选择网站，选择Net项目，点击新建项目
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/PixPin_2025-10-29_16-56-19.png)
- 开启外网访问
- 防火墙开放44316端口

::: danger 注意
- 如果要使用多租户，nginx 配置中需要添加
    underscores_in_headers on;  # 启用下划线支持
:::    