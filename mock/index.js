export default [
  {
    url: '/api/user/login', // 接口地址
    method: 'post', // 请求方式
    response: () => {
      // 返回模拟数据
      return {
        code: 200,
        msg: '登录成功',
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // JWT / sessionId
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // 可选
          expiresIn: 7200, // token有效期，单位秒
        },
      }
    },
  },
  {
    url: '/api/refreshToken', // 接口地址
    method: 'post', // 请求方式
    response: () => {
      // 返回模拟数据
      return {
        code: 200,
        msg: '登录成功',
        data: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // JWT / sessionId
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', // 可选
          expiresIn: 7200, // token有效期，单位秒
        },
      }
    },
  },
  {
    url: '/api/user/info',
    method: 'get',
    response: ({ body }) => {
      // 获取前端传参 body
      return {
        code: 200,
        message: '登录成功',
        data: {
          userInfo: {
            userId: 10001,
            username: 'admin',
            nickname: '超级管理员',
            phone: '13800138000',
            email: 'admin@company.com',
            avatar: 'https://xxx.com/avatar.png',
            status: 1,
            createTime: '2026-01-01 12:00:00',
          },
          roles: [
            {
              roleId: 1,
              roleName: '超级管理员',
              roleCode: 'admin',
            },
          ],
          permissions: [
            'system:user:list',
            'system:user:add',
            'system:user:edit',
            'system:user:delete',
            'system:role:list',
            'system:menu:list',
            'business:goods:list',
            '*',
          ],
          menus: [
            {
              path: '/dashboard',
              name: 'Dashboard',
              title: '控制台',
              icon: 'HomeFilled',
              isShow: true,
            },
            {
              path: '/system',
              name: 'System',
              title: '系统管理',
              icon: 'Setting',
              isShow: true,
              roles: ['admin', 'super-admin'],
              children: [
                {
                  path: '/system/user',
                  name: 'User',
                  title: '用户管理',
                  icon: 'UserFilled',
                  isShow: true,
                },
                {
                  path: '/system/role',
                  name: 'Role',
                  title: '角色管理',
                  icon: 'Avatar',
                  isShow: true,
                },
                {
                  path: '/system/menu',
                  name: 'Menu',
                  title: '菜单管理',
                  icon: 'Menu',
                  isShow: true,
                },
                {
                  path: '/system/dict',
                  name: 'Dict',
                  title: '数据字典',
                  icon: 'Document',
                  isShow: true,
                },
              ],
            },
            {
              path: '/business',
              name: 'Business',
              title: '业务管理',
              icon: 'Grid',
              isShow: true,
              children: [
                {
                  path: '/business/goods',
                  name: 'Goods',
                  title: '商品管理',
                  icon: 'GoodsFilled',
                  isShow: true,
                },
                {
                  path: '/business/category',
                  name: 'Category',
                  title: '商品分类',
                  icon: 'Collection',
                  isShow: true,
                },
              ],
            },
            {
              path: '/profile',
              name: 'Profile',
              title: '个人中心',
              icon: 'User',
              isShow: true,
            },
          ],
        },
      }
    },
  },
  {
    url: '/api/dashboard/info',
    method: 'get',
    response: ({ body }) => {
      // 获取前端传参 body
      return {
        code: 200,
        message: '登录成功',
        data: {
          cards: [
            { title: '用户总数', value: 2834 },
            { title: '今日新增', value: 126 },
            { title: '商品总数', value: 568 },
            { title: '操作日志', value: 9678 },
            { title: '角色数量', value: 8 },
            { title: '菜单数量', value: 36 },
          ],
          lineData: {
            dateList: ['4月1日', '4月2日', '4月3日', '4月4日', '4月5日', '4月6日', '4月7日'],
            valueList: [150, 230, 180, 290, 250, 320, 380],
          },
          pieData: [
            { name: '普通用户', value: 1680 },
            { name: '运营人员', value: 720 },
            { name: '系统管理员', value: 268 },
          ],
          barData: {
            categoryList: ['电子产品', '服装鞋帽', '食品生鲜', '图书文具', '家居用品'],
            salesList: [280, 160, 320, 120, 190],
          },
          logs: [
            {
              user: 'admin',
              module: '用户管理',
              action: '编辑用户信息',
              time: '2026-04-03 10:22:15',
              status: '成功',
            },
            {
              user: 'test',
              module: '商品管理',
              action: '新增商品：华为 Mate 70',
              time: '2026-04-03 09:45:20',
              status: '成功',
            },
            {
              user: 'manager',
              module: '商品分类',
              action: '删除分类：数码配件',
              time: '2026-04-03 08:10:55',
              status: '成功',
            },
            {
              user: 'admin',
              module: '数据导出',
              action: '导出用户列表数据',
              time: '2026-04-02 16:30:10',
              status: '成功',
            },
            {
              user: 'zhangsan',
              module: '角色管理',
              action: '分配权限：运营角色',
              time: '2026-04-02 14:20:35',
              status: '成功',
            },
            {
              user: 'lisi',
              module: '系统设置',
              action: '修改系统主题配置',
              time: '2026-04-02 11:15:42',
              status: '成功',
            },
            {
              user: 'admin',
              module: '登录日志',
              action: '后台系统登录',
              time: '2026-04-03 08:30:00',
              status: '成功',
            },
          ],
        },
      }
    },
  },

  {
    url: '/api/user/list',
    method: 'get',
    response: ({ body }) => {
      // 获取前端传参 body
      return {
        code: 200,
        message: '登录成功',
        data: {
          total: 100,
          pageNum: 1,
          pageSize: 10,
          list: [
            {
              id: 1,
              username: 'admin',
              nickname: '系统管理员',
              phone: '13800138000',
              roleName: '管理员',
              status: '正常',
              createTime: '2026-01-01 10:00:00',
            },
            {
              id: 2,
              username: 'test',
              nickname: '测试账号',
              phone: '13900139000',
              roleName: '普通用户',
              status: '正常',
              createTime: '2026-01-02 11:12:13',
            },
            {
              id: 3,
              username: 'manager',
              nickname: '运营经理',
              phone: '13700137000',
              roleName: '运营',
              status: '禁用',
              createTime: '2026-01-03 09:08:07',
            },
          ],
        },
      }
    },
  },
]
