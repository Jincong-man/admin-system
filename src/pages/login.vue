<script setup>
import { toast } from '~/composables/util'
import { useRouter } from 'vue-router'

import { ref, reactive } from 'vue'
import { setToken } from '~/composables/auth'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()


const form = ref({
    username: '',
    password: '',
})
const rules = {
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
        { min: 5, max: 20, message: '长度必须在5到20个字符之间', trigger: 'blur' },
    ],
}
const formRef = ref(null)
const loading = ref(false)

const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) {
            return false
        }
        loading.value = true

        store.dispatch('login', form.value)
            .then(res => {
                toast('登录成功')
                router.push('/')
            }).finally(() => {
                loading.value = false
            })

    })
}

//添加键盘监听，监听Enter键
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        onSubmit()
    }
})


</script>

<template>

    <el-row class="login-container">
        <el-col :lg="16" :md="12" class="left">
            <div>
                <div>欢迎光临</div>
                <div>电商后台管理</div>
            </div>
        </el-col>
        <el-col :lg="8" :md="12" class="right">
            <h2 class="title">欢迎回来</h2>
            <div>
                <span></span>
                <span>账号密码登录</span>
                <span></span>
            </div>
            <el-form ref="formRef" :rules="rules" :model="form" class="form">
                <el-form-item prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名" clearable>
                        <template #prefix>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>

                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" v-model="form.password" placeholder="请输入密码" clearable show-password>
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button round type="primary" @click="onSubmit" :loading="loading">登录</el-button>
                </el-form-item>
            </el-form>
        </el-col>


    </el-row>


</template>

<style scoped>
.form .el-input,
.form .el-button {
    width: 250px;
}

.login-container {
    @apply min-h-screen bg-blue-500;
}

.login-container .left,
.login-container .right {
    @apply flex items-center justify-center;
}

.login-container .right {
    @apply bg-light-50 flex-col;
}

.left>div>div:first-child {
    @apply font-bold text-5xl text-light-50 mb-5;
}

.left>div>div:last-child {
    @apply text-gray-200 text-sm;
}

.right .title {
    @apply font-bold text-3xl text-gray-800;
}

.right>div {
    @apply flex items-center justify-center my-5 text-gray-300;
}
</style>