;(function aa (root, factory) {
  // root => window
  // factory => function() { // 子应用代码 return { ...} // 导出结果}

  // commonJs规范
  if(typeof exports === "object" && typeof module === "object") {
    module.exports = factory()
  }
  // AMD模块规范

  // window['xxx'] = factory()
})(window, function () {

})