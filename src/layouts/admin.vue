<script setup>
import { KeepAlive } from 'vue';
import FHeader from './components/FHeader.vue'
import FMenu from './components/FMenu.vue'
import FTagList from './components/FTagList.vue'
</script>

<template>
    <el-container>
        <el-header>
            <FHeader></FHeader>
        </el-header>
        <el-container>
            <el-aside :width="$store.state.asideWidth">
                <FMenu></FMenu>
            </el-aside>
            <el-main>
                <FTagList></FTagList>
                <router-view v-slot="{ Component }">
                    <KeepAlive :max="10">
                        <Component :is="Component" :key="$route.path"></Component>
                    </KeepAlive>
                </router-view>
            </el-main>

        </el-container>
    </el-container>
</template>

<style scoped>
.el-aside {
    transition: all 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    -webkit-transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);
    transform: translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.3s;
}
</style>