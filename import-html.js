import { fetchResource } from './fetch-resource'
export const importHTML = (url) => {
  const html = await fetchResource(url) // 拿到html资源
  // template:
  const template = document.createElement('div')
  template.innerHTML = html //转成dom, 然后基于dom进行操作，比如拿到所有 script 标签

  // 获取所有 script 标签的代码：数组
  const scripts = template.querySelectorAll('script')
  function getExternalScript () {
    return Promise.all(Array.from(scripts).map(script => {
      // 得到src
      const src = script.getAttribute('src')
      if(!src) {
        //直接在html文件写js的，不是引用的外部js文件
        return Promise.resolve(script.innerHTML)
      } else {
        // 外链的src
        return fetchResource(
          // 没有域名的js文件加上http前缀和域名
          src.startsWith('http') ? src : `${url}${src}`
        )
      }
    }))
  }
  // 获取并执行所有的 script 代码
  async function execScript () {
    const scripts = await getExternalScript()

    // 手动构造一个 CommonJs 模块环境
    const module = { exports: {} }
    const exports = module.exports

    scripts.forEach(code => {
      // eval执行的代码可以访问外部变量
      eval(code)
    })
    return module.exports
  }

  return {
    template,
    getExternalScript,
    execScript
  }
}