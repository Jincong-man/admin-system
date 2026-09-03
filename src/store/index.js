
import { createStore } from 'vuex'
import { login, getInfo } from '~/api/manager'
import { setToken } from '~/composables/auth'
import { removeToken } from '~/composables/auth'
// 创建一个新的 store 实例
const store = createStore({
    state() {
        return {
            // 用户信息
            user: {},
            // 侧边宽度
            asideWidth: '250px',

            menus: [],
            ruleName: [],
            // 是否已获取过用户信息（用于动态路由加载）
            hasGetInfo: false,
        }
    },
    mutations: {
        // 设置用户信息
        setUserinfo(state, user) {
            state.user = user
        },
        //展开/收起侧边栏
        handAsideWidth(state) {
            state.asideWidth = state.asideWidth == '250px' ? '64px' : '250px'
        },
        SET_MENUS(state, menus) {
            state.menus = menus
        },
        SET_RULENAMES(state, ruleNames) {
            state.ruleNames = ruleNames
        },
        SET_HAS_GET_INFO(state, val) {
            state.hasGetInfo = val
        },
    },
    actions: {

        login({ commit }, { username, password }) {
            return new Promise((resolve, reject) => {
                login(username, password).then(res => {
                    setToken(res.token)
                    resolve(res)
                }).catch(err => reject(err))
            })
        },

        //获取当前用户登录信息
        getInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    commit('setUserinfo', res)
                    commit('SET_MENUS', res.menus)
                    commit('SET_RULENAMES', res.ruleNames)
                    commit('SET_HAS_GET_INFO', true)
                    resolve(res)
                }).catch(err => reject(err))
            })
        },
        //退出登录
        logout({ commit }) {
            //移除cookie中的token
            removeToken()
            // 清空用户状态vuex中的用户信息
            commit('setUserinfo', {})
            commit('SET_MENUS', [])
            commit('SET_RULENAMES', [])
            commit('SET_HAS_GET_INFO', false)
        }
    }
})

export default store