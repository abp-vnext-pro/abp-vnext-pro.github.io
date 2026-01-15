---
sidebar:
  sort: 1
---

# 账户模块
::: info 
<span style="color:red;font-size:20px">当前模块聚合到BasicManagement模块,包含：</span>
- 账户模块
- 权限模块
- 设置模块
- 功能模块
- 租户模块
- 调度模块
- 审计日志模块

<span style="color:red;font-size:20px">所以在使用以上功能，只需要集成BasicManagement模块(默认已集成)</span>
:::

## 概述
- 账户模块（Account Module）是框架核心业务模块之一，基于 Microsoft Identity 库和 Identity 模块构建，专注于提供用户身份认证与账户管理相关的基础功能，旨在简化开发者在系统身份验证领域的开发工作，保障系统访问安全。

## 身份认证
- 负责用户身份校验流程，包括验证用户名/密码的有效性、生成和验证访问令牌，确保只有经过认证的用户才能访问系统受限资源。兼容 OpenID Connect 协议实现，可对接外部认证服务。

## 用户账户管理
提供完整的用户账户生命周期管理，核心功能包括：
- 账户创建：支持用户自主注册或管理员后台创建账户；
- 信息维护：允许用户修改个人资料（如姓名、邮箱等），管理员可编辑所有用户信息；
- 账户状态控制：支持激活/禁用账户，实现用户访问权限的临时管控；
- 用户锁定：当用户在指定时间内多次输入错误密码时，自动锁定账户一段时间，提升系统安全性。

## 密码管理
提供全面的密码安全保障机制，包括：
- 密码加密存储：采用安全的加密算法存储密码，避免明文存储风险；
- 密码重置：支持用户通过邮箱接收重置链接自主找回密码；
- 密码强度检查：强制用户设置符合安全规范的密码（如长度、字符类型组合等）；
- 密码定期更新：管理员可配置密码有效期，要求用户定期更换密码。

## 角色与权限
-  ABP 权限模块深度集成，支持管理员为用户分配角色，通过角色批量管理用户权限。例如，将用户分配为“管理员”角色，即可自动获取用户管理、权限配置等相关操作权限。

## 社交登录集成
- 支持集成第三方平台（如 Google、Facebook 等）账户进行登录，减少用户注册流程复杂度，提升登录便利性

## 数据库配置
- 配置数据库连接字符串，在 appsettings.json 中设置目标数据库连接信息（以 MySQL 为例）
```json
"ConnectionStrings": {
    "Default": "Server=localhost;Database=YourDbName;Uid=root;Pwd=yourPassword;"
}
```

- 不使用Default数据库连接字符串
```json
"ConnectionStrings": {
    "AbpIdentity": "Server=localhost;Database=YourDbName;Uid=root;Pwd=yourPassword;"
}
```
## 自定义表前缀
- 通过配置 AbpIdentityDbProperties.DbTablePrefix 自定义数据表前缀，例如：

```csharp
public override void PreConfigureServices(ServiceConfigurationContext context)
{
    // 自定义表前缀为 "Sys_"，生成表如 Sys_Users、Sys_Roles
    AbpIdentityDbProperties.DbTablePrefix = "Sys_";
}
```

## 数据表说明

|表名|核心作用|关键字段说明|
|---|---|---|
|AbpUsers|用户表|Id（用户唯一标识）、UserName（用户名）、PasswordHash（加密密码）、Email（邮箱）、PhoneNumber（手机号）、IsActive（是否激活）、LockoutEnd（锁定结束时间）、CreationTime（创建时间）|
|AbpRoles|角色表|Id（角色唯一标识）、Name（角色名称）、DisplayName（显示名称）、Description（描述）、IsDefault（是否默认角色）、IsPublic（是否公开角色）|
|AbpUserRoles|用户与角色的多对多关联表|UserId（关联AbpUsers.Id）、RoleId（关联AbpRoles.Id）|
|AbpUserLogins|第三方登录关联表，存储用户与外部认证平台的绑定信息|UserId（关联AbpUsers.Id）、LoginProvider（认证平台标识，如Google/微信）、ProviderKey（外部平台用户ID）|
|AbpUserTokens|用户令牌表，存储用户的认证令牌、刷新令牌等信息|UserId（关联AbpUsers.Id）、LoginProvider（认证平台）、Name（令牌名称）、Value（令牌值）|
|AbpPermissions|权限定义表|Id（权限标识）、Name（权限名称，如AbpIdentity.Users.Create）、DisplayName（显示名称）、Description（描述）、IsEnabled（是否启用）|
|AbpPermissionGrants|权限授予记录表|Id、Name（权限名称）、ProviderName（授予主体类型，如Role/User）、ProviderKey（主体ID，如角色ID/用户ID）|
|AbpUserClaims|用户声明表|Id、UserId（关联AbpUsers.Id）、ClaimType（声明类型，如NickName/DepartmentId）、ClaimValue（声明值）|
|AbpRoleClaims|角色声明表|Id、RoleId（关联AbpRoles.Id）、ClaimType（声明类型）、ClaimValue（声明值）|
|AbpSecurityLogs|安全日志表，记录账户相关安全操作，用于审计和追溯|Id、ApplicationName（应用名称）、UserId（操作用户ID）、Action（操作类型，如Login/FailedLogin/ChangePassword）、ClientIpAddress（客户端IP）、CreationTime（操作时间）|

