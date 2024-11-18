import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = {
    '/guide/':{ base: '/guide/', items:[
        { text: '快速开始', link: 'quick-start' }  
    ]}
}
