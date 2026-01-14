import type { ThemeConfig } from "vitepress-theme-mild";
import { defineConfigWithTheme } from "vitepress";
import baseConfig from "vitepress-theme-mild/config";

export default defineConfigWithTheme<ThemeConfig>({
  title: "Abp vNext Pro",
  extends: baseConfig,
  lang: "zh",
  ignoreDeadLinks: true,
  /* markdown 配置 */
  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true,
    },
  },
  themeConfig: {
    progressBar: {
      speed: 200,
    },
    /* 右侧大纲配置 */
    outline: {
      level: 'deep',
      label: '目录',
    },
    logo: "/logo.png",
    search: {
      provider: "local",
      options: {
        detailedView: true,
        translations: {
          button: {
            buttonText: "搜索一下",
          },
        },
      },
    },
    nav: [
      { text: "👉🏻AbpPro文档", link: "/abp/quick-start/" },
      { text: "👉🏻Vben5文档", link: "/vben5/" },
      { text: "👉🏻Abp源码分析", link: "/abp-source/" },
      {
        text: "演示",
        items: [
          { text: "💻演示Vben5(antd)", link: "http://antd.chengzhi.online/" },
          { text: "💻演示Vben5(ele)", link: "http://ele.chengzhi.online/" },
          { text: "💻演示Vben5(naive)", link: "http://naive.chengzhi.online/" },
          { text: "💻演示Vben2.8", link: "http://vben28.chengzhi.online/" },
        ],
      },
      { text: "⭐购买Vben5", link: "/about/buy" },
      { text: "✨赞助", link: "/about/donate" },
      { text: "👨‍👦‍👦社区", link: "/about/community" },
      { text: "🦄定制开发", link: "/about/dev" },
    ],
    socialLinks: [
      { icon: "github", link: "https://github.com/WangJunZzz/abp-vnext-pro" },
    ],
    sidebar: {
      "/abp/": "auto",
      "/vben5/": "auto",
      "/abp-source/": "auto",
    },
    footer: {
      message: "如有转载或 CV 的请标注本站原文地址",
      copyright:
        'Copyright © 2025 韩跑跑 <a href="https://github.com/WangJunZzz/abp-vnext-pro">WangJunZzz</a>',
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇',
    },
    
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
  },
});
