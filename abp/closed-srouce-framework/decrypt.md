# 接口加解密
::: tip 注意
- 当前模块需要付费使用,需要找作者购买源码(购买vben5版本即可)
- 联系方式: 510423039@qq.com
- 微信号：WJLXRzzZ
:::

- 数据在公网或内部网络传输时，可能被攻击者通过嗅探工具（如 Wireshark）截获。若以明文形式传输，用户隐私信息（手机号、身份证号）、金融数据（银行卡信息、交易金额）、业务核心数据（订单状态、权限令牌）等敏感内容可能直接泄露，导致账号盗用、财产损失或商业机密外泄。
- 攻击者可能在通信链路中伪装成 “合法节点”，拦截、篡改或伪造数据。
- 数据完整性与真实性的挑战，传输过程中，数据可能因网络波动或恶意篡改出现失真（如订单金额被从 1000 元改为 100 元）。若系统未对数据真实性进行校验，可能导致业务决策错误（如按篡改后的金额发货）。
- 多个行业的法律法规明确规定，敏感数据的传输必须采用加密等安全措施。未满足合规要求的系统可能面临行政处罚、业务暂停或法律诉讼。
- 尽管 HTTPS 等传输层协议提供了通道加密，但存在证书配置错误、内部网络未覆盖、数据在日志 / 内存中明文存储等风险，无法完全保障数据全链路安全。

### 请求参数加密
#### AES+RSA
- 加密流程
1. 客户端发起请求时，客户端使用随机生成的AES密钥对数据进行加密
2. 使用服务器的**公钥**对**AES**密钥进行加密
3. 将加密后的数据和AES密钥 作为请求数据发送至服务器。
4. 服务器收到请求后，使用服务器的**私钥**对加密过的AES密钥进行解密
5. 再使用获取到的AES密钥对加密的数据进行解密。
6. 以此保证客户端发送的数据只能被服务器解密进行处理。

### 响应参数加密

#### AES

1. 服务器处理完数据后，将响应数据先使用随机生成(新)的AES密钥进行加密
2. 然后将加密后的数据作为响应数据返回给客户端。
3. 客户端收到响应数据后，使用AES密钥进行解密

::: tip 注意
- 响应参数没有使用RSA加密,因为不想把RSA密钥暴露给客户端,所以只做了简单的AES加密,每次请求时都生成新的AES密钥。
- 如果大家有好的方式请提issue
:::

## 如何开启

1. 添加中间件**注意顺序**
```csharp
.....
app.UseAbpProRequestLocalization();
app.UseCorrelationId();

// 添加加解密中间件，注意顺序
app.UseRequestResponseEncrypt();

app.UseRouting();
app.UseCors(AbpProHttpApiHostConst.DefaultCorsPolicyName);
app.UseAuthentication();

......
```
2. 修改appsetting.json
```json
 "Encryption": {
    "Enabled": true,
    "PublicKey": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt20DDR8PFSq/3Xn3gUzH\nCF/nBhqxCFPNjx4SEhyfuV4V3KSkYGXeX+ciftmoLmSC79li0r999CxunMjFC0tK\nRVt7Pp95qvbUqqdI2TpyA0aQFLhvzQrV//iHXehOUUU1IZm3LmO5Kn9QZg6+KAgt\nUBa05bd3hmkdRb0/zOejvF1BTm1eIOeDHNzc1zeVX4Likcn0yIvvsGYm0wQx8NP6\nwzKYMAF0rFSnS3zz1OmgSaCTweS/K3NQRm8bumPbKDWEHcCJyesgocz+Nm+U/EYE\n0AlV7viL4/pZvKvr/CCH3nMeH2vn6sGOUcC6mePfFw0f0WLkivZQc7YxSB2ztaoD\nlQIDAQAB\n-----END PUBLIC KEY-----",
    "PrivateKey": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC3bQMNHw8VKr/d\nefeBTMcIX+cGGrEIU82PHhISHJ+5XhXcpKRgZd5f5yJ+2aguZILv2WLSv330LG6c\nyMULS0pFW3s+n3mq9tSqp0jZOnIDRpAUuG/NCtX/+Idd6E5RRTUhmbcuY7kqf1Bm\nDr4oCC1QFrTlt3eGaR1FvT/M56O8XUFObV4g54Mc3NzXN5VfguKRyfTIi++wZibT\nBDHw0/rDMpgwAXSsVKdLfPPU6aBJoJPB5L8rc1BGbxu6Y9soNYQdwInJ6yChzP42\nb5T8RgTQCVXu+Ivj+lm8q+v8IIfecx4fa+fqwY5RwLqZ498XDR/RYuSK9lBztjFI\nHbO1qgOVAgMBAAECggEANt4xD3e+90H2arXVR6RD1Ul6veS2GBuZXbpNBYXycWyn\ndXz6fqt6PY3ST8ej+1ytnjmUyh3l+2hfHh8gciRvbxfSYgUqS+3R58pqjDBjcn9l\nEg2pw9f987fQJlMbOkxNfGOS3BmQhhnXXvACCc+IXnCsZBrhch93VikqMI0J+YoZ\n+Fh6NNSA6AhxbSsl39fNTBU5As0OU8NikXSAQl+eqDVQTTfZpBQJ48RsVOEL1Z2J\nHfdk5XWlRXpVUVyzdsjcJpyqqZERhKxXUY2X/QiJ3VjE8gSCc1/G7wFFSKWYy2Xj\nnJBfU6wfO6IvFoyE/Nv6zSSmiUaOVhgxzK+4D0sw8QKBgQDOiGVHirQ2vRv+EdlQ\nIXuWr939Hux0hEJf/OPYacZFEUdXg9Uqokj3T71sbz+GTq2eBV5YH4unb/afgZzb\nkqIuaPAg9pzhvJ3rz8Rtf/sSYApon6pBnWVFbIKg7AOWM2HqaYVwlafKa1ju52KH\nrYX9FN8lTiXN7CDj198qHEViowKBgQDjW86zo1P5a0eQMIufTqtZaaVHvMQVJfQp\nLrpQWVmlFjWF5u8+Brujjd6OA4zyCd7DBgMMW1HrqCTfu2OImfV/L+tl3wJ3O7Yz\ns6Zhe8N3PpmdaEE5uA7pZHpOA+elcgtqu8AuDBWZzWtChUaIIPY+CkxvZgNWv7O0\nRrK/ugycZwKBgQCNtjkIJbwR8yBJ7KVXviG2+2UuURGdwUJp6nPMAofwzDJPcj3J\nyyCV0TkANjU4SrQGQVjCzqJceQ6X0691Wd++SHK7q3tpyKnzK9Rz7eSwbwW1VBjW\nfNEIGbRoBolPfmIpHc5ZudYvpgiXpFyPDBlr1e5nAoAeE29d5rlRg6R4UQKBgQCP\nXd8T69QSHZH83H/Orx7hvPqaJ/BFna8/INYfwJgEv+J0U1FdfYVo9xb12ktQfOTZ\nebsGWbdosJi/9DwpcVwbHa6EiIHXifG03H34TsDNOs5HMeyfZu8QQWnWNCQocae9\nYDMpVjlwyNXwFnaJdK+SI5BbVqqYUz4QWdxxhfJZ1QKBgQC0dBiSR9N5TPmWDW2o\nTPYGLVrKKUXE7k21zXSaxkiCIwy7FCB3ECUKms1XbRKXHUorZJn2c04D5w51NR8k\ngNuYCpM5XH1AHGTWuD5q6SXUnTZJPM3RcyzfVBte8PgphhTiQaV5v/wJOueeNAO2\nX1Bq484VdGSmJYhzGqtUW0Fcfg==\n-----END PRIVATE KEY-----"
  }
```
3. 如何生成公钥和私钥
RSAHelper.GenerateKeys

## 注意
- 所有接口的加密和解密只针对**Post**请求
- 如果想要忽略某个接口的加密和解密，可以使用GET,PUT,DELETE请求
- 比如现有vben5版本中,上传文件的接口,和下载接口都从原来的POST改为PUT了。
