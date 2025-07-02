---
outline: deep
---
# C#API客户端代理
- ABP可以动态创建 C# API 客户端代理来调用您的远程 HTTP 服务 （REST API）。这样，您无需通过自定义httpclient来调用你的接口。
- 我们发现创建的abp项目都有一层xxx.HttpApi.Client的项目，这个模块就是用来生成客户端代理的。

## 如何使用
- 比如我们封装了一个BookStore的模块，并且打包成了服务，并单独部署，假设部署的访问端口是http://localhost:44111,
- 按照我们以前如果需要去调用这个服务，需要通过httpclient来处理。
- abp已经帮我们封装好了。我们只需要在我们需要调用的层添加BookStore.HttpApi.Client的引用，然后注册模块依赖。

### 配置
```json
{
  "RemoteServices": {
    // BookStoreService 这个名字在BookStore.HttpApi.Client的module定义
    "BookStoreService": {
      "BaseUrl": "http://localhost:44111/"
    } 
  } 
}
```
### 调用接口
- 这个时候直接注入BookStore的service接口就可以在你的其他服务中调用BookStore服务了。