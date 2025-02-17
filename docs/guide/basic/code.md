
::: tip 注意
- cli支持windows,mac,linux
:::


### 安装Cli
```bash
dotnet tool install Lion.AbpPro.Cli -g
```

### 更新Cli
```bash
dotnet tool update Lion.AbpPro.Cli -g
```

###  cli和代码生成器模块配合使用
1. 通过web页面的代码模块创建实体
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/code-1.png)
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/code-2png.png)

2. 创建好实体之后，执行cli
- 这个cli在你的项目的src路径下执行,它会默认找到这个位置,你也可以通过 -s 参数指定你的代码位置,代码位置为src的绝对路径
```bash
lion.abp code  -p 项目id -t 模板id -s 参数指定的项目src地址(可选)
```

3. 执行完成后，检查代码是否正确。然后执行dotnet ef迁移命令生成数据库即可。

4. 如何获取项目id和模板id
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/code-3.png)


::: tip 注意
- web创建的公司名称和项目名称和你的代码的需要对应上。
- 比如公司名称Erp,项目名称OA,那你的项目就是Erp.OA
:::
