<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { ref } from 'vue'

const store = useStore()
const router = useRouter()
const route = useRoute()
//默认选中当前路由
const defaultActive = ref(route.path)
const asideMenus = computed(() => store.state.menus)

const handleSelect = (e) => {
    router.push(e)
}
//是否折叠
const isCollapse = computed(() => !(store.state.asideWidth == '250px'))

</script>

<template>
    <div class="f-menu" :style="{ width: $store.state.asideWidth }">
        <el-menu :default-active="defaultActive" :unique-opened="true" :collapse="isCollapse" class="border-0"
            @select="handleSelect" :hide-timeout="0" :show-timeout="0" :collapse-transition="false">

            <template v-for="(item, index) in asideMenus" :key="index"> <!-- 遍历菜单 -->
                <!-- 二级菜单 -->
                <el-sub-menu v-if="item.child && item.child.length > 0" :index="item.name">
                    <template #title>
                        <el-icon>
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span>{{ item.name }}</span>
                    </template>
                    <!-- 二级菜单 子菜单 -->
                    <el-menu-item v-for="(item2, index2) in item.child" :key="index2" :index="item2.frontpath">
                        <el-icon>
                            <component :is="item2.icon"></component>
                        </el-icon>
                        <span>{{ item2.name }}</span></el-menu-item>
                </el-sub-menu>

                <!-- 一级菜单 -->
                <el-menu-item v-else :index="item.frontpath">
                    <el-icon>
                        <component :is="item.icon"></component>
                    </el-icon>
                    <span>{{ item.name }}</span>
                </el-menu-item>
            </template>
        </el-menu>
    </div>
</template>

<style scoped>
.f-menu {
    transition: all 0.2s;
    position: fixed;
    top: 64px;
    bottom: 0;
    left: 0;
    overflow-y: auto;
    overflow-x: hidden;
    /* 阴影 */
    @apply shadow-md bg-light-50;
}
</style>