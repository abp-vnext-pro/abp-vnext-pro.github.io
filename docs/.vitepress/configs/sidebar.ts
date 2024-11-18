import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = {
    '/guide/':{ base: '/guide/', items:sidebarGuide()}
}


function sidebarGuide(): DefaultTheme.SidebarItem[]{
    return [
        {
            collapsed: false,
            text: '简介',
            items: [
              {
                link: 'about',
                text: '关于ABP VNext Pro',
              },
              {
                link: 'wyh',
                text: '为什么选择我们?',
              },
              { link: 'quick-start', text: '快速开始' },
            ],
          },
          {
            collapsed: false,
            text: '基础',
            items: [
              {
                link: 'about',
                text: '关于ABP VNext 11Pro',
              },
              {
                link: 'wyh',
                text: '为什么选择我们111?',
              },
              { link: 'quick-start', text: '快速开始' },
            ],
          },
    ]
}