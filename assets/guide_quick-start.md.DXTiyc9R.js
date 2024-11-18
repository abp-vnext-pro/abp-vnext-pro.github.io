import{_ as a,o as i,c as n,a7 as e}from"./chunks/framework.DMw2CTIw.js";const o=JSON.parse('{"title":"快速开始","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"guide/quick-start.md","filePath":"guide/quick-start.md","lastUpdated":1731913026000}'),l={name:"guide/quick-start.md"};function p(t,s,h,r,d,k){return i(),n("div",null,s[0]||(s[0]=[e(`<h1 id="quick-start" tabindex="-1">快速开始 <a class="header-anchor" href="#quick-start" aria-label="Permalink to &quot;快速开始 {#quick-start}&quot;">​</a></h1><h2 id="前置准备" tabindex="-1">前置准备 <a class="header-anchor" href="#前置准备" aria-label="Permalink to &quot;前置准备&quot;">​</a></h2><div class="info custom-block"><p class="custom-block-title">环境要求</p><p>在启动项目前，你需要确保你的环境满足以下要求：</p><ul><li><a href="https://nodejs.org/en" target="_blank" rel="noreferrer">Node.js</a> 20.15.0 及以上版本，推荐使用 <a href="https://github.com/Schniz/fnm" target="_blank" rel="noreferrer">fnm</a> 、 <a href="https://github.com/nvm-sh/nvm" target="_blank" rel="noreferrer">nvm</a> 或者直接使用<a href="https://pnpm.io/cli/env" target="_blank" rel="noreferrer">pnpm</a> 进行版本管理。</li><li><a href="https://git-scm.com/" target="_blank" rel="noreferrer">Git</a> 任意版本。</li></ul><p>验证你的环境是否满足以上要求，你可以通过以下命令查看版本：</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 出现相应 node LTS版本即可</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">node</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -v</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 出现相应 git 版本即可</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;"> -v</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br></div></div></div><h2 id="启动项目" tabindex="-1">启动项目 <a class="header-anchor" href="#启动项目" aria-label="Permalink to &quot;启动项目&quot;">​</a></h2><h3 id="获取源码" tabindex="-1">获取源码 <a class="header-anchor" href="#获取源码" aria-label="Permalink to &quot;获取源码&quot;">​</a></h3><div class="vp-code-group vp-adaptive-theme"><div class="tabs"><input type="radio" name="group-ynvrQ" id="tab-_4U0h3K" checked><label data-title="GitHub" for="tab-_4U0h3K">GitHub</label><input type="radio" name="group-ynvrQ" id="tab-fw4I_wC"><label data-title="Gitee" for="tab-fw4I_wC">Gitee</label></div><div class="blocks"><div class="language-sh vp-adaptive-theme active line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># clone 代码</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> clone</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://github.com/vbenjs/vue-vben-admin.git</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><div class="language-sh vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">sh</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># clone 代码</span></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># Gitee 的代码可能不是最新的</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">git</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> clone</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> https://gitee.com/annsion/vue-vben-admin.git</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div></div></div><div class="danger custom-block"><p class="custom-block-title">注意</p><p>注意存放代码的目录及所有父级目录不能存在中文、韩文、日文以及空格，否则安装依赖后启动会出错。</p></div><h3 id="安装依赖" tabindex="-1">安装依赖 <a class="header-anchor" href="#安装依赖" aria-label="Permalink to &quot;安装依赖&quot;">​</a></h3><p>在你的代码目录内打开终端，并执行以下命令:</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 进入项目目录</span></span>
<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">cd</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> vue-vben-admin</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 使用项目指定的pnpm版本进行依赖安装</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">corepack</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> enable</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 安装依赖</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> install</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><div class="tip custom-block"><p class="custom-block-title">注意</p><ul><li>项目只支持使用 <code>pnpm</code> 进行依赖安装，默认会使用 <code>corepack</code> 来安装指定版本的 <code>pnpm</code>。:</li><li>如果你的网络环境无法访问npm源，你可以设置系统的环境变量<code>COREPACK_REGISTRY=https://registry.npmmirror.com</code>，然后再执行<code>pnpm install</code>。</li><li>如果你不想使用<code>corepack</code>，你需要禁用<code>corepack</code>，然后使用你自己的<code>pnpm</code>进行安装。</li></ul></div><h3 id="运行项目" tabindex="-1">运行项目 <a class="header-anchor" href="#运行项目" aria-label="Permalink to &quot;运行项目&quot;">​</a></h3><h4 id="选择项目" tabindex="-1">选择项目 <a class="header-anchor" href="#选择项目" aria-label="Permalink to &quot;选择项目&quot;">​</a></h4><p>执行以下命令运行项目:</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6A737D;--shiki-dark:#6A737D;"># 启动项目</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br></div></div><p>此时，你会看到类似如下的输出，选择你需要运行的项目：</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">│</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">◆</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  Select</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> the</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> app</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> you</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> need</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> to</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;"> [dev]:</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">│</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  ○</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @vben/web-antd</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">│</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  ○</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @vben/web-ele</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">│</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  ○</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @vben/web-naive</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">│</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  ○</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @vben/docs</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">│</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;">  ●</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> @vben/playground</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">└</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br></div></div><p>现在，你可以在浏览器访问 <code>http://localhost:5555</code> 查看项目。</p><h4 id="运行指定项目" tabindex="-1">运行指定项目 <a class="header-anchor" href="#运行指定项目" aria-label="Permalink to &quot;运行指定项目&quot;">​</a></h4><p>如果你不想选择项目，可以直接运行以下命令运行你需要的应用：</p><div class="language-bash vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">bash</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev:antd</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev:ele</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev:naive</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev:docs</span></span>
<span class="line"><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0;">pnpm</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> run</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF;"> dev:play</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br></div></div>`,21)]))}const b=a(l,[["render",p]]);export{o as __pageData,b as default};
