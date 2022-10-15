const path = require('path');
const webpack = require('webpack');
// ( 内部自动安装 less less-loader 相关依赖 )
// 单独配置babel无效，需要和craco-less 一起样式才有效果
// const CracoLess = require("craco-less");
const CracoAntDesignPlugin = require('craco-antd');

const addPath = dir => path.join(__dirname, dir);

const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isPro = dev => dev === 'production';

module.exports = {
  webpack: {
    alias: {
      '@': addPath('src')
      // '@assets': addPath('src/assets'),
      // '@common': addPath('src/common'),
      // '@components': addPath('src/components'),
      // '@hooks': addPath('src/hooks'),
      // '@pages': addPath('src/pages'),
      // '@store': addPath('src/store'),
      // '@utils': addPath('src/utils')
    },
    // 配置cdn外部资源不打包
    // externals: {
    //   echarts: "echarts",
    // },
    configure: (webpackConfig, { env, paths }) => {
      // 打包分析 弹出打包分析页面
      if (isPro(env)) {
        webpackConfig.plugins.push(new BundleAnalyzerPlugin());
      }
      // 指定moment打包的语言
      webpackConfig.plugins.push(
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/)
      );

      webpackConfig.devtool = isPro(env)
        ? 'source-map'
        : 'cheap-module-source-map';
      webpackConfig.optimization.splitChunks = {
        chunks: 'all', // async all
        // minSize: 40000,
        // maxAsyncRequests: 5, // 最大异步请求数
        // maxInitialRequests: 4, // 页面初始化最大异步请求数
        // automaticNameDelimiter: '~', // 解决命名冲突
        // name: true, // 值将会自动根据切割之前的代码块和缓存组键值(key)自动分配命名,否则就需要传入一个String或者function.
        // name: false,
        cacheGroups: {
          // react react-dom react-router-dom 一起打包
          react: {
            test: /[\\/]node_modules[\\/]react(.*)?[\\/]/,
            name: 'chunk-react',
            priority: 40 // 权重 优先级
          },
          // antd单独打包
          antd: {
            test: /[\\/]node_modules[\\/]antd[\\/]/,
            name: 'chunk-antd',
            priority: 30
          },
          lodash: {
            name: 'chunk-lodash',
            test: /[\\/]node_modules[\\/](lodash|day|moment|immutable\/dist|rc-calendar\/es|braft-finder\/dist|rc-tree\/es)[\\/]/,
            priority: -10
          },
          echarts: {
            name: 'chunk-echarts',
            test: /[\\/]node_modules[\\/]echarts[\\/]/,
            priority: -12
          },
          common: {
            name: 'chunk-common',
            test: /[\\/]node_modules[\\/](redux-saga|dva|draft-js\/lib|core-js|@antv\/data-set\/build|)[\\/]/,
            priority: -11
          },
          // 剩下的node_modules单独打包
          libs: {
            test: /[\\/]node_modules[\\/]/,
            name: 'chunk-libs',
            priority: -20
          }
        }
      };
      return webpackConfig;
    }
  },
  babel: {
    // presets: [
    // "react-app", // cra 默认值
    // [
    //   '@babel/preset-env',
    //   {
    //     // 是否启用 ES 模块语法到其他模块类型的转换
    //     modules: 'auto', // 对ES6的模块文件不做转化，以便使用tree shaking、sideEffects等
    //     // 按需加载
    //     useBuiltIns: 'usage', // 只会加载相同的 polyfill 一次
    //     // https://babeljs.io/docs/en/babel-preset-env#usebuiltins
    //     // https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md
    //     corejs: {
    //       version: 3, // 使用core-js@3
    //       proposals: true,
    //     },
    //   },
    // ],
    // [
    //   '@babel/plugin-proposal-class-properties',
    //   {
    //     loose: true
    //   }
    // ],
    // [
    //   // typescript
    //   '@babel/preset-typescript',
    //   {
    //     isTSX: true,
    //     allExtensions: true
    //   }
    // ]
    // ],
    plugins: [
      // 配置 babel-plugin-import
      // style 为 true时，需要配置 craco-less一起才能生效
      // style 为css，不需要 craco-less
      // ['import', {
      //   libraryName: 'antd',
      //   libraryDirectory: 'es',
      //   style: "css"
      // }, 'antd'],
      [
        'import',
        {
          libraryName: 'antd',
          libraryDirectory: 'es',
          style: true // true(less 可以自定义主题) or 'css'
        },
        'antd'
      ],
      // 配置类的装饰器
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true
        }
      ]
    ]
  },
  style: {},
  plugins: [
    // 配置 antd 主题 & 使用less
    // The first method
    // {
    //   plugin: CracoLess,
    //   options: {
    //     lessLoaderOptions: {
    //       lessOptions: {
    //         modifyVars: {
    //           '@primary-color': '#e55870'
    //         },
    //         javascriptEnabled: true,
    //         // 配置全局less 变量，不需要在使用的地方导入了
    //         globalVars: {
    //           hack: `true; @import '~@/style/variable.less';`
    //         }
    //       },
    //     },
    //   },
    // },
    // The second method
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@primary-color': '#9999ff'
        },
        customizeThemeLessPath: addPath('./src/style/variable.less')
      }
    }
  ],
  devServer: {
    host: 'localhost',
    port: 5000,
    open: false // 默认自动开浏览器
    // historyApiFallback: true, //解决前端路由刷新404
    // proxy: {
    //   "/api": {
    //     target: 'http://localhost:5000',
    //     changeOrigin: true,
    //     pathRewrite: {
    //       "^/api": '/api'
    //     }
    //   }
    // }
  },
  performance: false // 关闭性能分析，再快
};
