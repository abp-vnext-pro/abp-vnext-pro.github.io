---
sidebar:
  sort: 1
  text: 后端   
---


# 常见问题

## 生成模板失败Access to the path xx is denied
- 在windows上通过cli创建源码版本的项目会存在:生成模板失败Access to the path xx is denied.解决方式: 指定-o 参数.也就是你的想要要生成的路径地址.

## 后端项目路径太长,编译失败
- VS 编译项目字符串超过 256 个字符,把项目拷贝到磁盘根目录 OR 使用 Rider 开发
