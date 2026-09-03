<script setup>
import { ref } from 'vue'

const drawer = ref(false)

const props = defineProps({
    title: String,
    size: {
        type: String,
        default: '40%'
    },
    destroyOnClose: {
        type: Boolean,
        default: false
    },
    confirmText: {
        type: String,
        default: '提交'
    },

})

const loading = ref(false)
const showLoading = () => loading.value = true
const hideLoading = () => loading.value = false
const open = () => drawer.value = true
const close = () => drawer.value = false
// 提交表单
const emit = defineEmits(['submit'])
const Submit = () => emit('submit')
//向父组件暴露方法open和close
defineExpose({
    open,
    close,
    showLoading,
    hideLoading
})
</script>

<template>
    <el-drawer v-model="drawer" :title="title" :size="size" :destroy-on-close="destroyOnClose"
        :close-on-click-modal="false">
        <div class="formDrawer">
            <div class="body">
                <slot></slot>
            </div>
            <div class="action">
                <el-button type="primary" @click="Submit" :loading="loading">{{ confirmText }}</el-button>
                <el-button type="default" @click="close">取消</el-button>
            </div>
        </div>
    </el-drawer>
</template>

<style scoped>
.formDrawer {
    width: 100%;
    height: 100%;
    position: relative;
    @apply flex flex-col;
}

.formDrawer .body {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    @apply flex-1;
    overflow-y: auto;
}

.formDrawer .action {
    height: 50px;
    @apply flex mt-auto items-center;
}
</style>