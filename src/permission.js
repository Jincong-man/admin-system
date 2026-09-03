import { router, addRoutes } from './router'
import { getToken } from './composables/auth'
import { toast, showFullLoading, hideFullLoading } from './composables/util'
import store from './store'


// 全局前置守卫
router.beforeEach(async (to, from) => {
    //显示loading
    showFullLoading()
    const token = getToken()
    // 如果没有登录，且不是登录页，重定向到登录页
    if (!token && to.path != '/login') {
        toast('请先登录', 'error')
        return '/login'
    }

    //防止重复登录
    if (token && to.path == '/login') {
        toast('请勿重复登录', 'error')
        return from.path || '/'
    }

    //如果用户登录了，自动获取用户信息，存储到vuex中
    let hasNewRoutes = false
    if (token && !store.state.hasGetInfo) {
        let { menus } = await store.dispatch('getInfo')
        //根据用户信息，动态添加路由
        hasNewRoutes = addRoutes(menus)
    }
    //设置页面标题
    let title = (to.meta.title ? to.meta.title : '') + '-电商后台'
    document.title = title

    // 如果添加了新路由，重新导航到当前路径以触发路由匹配
    if (hasNewRoutes) {
        return to.fullPath
    }
})

//全局后置守卫
router.afterEach((to, from) => {
    //关闭loading
    hideFullLoading()
})
