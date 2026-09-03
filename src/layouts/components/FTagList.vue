<script setup>
import { useTabList } from '~/composables/useTabList.js'
const { tabList, activeTab, changeTab, handleClose, removeTab } = useTabList()

</script>

<template>
    <div class="f-tag-list" :style="{ left: $store.state.asideWidth }">
        <el-tabs v-model="activeTab" @tab-click="handleClick" type="card" class="demo-tabs" @tab-remove="removeTab"
            style="min-width:100px;" @tab-change="changeTab">
            <el-tab-pane :closable="item.path != '/'" v-for="item in tabList" :key="item.path" :label="item.title"
                :name="item.path">
            </el-tab-pane>
        </el-tabs>

        <span class="tag-btn">
            <el-dropdown @command="handleClose">
                <span class="el-dropdown-link">
                    <el-icon>
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="closeOther">关闭其他</el-dropdown-item>
                        <el-dropdown-item divided command="closeAll">全部关闭</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
    <div style="height: 44px;">

    </div>
</template>

<style scoped>
.f-tag-list {
    top: 64px;
    @apply fixed bg-gray-100 flex items-center px-2;
    right: 0;
    height: 44px;
    z-index: 10;

}

.tag-btn {
    @apply bg-white rounded ml-auto flex items-center justify-center px-2;
    height: 32px;
}

:deep(.el-tabs__header) {
    border: 0 !important;
    @apply mb-0;

}

:deep(.el-tabs__nav) {
    border: 0 !important;
}

:deep(.el-tabs__item) {
    border: 0 !important;
    height: 32px;
    line-height: 32px;
    @apply bg-white mx-1 rounded;
}

:deep(.el-tabs__nav-next),
:deep(.el-tabs__nav-prev) {
    height: 32px;
    line-height: 32px;
}
</style>