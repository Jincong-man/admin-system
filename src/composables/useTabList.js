import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const TAB_LIST_KEY = 'tabList'

// 从 sessionStorage 读取标签列表（避免 cookies 的 4KB 大小限制导致数据丢失）
function getStoredTabList() {
    try {
        const data = sessionStorage.getItem(TAB_LIST_KEY)
        return data ? JSON.parse(data) : null
    } catch {
        return null
    }
}

function saveTabList(list) {
    try {
        sessionStorage.setItem(TAB_LIST_KEY, JSON.stringify(list))
    } catch {
        // 忽略存储失败
    }
}

export function useTabList() {
    const route = useRoute()
    const routerInstance = useRouter()
    const activeTab = ref(route.path)

    // 初始化标签列表：优先从 sessionStorage 恢复
    const stored = getStoredTabList()
    const tabList = ref(
        stored && stored.length > 0
            ? stored
            : [{ title: '后台首页', path: '/' }]
    )

    // 添加标签
    function addTab(tab) {
        if (!tab.title || !tab.path) return
        const exists = tabList.value.some(t => t.path === tab.path)
        if (!exists) {
            tabList.value.push(tab)
        }
        saveTabList(tabList.value)
    }

    // 监听路由变化，自动添加标签并更新激活状态
    // 使用 watch 替代 onBeforeRouteUpdate，确保所有路由变化（包括侧边栏点击）都能触发
    watch(
        () => route.path,
        (path) => {
            activeTab.value = path
            addTab({
                title: route.meta.title || '未命名',
                path: path
            })
        },
        { immediate: true }
    )

    // 点击标签切换路由
    const changeTab = (path) => {
        routerInstance.push(path)
    }

    // 移除标签
    const removeTab = (path) => {
        const tabs = tabList.value
        let nextPath = activeTab.value

        // 如果关闭的是当前激活标签，找到相邻标签作为下一个激活项
        if (activeTab.value === path) {
            const index = tabs.findIndex(t => t.path === path)
            const nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) {
                nextPath = nextTab.path
            }
        }

        tabList.value = tabs.filter(t => t.path !== path)
        saveTabList(tabList.value)

        // 如果关闭的是当前标签，跳转到相邻标签
        if (activeTab.value === path) {
            activeTab.value = nextPath
            routerInstance.push(nextPath)
        }
    }

    // 关闭其他 / 关闭全部
    const handleClose = (command) => {
        if (command === 'closeAll') {
            tabList.value = [{ title: '后台首页', path: '/' }]
            activeTab.value = '/'
            routerInstance.push('/')
        } else if (command === 'closeOther') {
            tabList.value = tabList.value.filter(
                t => t.path === '/' || t.path === activeTab.value
            )
        }
        saveTabList(tabList.value)
    }

    return {
        tabList,
        activeTab,
        changeTab,
        handleClose,
        removeTab,
    }
}
