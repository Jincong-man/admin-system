import { ref } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { router } from '~/router'


export function useTabList() {
    const route = useRoute()
    const cookies = useCookies()
    const activeTab = ref(route.path)
    const tabList = ref([
        {
            title: '后台首页',
            path: '/'
        }, {
            title: '商城管理',
            path: '/goods/list'
        },


    ])

    //添加标签导航
    function addTab(tab) {
        const noTab = tabList.value.findIndex(t => t.path == tab.path) == -1
        if (noTab) {
            tabList.value.push(tab)
        }
        cookies.set('tabList', tabList.value)
    }
    //初始化标签导航列表
    function initTabList() {
        let tab = cookies.get('tabList')
        if (tab) {
            tabList.value = tab
        }
    }

    initTabList()
    onBeforeRouteUpdate((to, from) => {
        activeTab.value = to.path
        addTab({
            title: to.meta.title,
            path: to.path
        })
    })

    const changeTab = (t) => {
        activeTab.value = t
        router.push(t)
    }

    const removeTab = (t) => {
        let tabs = tabList.value
        let a = activeTab.value
        if (a == t) {
            tabs.forEach((tab, index) => {
                if (tab.path == t) {
                    const nextTab = tabs[index + 1] || tabs[index - 1]
                    if (nextTab) {
                        a = nextTab.path
                    }
                }
            })

        }
        activeTab.value = a
        tabList.value = tabList.value.filter(tab => tab.path != t)
        cookies.set('tabList', tabList.value)
        router.push(a)
    }

    const handleClose = (c) => {
        if (c == "closeAll") {
            //切换回首页
            activeTab.value = '/'
            //过滤只剩下首页
            tabList.value = [{
                title: '后台首页',
                path: '/'
            }]
            router.push('/')
        } else if (c == "closeOther") {
            //过滤只剩首页和当前页
            tabList.value = tabList.value.filter(tab => tab.path == activeTab.value || tab.path == '/')
        }
        cookies.set('tabList', tabList.value)
    }
    return {
        tabList,
        activeTab,
        changeTab,
        handleClose,
        removeTab,

    }
}