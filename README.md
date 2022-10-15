react后台管理学习练手项目

由react-scripts构建的react项目，使用craco对webpack添加自定义配置，添加了[dva-boot-admin](https://github.com/LANIF-UI/dva-boot-admin)组件代码进行代码层面的改动，保留其功能和样式。

## 改动项
### 路由
dva/router&emsp;&emsp;==>&emsp;&emsp;react-router-dom6
useRoutes对路由配置处理，二级路由使用Outlet占位

### 组件
class组件&emsp;&emsp;==>&emsp;&emsp;function组件

* `constructor`使用useEffect(() => {},[])零依赖项，表示只在组件只在create时执行一次，不过使用useEffect执行时组件已经是挂载了
* `componentDidMount`同constructor，使用useEffect
* `getDerivedStateFromProps`根据props的变化来，可以使用useEffect，在其中添加变化需要的依赖项，而preState可以使用useState来保存上一次需要的state值
* `componentDidUpdate`使用useEffect，添加需要的依赖项，有依赖项的一般单独使用一个useEffect
* `componentWillUnmount`使用useEffect回调函数返回一个函数，可以用来清除副作用

### redux
dva/model&emsp;&emsp;==>&emsp;&emsp;@reduxjs/toolkit + react-redux
@reduxjs/toolkit来定义store，react-redux负责连接store和redux传递数据

* `reducers`都是用于修改state，执行同步操作
* `effects`在dva/model中effects使用Generator函数，可以dispatch action执行reducer。在@reduxjs/toolkit中对应的异步reducer可以是createAsyncThunk创建或者手写thunks得到的的reducer，可以包含同步和异步逻辑、dispatch来执行其他reducer，另外createAsyncThunk创建的减速器可以在extraReducers中添加对应状态的逻辑

### mock
dva/mock + fectch&emsp;&emsp;==>&emsp;&emsp;mockjs + axios（xhr）













