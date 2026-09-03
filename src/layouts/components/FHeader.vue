<script setup>
import { useFullscreen } from '@vueuse/core'
import FormDrawer from '~/components/FormDrawer.vue'
import { useRepassword, useLogout } from '~/composables/useManager'
const {
    // 是否全屏状态
    isFullscreen,
    // 切换全屏
    toggle
} = useFullscreen()
const {
    formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRepasswordForm,
} = useRepassword()
const { handleLogout } = useLogout()
//修改密码


//添加键盘监听，监听Enter键
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        onSubmit()
    }
})

const handleCommand = (c) => {
    switch (c) {
        case 'changePassword':
            // drawer.value = true
            openRepasswordForm()
            break
        case 'logout':
            handleLogout()
            break
    }
}

const handleRefresh = () => {
    window.location.reload()
}

</script>

<template>
    <div class="f-header">
        <span class="logo">
            <el-icon class="mr-1">
                <Shop />
            </el-icon>
            电商后台
        </span>
        <el-icon class="icon-btn" @click="$store.commit('handAsideWidth')">
            <Fold  v-if="$store.state.asideWidth == '250px'"/>
           <Expand v-else />
        </el-icon>
        <el-tooltip effect="dark" content="刷新" placement="bottom">
            <el-icon class="icon-btn" @click="handleRefresh">
                <Refresh />
            </el-icon>
        </el-tooltip>
        <div class="ml-auto flex items-center mr-5">
            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <el-icon class="icon-btn" @click="toggle">
                    <FullScreen v-if="!isFullscreen" />
                    <Aim v-else />
                </el-icon>
            </el-tooltip>
            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="flex items-center text-light-50">
                    <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="changePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>

                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>


    <!-- <el-drawer v-model="drawer" title="修改密码" size="40%" :close-on-click-modal="false">
       
    </el-drawer> -->

    <form-drawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="onSubmit">
        <el-form ref="formRef" :rules="rules" :model="form" class="form" label-width="80px">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input v-model="form.oldpassword" placeholder="请输入旧密码" clearable show-password>
                </el-input>
            </el-form-item>

            <el-form-item prop="password" label="新密码">
                <el-input type="password" v-model="form.password" placeholder="请输入新密码" clearable show-password>
                </el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码">
                <el-input type="password" v-model="form.repassword" placeholder="请输入确认密码" clearable show-password>
                </el-input>
            </el-form-item>
        </el-form>

    </form-drawer>



</template>

<style scoped>
.f-header {
    @apply flex items-center bg-indigo-500 text-light-50 fixed top-0 left-0 right-0 z-10;
    height: 64px;
}

.logo {
    width: 250px;
    @apply flex items-center justify-center text-xl font-thin;
}

.icon-btn {
    @apply flex items-center justify-center cursor-pointer;
    width: 40px;
    height: 64px;
}

.icon-btn:hover {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
}

d .f-header.dropdown {
    height: 64px;
    cursor: pointer;
    @apply flex items-center justify-center mx-5;
}
</style>