import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Config['sidebar'] = {
  '/guide/': { base: '/guide/', items: sidebarGuide() },
  '/vben5/': { base: '/vben5/', items: sidebarVben5() },
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
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
        { link: 'quick-dev', text: '快速开发' },
        { link: 'quick-ddd', text: '领域驱动设计' },
      ],
    },
    {
      collapsed: false,
      text: '基础',
      items: [
        {
          link: 'basic/login',
          text: '登录',
        },
        {
          link: 'basic/authorization',
          text: '权限',
        },
        {
          link: 'basic/log',
          text: '日志',
        },
        {
          link: 'basic/cors',
          text: '跨域',
        },

        {
          link: 'basic/cache',
          text: '缓存',
        },
        {
          link: 'basic/setting',
          text: '设置管理',
        },

        {
          link: 'basic/event-bus-local',
          text: '本地事件',
        },
        {
          link: 'basic/cap',
          text: '分布式事件',
        },
        {
          link: 'basic/datafiltering',
          text: 'EF数据过滤',
        },
        {
          link: 'basic/dataseeding',
          text: '种子数据',
        },
        {
          link: 'basic/distributed-locking',
          text: '分布式锁',
        },
        {
          link: 'basic/switchdatatabse',
          text: '切换数据库',
        },
        {
          link: 'basic/entity-extensions',
          text: '扩展字段',
        },
        {
          link: 'basic/job',
          text: '后台任务',
        },
        {
          link: 'basic/autoapi',
          text: '自动API控制器',
        },
        {
          link: 'basic/csharpclientproxy',
          text: 'C#API代理',
        },
        {
          link: 'basic/twofactor',
          text: '双因素验证⭐',
        },
        {
          link: 'basic/thridpartylogin',
          text: '第三方登录⭐',
        },
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
          link: 'modules/notification',
          text: '消息模块',
        },
        {
          link: 'modules/language',
          text: '语言模块',
        },
        {
          link: 'modules/code',
          text: '代码生成器模块⭐',
        },
      ],
    },
    {
      collapsed: false,
      text: '扩展',
      items: [
        {
          link: 'basic/batch',
          text: 'EF批量操作',
        },
        {
          link: 'basic/freesql',
          text: 'FreeSql',
        },
        {
          link: 'basic/result',
          text: '接口响应格式统一',
        },
        {
          link: 'basic/export',
          text: '导出',
        },
        {
          link: 'basic/elastic',
          text: 'Elastic',
        },
        {
          link: 'basic/web-apiclient-core',
          text: 'WebApiClient',
        },
      ],
    },
    {
      collapsed: false,
      text: '部署',
      items: [{ link: 'deploy/docker', text: 'Docker部署' }],
    },
  
  ]
}
function sidebarVben5(): DefaultTheme.SidebarItem[] {
  return [
    {
      collapsed: false,
      text: '开发',
      items: [
        { link: 'quick-start', text: '本地开发' },
        { link: 'thin', text: '精简版本' },
        { link: 'route', text: '菜单和路由' },
        { link: 'faq', text: '常见问题' },
        { link: 'check-updates', text: '检查更新' },
      ],
    },
    {
      collapsed: false,
      text: '部署',
      items: [
        { link: 'deploy', text: '部署' },
        { link: 'iis', text: 'IIS部署' },
      ],
    },
    {
      collapsed: false,
      text: '其它',
      items: [{ link: 'update', text: '更新' }],
    },
  ]
}
