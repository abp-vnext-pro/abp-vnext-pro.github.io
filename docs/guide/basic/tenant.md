---
outline: deep
---

## 多租户
- vben2.8和vben5前后端都是支持多租户的。
- vben5如果要闭关多租户，只需要通过以下设置即可，**前后端都会自动屏蔽租户相关功能**。
- vben2.8需要自行调整

### 启用或者关闭
```csharp
public static class MultiTenancyConsts
{
    public const bool IsEnabled = true;
}
```
- 如果要关闭租户，只要把IsEnabled设置为false

### 前端
- 如果开启多租户，前端登录界面会加载租户选项。
- 如果关闭多租户，前端登录界面会关闭租户选项，并且屏蔽租户权限和租户的所有菜单。

### 效果
- 开启多租户
![](https://lion-foods.oss-cn-beijing.aliyuncs.com/vben5/tanant-1.png)

- 关闭多租户
    - 上面所看到的租户相关的全部会隐藏