import type { DefaultTheme } from 'vitepress'

export const nav: DefaultTheme.Config['nav'] = [
  // { text: '快速导航', link: '/nav/' },
  { text: '👉🏻Abp文档', link: '/guide/quick-start' },
  { text: '👉🏻Vben5文档', link: '/vben5/quick-start' },
  { text: '演示', items: [
    { text: '💻演示Vben5(antd)', link: 'http://182.43.18.151:44320/' },
    { text: '💻演示Vben5(ele)', link: 'http://182.43.18.151:44321/' },
    { text: '💻演示Vben28', link: 'http://182.43.18.151:44318/' },
  ]},
  { text: '⭐购买Vben5', link: '/about/buy' },
  { text: '✨赞助', link: '/about/donate' },
  { text: '👨‍👦‍👦社区', link: '/about/community' },
  { text: '🦄定制开发', link: '/about/dev' },
]
