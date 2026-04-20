# 开放平台模块

::: tip 注意
- 当前模块需要付费使用，需要找作者购买源码（购买vben5版本即可）
- 联系方式：510423039@qq.com
- 微信号：WJLXRzzZ
:::

## 如何集成

### 后端

1. 在对应的层添加对应的引用
2. 添加 `DependsOn(typeof(OpenPlatformManagementXxxModule))` 特性到对应模块
    - Lion.AbpPro.OpenPlatformManagement.Application
    - Lion.AbpPro.OpenPlatformManagement.Application.Contracts
    - Lion.AbpPro.OpenPlatformManagement.Domain
    - Lion.AbpPro.OpenPlatformManagement.Domain.Shared
    - Lion.AbpPro.OpenPlatformManagement.EntityFrameworkCore
    - Lion.AbpPro.OpenPlatformManagement.HttpApi
    - Lion.AbpPro.OpenPlatformManagement.HttpApi.Client
3. 在自己的 DbContext 中实现接口：`IOpenPlatformManagementDbContext`
4. 在 EntityFrameworkCore 层添加数据库配置，在 `AbpProDbContext.cs` 的 `OnModelCreating()` 方法中添加 `builder.ConfigureOpenPlatformManagement();`
5. 执行 EF 迁移

## 如何配置单独数据库

- 数据库连接名称：`OpenPlatformManagement`
- 在 `appsettings.json` 下配置

```json
"ConnectionStrings": {
  "Default": "Data Source=localhost;Database=LionAbpProDB;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true",
  "OpenPlatformManagement": "Data Source=localhost;Database=OpenPlatformManagement;uid=root;pwd=mypassword;charset=utf8mb4;Allow User Variables=true;AllowLoadLocalInfile=true"
}
```

## 配置不同租户的数据库连接

- 在租户管理的数据库连接字符串管理中配置
- 这个要事先把表结构生成

## 如何修改表前缀

- `OpenPlatformManagementDbProperties.DbTablePrefix`
    - 重新指定即可

```csharp
public static class OpenPlatformManagementDbProperties
{
    public static string DbTablePrefix { get; set; } = "Abp";
    public static string DbSchema { get; set; } = null;
    public const string ConnectionStringName = "OpenPlatformManagement";
}
```

::: warning 数据库连接
如果没有指定 OpenPlatformManagement 数据连接名称，都会使用 **Default** 的数据库连接。
:::

## API 签名验证规范

### 签名算法

采用 **SHA256** 哈希算法，签名结果转为 **大写十六进制** 字符串。

### 签名参数

#### 公共参数

| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| AppKey | string | 是 | 应用标识，由平台分配 |
| Timestamp | string | 是 | 时间戳（毫秒级 Unix 时间戳） |
| Nonce | string | 是 | 随机字符串，长度不少于6位 |
| Sign | string | 是 | 签名结果 |

#### 请求头

```http
AppKey: {AppKey}
Timestamp: {Timestamp}
Nonce: {Nonce}
Sign: {Sign}
__tenant: {TenantId}  // 可选，多租户环境下指定租户ID
```

### 签名步骤

#### 1. 准备参数

收集以下参数（**传什么用什么，不做任何处理**）：

- AppKey
- Timestamp
- Nonce
- Body（请求体原始字符串，如有）

#### 2. 构建签名原文

将参数按 **Key 字典升序** 排序，格式为 `key1=value1&key2=value2`，末尾追加 `appSecret`：

```
AppKey={AppKey}&Nonce={Nonce}&Timestamp={Timestamp}&body={Body}&appSecret={AppSecret}
```

::: warning 注意
- 参数名区分大小写
- 参数值原样参与签名，**不做 URL 编码、不做 JSON 处理**
- Body 作为单个参数参与签名，**不解析 JSON 内容**
- 无 Body 时省略 `body` 参数
:::

#### 3. 计算签名

使用 SHA256 对签名原文进行哈希，结果转为大写：

```csharp
using var sha256 = SHA256.Create();
byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(signSource));
string sign = BitConverter.ToString(hashBytes).Replace("-", "").ToUpper();
```

### 签名示例

#### 请求参数

```
AppKey: test_app_key
Timestamp: 1704067200000
Nonce: abc123
Body: {"name":"test","value":123}
AppSecret: test_app_secret
```

#### 签名原文

```
AppKey=test_app_key&Nonce=abc123&Timestamp=1704067200000&body={"name":"test","value":123}&appSecret=test_app_secret
```

#### 签名结果

```
A1B2C3D4E5F6...（64位大写十六进制字符串）
```

### 完整请求示例

#### HTTP 请求

```http
POST /api/open/demo/weather HTTP/1.1
Host: localhost:44317
Content-Type: application/json
AppKey: 3a208a1aa5f2051a67123809cb218444
Timestamp: 1704067200000
Nonce: abc123def456
Sign: A1B2C3D4E5F6...
__tenant: 3a208a1a-a5f2-051a-6712-3809cb218444  // 可选：多租户环境下指定租户ID

{"City":"Beijing"}
```

#### C# 调用示例（HttpClient）

```csharp
using System.Net.Http;
using System.Text;
using System.Text.Json;
using Lion.AbpPro.Core.Security;

var client = new HttpClient();
client.BaseAddress = new Uri("http://localhost:44317");

var timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString();
var nonce = Guid.NewGuid().ToString("N");
var requestBody = JsonSerializer.Serialize(new { City = "Beijing" });

// 生成签名
var sign = SignatureHelper.GenerateOpenPlatformSignature(
    "3a208a1aa5f2051a67123809cb218444",
    timestamp,
    nonce,
    requestBody,
    "3a208a1aa5f22ae29d96de07801f924e"
);

// 设置请求头
client.DefaultRequestHeaders.Add("AppKey", "3a208a1aa5f2051a67123809cb218444");
client.DefaultRequestHeaders.Add("Timestamp", timestamp);
client.DefaultRequestHeaders.Add("Nonce", nonce);
client.DefaultRequestHeaders.Add("Sign", sign);
// client.DefaultRequestHeaders.Add("__tenant", "3a208a1a-a5f2-051a-6712-3809cb218444");  // 可选：多租户环境

// 发送请求（必须使用相同的 body 内容）
var content = new StringContent(requestBody, Encoding.UTF8, "application/json");
var response = await client.PostAsync("/api/open/demo/weather", content);
var result = await response.Content.ReadAsStringAsync();
Console.WriteLine(result);
```

### 响应格式

所有接口返回统一的 JSON 格式：

```json
{
  "success": true,
  "code": "200",
  "message": null,
  "data": { },
  "requestId": "abc123..."
}
```

#### 字段说明

| 字段名 | 类型 | 说明 |
|--------|------|------|
| success | boolean | 请求是否成功（code 为 "200" 时为 true） |
| code | string | 状态码，"200" 表示成功，其他表示失败 |
| message | string | 错误信息，成功时为 null |
| data | object | 业务数据，失败时为 null |
| requestId | string | 请求唯一标识，用于问题排查 |

#### 状态判断规则

- **成功**：`code === "200"`
- **失败**：`code !== "200"`（包括签名错误、业务错误、系统错误等）

#### 成功响应示例

```json
{
  "success": true,
  "code": "200",
  "message": null,
  "data": {
    "city": "Beijing",
    "temperature": 25,
    "weather": "Sunny"
  },
  "requestId": "a1b2c3d4e5f6..."
}
```

#### 失败响应示例（签名错误）

```json
{
  "success": false,
  "code": "1002",
  "message": "签名验证失败",
  "data": null,
  "requestId": "a1b2c3d4e5f6..."
}
```

### 错误码

#### 签名验证错误码

| 错误码 | 说明 |
|--------|------|
| 1001 | Sign 参数缺失 |
| 1002 | 签名验证失败 |
| 1003 | AppKey 缺失或无效 |
| 1004 | Timestamp 无效或过期 |
| 1005 | Nonce 无效（长度少于6位或已使用） |
| 1006 | IP 地址校验失败 |
| 1007 | 租户不存在或已禁用 |

#### 租户说明

- 多租户环境下，通过 `__tenant` 请求头传递租户ID（GUID格式）
- 如果指定的租户不存在或已禁用，返回错误码 `1007`
- 不传递 `__tenant` 时，使用默认租户（如果是单租户模式）

#### 业务错误码

| 错误码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 其他 | 业务特定的错误码 |

### 安全规范

#### 时间戳有效期

- 时间戳与服务器当前时间差值超过 **5 分钟** 视为过期
- 建议客户端在每次请求前获取最新时间戳

#### Nonce 要求

- 长度不少于 **6 位**
- 建议使用随机字符串（如 UUID 前8位）
- 同一 Nonce 在有效期内不能重复使用

#### IP 白名单

- 应用可配置允许访问的 IP 白名单
- 多个 IP 用英文逗号分隔
- 未配置白名单时不限制 IP

## 各语言示例

### C# 示例（使用 Lion.AbpPro.Core）

```csharp
using Lion.AbpPro.Core.Security;
using System.Text.Json;

// 生成签名
string sign = SignatureHelper.GenerateOpenPlatformSignature(
    appKey: "your_app_key",
    timestamp: DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString(),
    nonce: Guid.NewGuid().ToString("N"),
    bodyJson: JsonSerializer.Serialize(new { City = "Beijing" }),
    appSecret: "your_app_secret"
);
```

### C# 示例（原生实现）

```csharp
using System;
using System.Security.Cryptography;
using System.Text;
using System.Collections.Generic;
using System.Linq;

public class OpenPlatformSignature
{
    /// <summary>
    /// 生成签名
    /// </summary>
    public static string GenerateSignature(
        string appKey,
        string timestamp,
        string nonce,
        string body,
        string appSecret)
    {
        // 1. 收集参数
        var paramDict = new Dictionary<string, string>
        {
            ["AppKey"] = appKey,
            ["Timestamp"] = timestamp,
            ["Nonce"] = nonce
        };

        if (!string.IsNullOrWhiteSpace(body))
        {
            paramDict["body"] = body;
        }

        // 2. 按 Key 字典升序排序
        var sortedParams = paramDict.OrderBy(k => k.Key, StringComparer.OrdinalIgnoreCase);

        // 3. 拼接签名原文
        var signBuilder = new StringBuilder();
        foreach (var kv in sortedParams)
        {
            signBuilder.Append($"{kv.Key}={kv.Value}&");
        }
        signBuilder.Append($"appSecret={appSecret}");

        // 4. SHA256 加密，转大写
        using var sha256 = SHA256.Create();
        byte[] hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(signBuilder.ToString()));
        return BitConverter.ToString(hashBytes).Replace("-", "").ToUpper();
    }
}
```

### Java 示例

```java
import java.security.MessageDigest;
import java.util.*;
import java.util.stream.Collectors;

public class OpenPlatformSignature {

    public static String generateSignature(
            String appKey,
            String timestamp,
            String nonce,
            String body,
            String appSecret) throws Exception {

        // 1. 收集参数
        Map<String, String> params = new HashMap<>();
        params.put("AppKey", appKey);
        params.put("Timestamp", timestamp);
        params.put("Nonce", nonce);

        if (body != null && !body.trim().isEmpty()) {
            params.put("body", body);
        }

        // 2. 按 Key 字典升序排序
        List<String> sortedKeys = params.keySet().stream()
            .sorted(String.CASE_INSENSITIVE_ORDER)
            .collect(Collectors.toList());

        // 3. 拼接签名原文
        StringBuilder signBuilder = new StringBuilder();
        for (int i = 0; i < sortedKeys.size(); i++) {
            String key = sortedKeys.get(i);
            signBuilder.append(key).append("=").append(params.get(key));
            if (i < sortedKeys.size() - 1) {
                signBuilder.append("&");
            }
        }
        signBuilder.append("&appSecret=").append(appSecret);

        // 4. SHA256 加密，转大写
        MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
        byte[] hashBytes = sha256.digest(signBuilder.toString().getBytes("UTF-8"));

        StringBuilder result = new StringBuilder();
        for (byte b : hashBytes) {
            result.append(String.format("%02X", b));
        }

        return result.toString();
    }
}
```

### Python 示例

```python
import hashlib

def generate_signature(app_key, timestamp, nonce, body, app_secret):
    # 1. 收集参数
    params = {
        'AppKey': app_key,
        'Timestamp': timestamp,
        'Nonce': nonce
    }

    if body and body.strip():
        params['body'] = body

    # 2. 按 Key 字典升序排序
    sorted_params = sorted(params.items(), key=lambda x: x[0].lower())

    # 3. 拼接签名原文
    param_str = '&'.join([f"{k}={v}" for k, v in sorted_params])
    sign_source = f"{param_str}&appSecret={app_secret}"

    # 4. SHA256 加密，转大写
    sha256_hash = hashlib.sha256(sign_source.encode('utf-8')).hexdigest()
    return sha256_hash.upper()
```

### JavaScript 示例

```javascript
async function generateSignature(appKey, timestamp, nonce, body, appSecret) {
    // 1. 收集参数
    const params = {
        'AppKey': appKey,
        'Timestamp': timestamp,
        'Nonce': nonce
    };

    if (body && body.trim()) {
        params['body'] = body;
    }

    // 2. 按 Key 字典升序排序
    const sortedKeys = Object.keys(params).sort((a, b) =>
        a.toLowerCase().localeCompare(b.toLowerCase())
    );

    // 3. 拼接签名原文
    const paramStr = sortedKeys.map(key => `${key}=${params[key]}`).join('&');
    const signSource = `${paramStr}&appSecret=${appSecret}`;

    // 4. SHA256 加密，转大写
    const encoder = new TextEncoder();
    const data = encoder.encode(signSource);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return hashHex.toUpperCase();
}
```

## 注意事项

1. **Body 一致性**：签名使用的 Body 必须与请求发送的 Body **完全一致**，包括：
   - JSON 属性顺序
   - 空格和换行
   - 大小写
   - 推荐使用 `StringContent` 发送请求，确保 Body 与签名时一致

2. **Body 处理**：请求体原样参与签名，不做任何解析或格式化

3. **参数排序**：按参数名字典升序排序（不区分大小写）

4. **空值处理**：参数值为空字符串时，仍参与签名（`key=`）

5. **大小写敏感**：签名结果必须为大写十六进制

6. **密钥安全**：`AppSecret` 仅用于服务端签名，不可暴露给客户端

7. **状态判断**：客户端应通过 `code === "200"` 判断请求是否成功，而非 HTTP 状态码
