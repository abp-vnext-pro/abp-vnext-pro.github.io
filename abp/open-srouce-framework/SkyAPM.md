---
sidebar:
  sort: 8
---

## 分布式链路追踪(SkyAPM)
- SkyAPM（SkyWalking APM）是一个开源的分布式链路追踪系统，主要用于微服务架构下的性能监控和问题诊断。
- Github：[SkyAPM-dotnet](https://github.com/SkyAPM/SkyAPM-dotnet)

## 环境准备
1. Docker Compose 配置
创建 docker-compose.yml 文件：

```yml
version: "3"
services:
    elasticsearch:
        image: elasticsearch:8.4.2
        container_name: elasticsearch
        ports:
        - "9200:9200"
        healthcheck:
            test: ["CMD-SHELL", "curl -sf http://localhost:9200/_cluster/health || exit 1"]
            interval: 60s
            timeout: 10s
            retries: 3
            start_period: 60s
        environment:
            discovery.type: single-node
            ingest.geoip.downloader.enabled: "false"
            bootstrap.memory_lock: "true"
            ES_JAVA_OPTS: "-Xms512m -Xmx512m"
            TZ: "Asia/Shanghai"
            xpack.security.enabled: "false"
        ulimits:
            memlock:
                soft: -1
                hard: -1
    skywalking-oap:
        image: apache/skywalking-oap-server:9.3.0
        container_name: skywalking-oap
        depends_on:
            elasticsearch:
                condition: service_healthy
        links:
            - elasticsearch
        environment:
            SW_HEALTH_CHECKER: default
            SW_STORAGE: elasticsearch
            SW_STORAGE_ES_CLUSTER_NODES: elasticsearch:9200
            JAVA_OPTS: "-Xms2048m -Xmx2048m"
            TZ: Asia/Shanghai
            SW_TELEMETRY: prometheus
        healthcheck:
            test: ["CMD-SHELL", "/skywalking/bin/swctl ch"]
            interval: 30s
            timeout: 10s
            retries: 3
            start_period: 10s
        restart: on-failure
        ports:
        - "11800:11800"
        - "12800:12800"
    skywalking-ui:
        image: apache/skywalking-ui:9.3.0
        depends_on:
            skywalking-oap:
                condition: service_healthy
        links:
            - skywalking-oap
        ports:
        - "8080:8080"
        environment:
            SW_OAP_ADDRESS: http://skywalking-oap:12800
            SW_HEALTH_CHECKER: default
            TZ: Asia/Shanghai
        healthcheck:
            test: ["CMD-SHELL", "curl -sf http://localhost:8080 || exit 1"]
            interval: 60s
            timeout: 10s
            retries: 3
            start_period: 60s

```

## 后端配置

1. 安装Nuget
- 在 Web Host 项目中添加 SkyAPM.Agent.AspNetCore 包（版本 2.1.0）

```csharp
<ItemGroup>
    <PackageReference Include="SkyAPM.Agent.AspNetCore" Version="2.1.0" />
</ItemGroup>
```    
2. 安装 CLI 工具
```bash
- dotnet tool install -g SkyAPM.DotNet.CLI
```

- 在host目录下执行dotnet skyapm config ${your_service_name} 
```bash
- dotnet skyapm config Lion.AbpPro
```

- 执行完之后会在appstting.json同级目录下生成skyapm.json

3. 设置环境变量
- 在 launchSettings.json 中添加以下环境变量：
- "ASPNETCORE_HOSTINGSTARTUPASSEMBLIES": "SkyAPM.Agent.AspNetCore",
- "SKYWALKING__SERVICENAME": "Lion.AbpPro"
```json
{
  "profiles": {
    "Lion.AbpPro.HttpApi.Host": {
      "commandName": "Project",
      "launchBrowser": true,
      "applicationUrl": "http://localhost:44315",
      "environmentVariables": {
        "ASPNETCORE_ENVIRONMENT": "Development",
        "ASPNETCORE_HOSTINGSTARTUPASSEMBLIES": "SkyAPM.Agent.AspNetCore",
        "SKYWALKING__SERVICENAME": "Lion.AbpPro"
      }
    }
  }
}
```
## 效果
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/skyapm.png)
