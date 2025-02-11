---
outline: deep
---
::: tip 前言

创建付费版本的后端，需要创建token。

:::

- 打开github右上角Settings
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/cli-token-1.png)

- 点击Developer Settings
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/cli-token-2.png)

- 选择Fine-grained Tokens 
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/cli-token-3.png)

- 设置相关信息
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/cli-token-4.png)


- 设置权限
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/cli-token-5.png)

- 点击保存

- 通过token登录cli
```bash
lion.abp login -token 你的token
```

- 登录成功之后就可以创建付费的项目了。