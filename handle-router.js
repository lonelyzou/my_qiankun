// 处理路由变化 （路由变化时调用）
import { getApps } from './index'
import importHTML from './import-html'
import { getPrevRoute, getNextRoute } from './rewrite-router';

export const handleRouter = async () => {
  const apps = getApps();

  // 卸载上一个应用
  // 获取上一个路由应用
  const prevApp = apps.find(i => {
    return getPrevRoute().startsWith(i.activeRule)
  })
  // 如果有上一个应用先销毁
  if (prevApp) {
    await unmount(prevApp)
  }
  // 2. 匹配子应用
  // 2.1 获取当前路由路径
  const pathname = window.location.pathname
  // 2.2 去主应用定义的apps(路由列表)里查找
  // 获取下一个路由应用
  const app = apps.find(i => getNextRoute().startsWith(i.activeRule)) // startsWith:以xx开头的


  if (!app) {
    return
  }
  // 3. 加载子应用
    //请求获取子应用的资源： html,css,js
  // const html = fetch(app.entry).then(res => res.text) //获取到请求中的文本
  // const container = document.querySelector(app.container)// 要渲染到哪个dom
  // 1.客户端渲染需要通过执行js来生成内容
  // 2. 浏览器基于安全考虑，innerHTML中的 script代码 不会加载执行，所以需要我们手动执行
  // container.innerHTML = html

  // 手动加载子应用的script（字符串形式的代码）
  // 执行 script 代码 ，eval或者new Function


  // 3. 加载子应用
  const container = document.querySelector(app.container)
  const { template, getExternalScript, execScript } = await importHtml(app.entry)
  container.appendChild(template)
  // 配置全局变量，判断是不是由乾坤加载子应用,还是独立运行
  window._POWERED_BY_QIANKUN_ = true
  window._INJECTED_PUBLIC_PATH_BY_QIANKUN_ = app.entry
  const appExecScript = execScript()
  app.bootstrap = appExecScript.bootstrap
  app.mount = appExecScript.mount
  app.unmount = appExecScript.unmount

  await bootstrap(app)
  await mount(app)

  // 4. 渲染子应用
}

async function bootstrap (app) {
  app.bootstrap && (await app.bootstrap());
}
async function mount (app) {
  app.mount && (await app.mount({
    container: document.querySelector(app.container)
  }));
}
async function unmount (app) {
  app.unmount && (await app.unmount({
    container: document.querySelector(app.container)
  }));
}