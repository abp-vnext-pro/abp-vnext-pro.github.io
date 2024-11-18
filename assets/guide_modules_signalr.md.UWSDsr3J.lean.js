import{_ as a,o as t,c as e,a7 as n}from"./chunks/framework.BajU-dnf.js";const u=JSON.parse('{"title":"实时通信","description":"","frontmatter":{},"headers":[],"relativePath":"guide/modules/signalr.md","filePath":"guide/modules/signalr.md","lastUpdated":1731923597000}'),o={name:"guide/modules/signalr.md"};function l(r,i,p,s,d,c){return t(),e("div",null,i[0]||(i[0]=[n('<h1 id="实时通信" tabindex="-1">实时通信 <a class="header-anchor" href="#实时通信" aria-label="Permalink to &quot;实时通信&quot;">​</a></h1><p>集成 Abp SignalR,实现类似站内信模块。</p><ul><li><p>发送消息会在前端右上角，根据不同消息等级有不同的窗体提示。</p></li><li><p>在右上角灯泡按钮可以看到接受的消息。</p></li></ul><h2 id="安装" tabindex="-1">安装 <a class="header-anchor" href="#安装" aria-label="Permalink to &quot;安装&quot;">​</a></h2><ul><li>Lion.Abp.NotificationManagement.Application</li><li>Lion.Abp.NotificationManagement.Application.Contracts</li><li>Lion.Abp.NotificationManagement.Domain</li><li>Lion.Abp.NotificationManagement.Domain.Shared</li><li>Lion.Abp.NotificationManagement.EntityFrameworkCore</li><li>Lion.Abp.NotificationManagement.HttpApi</li><li>Lion.Abp.NotificationManagement.HttpApi.Client</li></ul><h2 id="模块依赖" tabindex="-1">模块依赖 <a class="header-anchor" href="#模块依赖" aria-label="Permalink to &quot;模块依赖&quot;">​</a></h2><ul><li><p>添加 DependsOn(typeof(NotificationManagementXxxModule)) 特性到对应模块。</p></li><li><p>在 EntityFrameworkCore 层添加数据库配置在 AbpProDbContext.cs 的 OnModelCreating()方法中添加 builder.ConfigureNotificationManagement();</p></li></ul>',7)]))}const f=a(o,[["render",l]]);export{u as __pageData,f as default};
