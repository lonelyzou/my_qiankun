// hash模式： window.onhashchange
// history模式：
    // 1.history.go、history.back、history.popstate事件（浏览器前进后退）：监听window.onpopstate事件
    // 2.pushState、replaceState（路由地址切换） 需要通过函数重写的方式进行劫持
import { handleRouter } from './handle-router'

let prevRoute = '' // 上一个路由
let nextRoute = window.location.pathname // 下一个路由

export const getPrevRoute = () => prevRoute
export const getNextRoute = () => nextRoute

export const rewriteRouter = () => {
  window.addEventListener('popstate', ()=>{
    // 这里路由已经完成导航
    prevRoute = nextRoute // 这是之前的
    nextRoute = window.location.pathname // 这是最新的
    handleRouter()
  })
  const rawPushState = window.history.pushState // 保存一份原生方法 （路由跳转）
  window.history.pushState = (...arg) => {
    //导航前
    prevRoute  = window.location.pathname

    rawPushState.apply(window.history, arg) // 这里开始真正的改变历史记录

    //导航后
    nextRoute = window.location.pathname
    handleRouter()
  }
  const rawReplaceState = window.history.replaceState // 保存一份原生方法 (路由替换)
  window.history.replaceState = (...arg) => {
    prevRoute  = window.location.pathname
    rawReplaceState.apply(window.history, arg)
    nextRoute = window.location.pathname
    handleRouter()
  }
}