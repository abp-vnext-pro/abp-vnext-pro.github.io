import MildTheme from 'vitepress-theme-mild'


export default {
    extends: MildTheme,
    enhanceApp({ app, router }) {
        // 单页面应用路由更新时触发百度统计事件
        router.onBeforeRouteChange = (to) => {
            if (typeof _hmt !== 'undefined') {
                _hmt.push(['_trackPageview', to]);
            }
        };
    },
};
