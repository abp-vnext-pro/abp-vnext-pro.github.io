---
group:
  text: 部署
  sort: 6
  collapsed: true  
---

# Docker 部署

## 后端

- 在 aspnetcore 目录下执行
- 修改 appsetting.Production.json 配置
  - 数据库连接
  - Redis 连接
  - Rabbitmq 连接(可选)

### Dockerfile

```bash
FROM mcr.microsoft.com/dotnet/aspnet:10.0  AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443
ENV TZ=Asia/Shanghai
ENV ASPNETCORE_ENVIRONMENT=Production

FROM mcr.microsoft.com/dotnet/sdk:10.0  AS build
WORKDIR /src
COPY . .
WORKDIR "/src/services/host/Lion.AbpPro.HttpApi.Host"
RUN dotnet build "Lion.AbpPro.HttpApi.Host.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Lion.AbpPro.HttpApi.Host.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Lion.AbpPro.HttpApi.Host.dll"]
```

### 构建镜像

```bash
docker build -t Lion.AbpPro.HttpApi.Host .
```

### 启动容器

```bash
docker run -itd --name Lion.AbpPro.HttpApi.Host -p 8011:80 Lion.AbpPro.HttpApi.Host
```

## Vben2.8

- 修改 env.production 接口地址为以上你发布的地址
- 打包项目

### Dockerfile

```bash
FROM node:16-alpine as build-stage
WORKDIR /app
COPY . ./
ENV NODE_OPTIONS=--max-old-space-size=16384
RUN npm install pnpm -g
RUN pnpm i
RUN pnpm build


FROM nginx:1.17.3-alpine as production-stage
COPY --from=build-stage app/_nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage app/_nginx/env.js /etc/nginx/env.js
COPY --from=build-stage app/_nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage app/dist/ /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 构建镜像

```bash
docker build -t Lion.AbpPro.Vue2.8 .
```

### 启动容器

```bash
docker run -itd --name Lion.AbpPro.Vue2.8 -p 8012:80 Lion.AbpPro.Vue2.8
```

## Vben5

- 修改 env.production 接口地址为以上你发布的地址
- 打包项目

### Dockerfile

```bash
FROM node:20-slim AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_OPTIONS=--max-old-space-size=8192
ENV TZ=Asia/Shanghai

RUN corepack enable

WORKDIR /vben5

# copy package.json and pnpm-lock.yaml to workspace
COPY . /vben5

RUN pnpm install --frozen-lockfile
# 如果你的项目中使用了 antd，需要执行下面的命令
RUN pnpm build:antd

# 如果你的项目中使用了 element-ui，需要执行下面的命令
#RUN pnpm build:ele

# 如果你的项目中使用了 naive，需要执行下面的命令
#RUN pnpm build:naive

RUN echo "Builder Success 🎉"

FROM nginx:stable-alpine AS production

RUN echo "types { application/javascript js mjs; }" > /etc/nginx/conf.d/mjs.conf

# 如果你的项目中使用了 antd，需要执行下面的命令
COPY --from=builder /vben5/apps/web-antd/dist /usr/share/nginx/html

# 如果你的项目中使用了 element-ui，需要执行下面的命令
#COPY --from=builder /vben5/apps/web-ele/dist /usr/share/nginx/html

# 如果你的项目中使用了 naive，需要执行下面的命令
#COPY --from=builder /vben5/apps/web-naive/dist /usr/share/nginx/html

COPY --from=builder /vben5/_nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 8080

# start nginx
CMD ["nginx", "-g", "daemon off;"]

```

### 构建镜像

```bash
docker build -t Lion.AbpPro.Vue .
```

### 启动容器
```bash
docker run -itd --name Lion.AbpPro.Vue -p 8012:8080 Lion.AbpPro.Vue
```