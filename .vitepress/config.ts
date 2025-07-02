import type { ThemeConfig } from "vitepress-theme-mild";
import { defineConfigWithTheme } from "vitepress";
import baseConfig from "vitepress-theme-mild/config";

export default defineConfigWithTheme<ThemeConfig>({
  title: "Abp vNext Pro",
  extends: baseConfig,
  lang: "zh",
  ignoreDeadLinks: true,
  themeConfig: {
    progressBar: {
      speed: 200,
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
      { text: "👉🏻Abp文档", link: "/abp/quick-start/" },
      { text: "👉🏻Vben5文档", link: "/vben5/" },
      {
        text: "演示",
        items: [
          { text: "💻演示Vben5(antd)", link: "http://antd.chengzhi.online/" },
          { text: "💻演示Vben5(ele)", link: "http://ele.chengzhi.online/" },
          { text: "💻演示Vben5(naive)", link: "http://naive.chengzhi.online/" },
          { text: "💻演示Vben2.8", link: "http://182.43.18.151:44318/" },
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
    },
    footer: {
      message: "如有转载或 CV 的请标注本站原文地址",
      copyright:
        'Copyright © 2025 韩跑跑 <a href="https://github.com/WangJunZzz/abp-vnext-pro">WangJunZzz</a>',
    },
  },
});
