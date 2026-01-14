---
sidebar:
  sort: 2
---

# 快速开发

## 定义后端接口
::: danger 注意
- 接口建议全部采用 Post 方式。
- 接口参数全部用一个对象包装。
- 接口迁移全部打上swagger的tag标签
:::
* 假设我们写了一个登录接口
```csharp
// 一定要打Tags，因为前端会根据这个生成代理类
// 建议参数都封装为一个Input
[SwaggerOperation(summary: "登录", Tags = new[] {"Account"})]
public Task<LoginOutput> LoginAsync(LoginInput input)
{
    return _loginAppService.LoginAsync(input);
}
```
## 前端如何快速开发?
### vben2.8
- 查看配置的swagger地址是否正确
- nswag->nswag.json
```json
  "documentGenerator": {
    "fromDocument": {
      // 代理地址，只有生成的时候用，不区分环境
      "url": "http://localhost:44315/swagger/v1/swagger.json",
    }
  }
```
- 如果新建接口或者参数或者返回值有改变，需要重新生成代理，执行:
```bash
npm run nswag
```
#### 调用接口
```ts
// 我们在接口上打了Account标签,就引入AccountServiceProxy类
import { AccountServiceProxy,LoginInput,LoginOutput } from '/@/services/ServiceProxies';

/**
 * 登录
 * @param input
 * @returns
 */
export function login(input: LoginInput): Promise<LoginOutput> {
  const _loginServiceProxy = new AccountServiceProxy();
  return _loginServiceProxy.login(input);
}
```
### vben5
- 查看配置的swagger地址是否正确
- src->api-client-config.config.ts
```ts
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  client: '@hey-api/client-axios',
  // 代理地址，只有生成的时候用，不区分环境
  input: 'http://182.43.18.151:44317/swagger/AbpPro/swagger.json',
  output: 'src/api-client',
});
```
- 如果新建接口或者参数或者返回值有改变，需要重新生成代理，执行:
```bash
# 根据我们选中的框架，进入到对应的apps下面，如果选中的是antd版本
cd apps/web-antd
npm run nswag
```
#### 调用接口
```ts
// vben5的和vben2.8生成的接口名有区别
import {postApiAppAccountLogin} from '#/api-client';

const { data = {} } = await postApiAppAccountLogin({
     body: {
       // 登录参数
     },
   });
```
::: danger 注意
后端如果有新增接口,前端想要调用,一定要执行npm run nswag命令,前端才能看到这个新增接口。
:::

::: info over
- 这样我们就通过前端代码生成api的方式，调用后端接口了。
:::