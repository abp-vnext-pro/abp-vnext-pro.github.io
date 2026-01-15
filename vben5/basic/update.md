---
sidebar:
  sort: 7
---
# Vben5更新
- vben5的项目无法像插件或者安装包那样直接更新，你使用代码后，会根据业务需求，进行二次开发，需要自行手动合并升级。

::: tip 推荐

建议关注仓库动态，积极去合并，不要长时间积累，否则将会导致合并冲突过多，增加合并难度。

:::


## 使用 Git 更新代码

1. 克隆代码

```bash
git clone https://github.com/abp-vnext-pro/abp-vnext-pro-vben5.git
```

2. 添加自己的公司 git 源地址

```bash
# up 为源名称,可以随意设置
# gitUrl为开源最新代码
git remote add up gitUrl;
```

3. 新建分支
```bash
git checkout -b vben5
```

4. 提交代码到自己公司 git

```bash
# 提交代码到自己公司
# main为分支名 需要自行根据情况修改
git push up vben5
```

5. 这个时候你可以看到你的代码已经提交到自己公司的 git 仓库了，你需要发起合并请求vben5分支到你项目分支。

::: tip 提示

同步代码的时候会出现冲突。只需要把冲突解决即可

:::