const px2 = require("postcss-px-to-viewport");
const ppe = require('postcss-preset-env');

module.exports = {
  plugins: [
    ppe, // 用来给不同的浏览器自动添加相应前缀，如-webkit-，-moz-等等
    px2({
      unitToConvert: 'px', // 需要转换的单位，默认为"px"
      viewportWidth: 375, // 视窗的宽度，对应pc设计稿的宽度，一般是750
      // viewportHeight: 1080,// 视窗的高度，对应的是我们设计稿的高度
      unitPrecision: 5, // 单位转换后保留的精度
      propList: [
        // 能转化为vw的属性列表, * 代表所有
        '*'
      ],
      viewportUnit: 'vw', // 希望使用的视口单位
      fontViewportUnit: 'vw', // 字体使用的视口单位
      selectorBlackList: ['#abc', 'ignore', 'tabbar', 'tabbar-item'], // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。cretae
      minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换 小于或等于'1px'不转换为视窗单位
      mediaQuery: false, // 媒体查询里的单位是否需要转换单位
      replace: true, // 是否直接更换属性值，而不添加备用属性
      exclude: /(\/|\\)(node_modules)(\/|\\)/ // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件  exclude:[/DetailBottomBar/,/TabbarItem/]   //包含DetailBottomBar的文件不需要转化

      // landscape: true, // 是否添加根据landscapeWidth 生成的媒体查询条件
      // landscapeUnit: 'rem', // 横屏时使用的单位
      // landscapeWidth: 5120 // 横屏时使用的视窗宽度(横屏的尺寸为938px)

      /**
       * @keyframes 和 media 查询里的px默认时不转化的，设置mediaQuery : true  则媒体查询里的也会转换px
       * @keyframes 可以暂时手动填写vw单位的转化结果
       */
    })
  ].filter(Boolean)
};
