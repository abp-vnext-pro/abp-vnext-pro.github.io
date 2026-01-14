# 静默刷新
::: tip 前言

在Web应用中，用户认证 token（如 JWT）通常有有效期限制。为了提升用户体验，避免频繁重新登录，可以通过 refreshToken 机制实现 token 的自动续期。

:::


### 刷新Token
1. 使用axios拦截请求(api-client-config/index.ts)
2. 当接口返回401错误，则发起刷新token请求
```ts
client.instance.interceptors.response.use(
  (response) => {
    response.data = shouldDecryptResponseBody(response);
    return Promise.resolve(response);
  },
  async (error) => {
      .....
      case 401: {
        message = $t('common.mesage401');
        const { config } = error;
        const originalRequest = config;
        if (refreshRetryCount >= MAX_REFRESH_RETRY) {
          // 超过最大重试次数，直接登出
          refreshTokenQueue = [];
          isRefreshing = false;
          refreshRetryCount = 0;
          const authStore = useAuthStore();
          authStore.logout();
          break;
        }
        if (isRefreshing) {
          return new Promise((resolve) => {
            refreshTokenQueue.push((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(client.request(originalRequest));
            });
          });
        } else {
          isRefreshing = true;
          refreshRetryCount++; // 增加重试计数
          try {
            // 通过refreshToken获取新的token
            const newToken = await refreshTokenAsync();
            // 处理队列中的请求
            refreshTokenQueue.forEach((callback) => callback(newToken));
            // 清空队列
            refreshTokenQueue = [];
            return client.request(originalRequest);
          } catch (refreshError) {
            // 如果刷新 token 失败，处理错误（如强制登出或跳转登录页面）
            message = $t('common.mesage401');
            refreshTokenQueue = [];
            const authStore = useAuthStore();
            refreshRetryCount = 0;
            console.error(refreshError);
            authStore.logout();
          } finally {
            isRefreshing = false;
          }
        }
        break;
      }
      ....
  },
);

async function refreshTokenAsync(): Promise<string> {
  try {
    const userStore = useUserStore();
    const accessStore = useAccessStore();
    const refreshToken = accessStore.getRefreshToken();
    if (!refreshToken) return '';
    const res = await postApiAppAccountRefreshToken({
      body: {
        userId: userStore.userInfo?.id,
        refreshToken,
      },
    });
    if (res?.data?.success) {
      accessStore.setAccessToken(res.data.token as string);
      accessStore.setRefreshToken(res.data.refreshToken as string);
      return res.data.token as string;
    } else {
      throw new Error('get refreshToken error');
    }
  } catch {
    throw new Error($t('common.mesage401'));
  }
}

export default client;

```

### 刷新角色

::: tip 前言

在Web应用中，用户角色和权限变更。为了提升用户体验，避免频繁重新登录，可以通过刷新角色机制实现角色的自动续期。

:::

#### 启用
在env.ts中添加以下配置：
```ts
# 是否打开刷新浏览器检查用户角色信息
VITE_REFRESH_ROLE = true
```

#### 代码
```ts
async function setupRefresh(router: Router) {
  // 使用 performance API 检测页面是否是刷新加载
  const navigationEntries = performance.getEntriesByType('navigation');
  if (navigationEntries.length > 0) {
    const navigationType = (navigationEntries[0] as PerformanceNavigationTiming)
      .type;
    if (navigationType === 'reload') {
      // todo 浏览器刷新事件，可以在这里做一些数据初始化操作
      router.isReady().then(async () => {
        if (import.meta.env.VITE_REFRESH_ROLE) {
          const authStore = useAuthStore();
          await authStore.getApplicationConfiguration();
        }
      });
    }
  }
}
```