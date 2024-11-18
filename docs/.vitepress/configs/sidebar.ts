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
            //   {
            //     link: 'about',
            //     text: '关于ABP VNext Pro',
            //   },
            //   {
            //     link: 'wyh',
            //     text: '为什么选择我们?',
            //   },
              { link: 'quick-start', text: '快速开始' },
            ],
          },
          {
            collapsed: false,
            text: '基础',
            items: [
              {
                link: 'basic/authorization',
                text: '权限',
              }
            ],
          },
          {
            collapsed: false,
            text: '模块',
            items: [
              {
                link: 'modules/basic',
                text: '基础模块',
              },
              {
                link: 'modules/dic',
                text: '数据字典模块',
              },
              {
                link: 'modules/signalr',
                text: '通知模块',
              },
              {
                link: 'modules/language',
                text: '语言模块',
              },
            ],
          },
    ]
}