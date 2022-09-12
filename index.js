import { rewriteRouter } from './rewrite-router'
import { handleRouter } from './handle-router'
let _apps = []

export const getApps = () => _apps;

export const registerMicroApps = (apps) => {
  _apps = apps
}

export const start = () => {
  // 微前端运行原理：
  // 1.监视路由变化
  rewriteRouter()

  // 初始时匹配路由
  handleRouter()

  // 2.匹配子应用
  // 3.加载子应用
 //  4.渲染子应用

}