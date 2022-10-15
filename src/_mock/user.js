/**
 * 用户
 */
export default function charts({ toSuccess, toError, mock }) {
  return {
    'POST /api/user/login': options => {
      console.log('options', options);
      if (options.body) {
        const user = JSON.parse(options.body);
        if (user.userName === 'admin' && user.password === 'admin') {
          return toSuccess(
            mock({
              userName: 'admin', // 用户名
              name: '@cname', // 中文名称
              'age|1-100': 100, // 100以内随机整数
              birthday: '@date("yyyy-MM-dd")', // 日期
              city: '@city(true)', // 中国城市
              phone: /^1[385][1-9]\d{8}/, // 手机号
              token: '@guid' // token
            })
          );
        } else {
          return toError('用户名或密码错误');
        }
      } else {
        return toError('请输入用户名和密码');
      }
    },
    'POST /api/user/register': options => toSuccess(),
    '/api/user/menu': options => {
      console.log(options);
      return toSuccess([
        // {
        //   name: '主页',
        //   icon: 'HomeOutlined',
        //   path: '/home'
        // },
        {
          name: '按钮',
          icon: 'SelectOutlined',
          path: '/button'
        },
        {
          name: 'css动画',
          icon: 'SkinOutlined',
          path: '/animate'
        },
        {
          name: '用户',
          icon: 'UserOutlined',
          path: '/user/:detail?'
        }
        // {
        //   name: '用户详情',
        //   icon: 'UserOutlined',
        //   path: '/user/detail'
        // },
      ]);
    }
  };
}
