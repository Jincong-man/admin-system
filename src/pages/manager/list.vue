<script setup>
import { computed, ref } from 'vue'
import { getManagerList, updateManagerStatus, deleteManager, updateManager, createManager } from '~/api/manager'
import FormDrawer from '~/components/FormDrawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import { toast } from '~/composables/util.js'
const searchForm = ref({
    keyword: ''
})
const reset = () => {
    searchForm.value.keyword = ''
    getData()
}
const tableData = ref([])

const loading = ref(false)
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
const roles = ref([])
function getData(p = null) {
    if (typeof p == 'number') {
        currentPage.value = p
    }
    loading.value = true
    getManagerList(currentPage.value, searchForm.value).then(res => {
        roles.value = res.roles
        total.value = res.totalCount
        // 每一个对象状态加载
        tableData.value = res.list.map(o => {
            o.statusLoading = false
            return o
        })
    }).finally(() => {
        loading.value = false
    })
}
getData()
//新增管理员(表单部分)
const formDrawerRef = ref(null)
const formRef = ref(null)
const form = ref({
    username: '',
    password: '',
    status: 1,
    role_id: null,
    avatar: '',
})
const rules = ref({
    username: [
        { required: true, message: '用户名不能为空', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
    ]
})
const editId = ref(0)
const drawerTitle = computed(() => editId.value ? '修改管理员' : '新增管理员')
const handleSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return
        formDrawerRef.value.showLoading()
        const fun = editId.value ? updateManager(editId.value, form.value) : createManager(form.value)


        fun.then(res => {
            toast(drawerTitle.value + '成功')
            getData(editId.value ? currentPage.value : 1)

            formDrawerRef.value.close()
        }).finally(() => {
            formDrawerRef.value.hideLoading()
        })
    })


}
//重置表单
function resetForm(row = false) {
    if (formRef.value) formRef.value.clearValidate()
    if (row) {
        for (const key in form.value) {
            form.value[key] = row[key]
        }
    }

}
const handleCreate = () => {
    editId.value = 0
    resetForm({
        username: '',
        password: '',
        status: 1,
        role_id: null,
        avatar: '',
    })
    formDrawerRef.value.open()
}
//编辑公告
const handleEdit = (row) => {
    editId.value = row.id
    resetForm(row)
    formDrawerRef.value.open()
}
//删除公告
const handleDelete = (id) => {
    loading.value = true
    deleteManager(id).then(res => {
        toast('删除成功')
        getData()
    }).finally(() => {
        loading.value = false
    })
}
//更新管理员状态
const handleStatusChange = (status, row) => {
    row.statusLoading = true
    updateManagerStatus(row.id, status).then(res => {
        toast('状态更新成功')
        row.status = status
    }).finally(() => {
        row.statusLoading = false
    })
}
</script>
<template>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <el-form :model="searchForm" label-width="80px" class="mb-2">
            <el-row :gutter="20">
                <el-col :span="8" :offset="0"> <el-form-item label="关键词">
                        <el-input v-model="searchForm.keyword" placeholder="请输入管理员昵称" clearable></el-input>
                    </el-form-item></el-col>
                <el-col :span="8" :offset="8"> <el-form-item>
                        <el-button type="primary" @click="getData">搜索</el-button>
                        <el-button @click="reset">重置</el-button>
                    </el-form-item></el-col>
            </el-row>



        </el-form>

        <!-- 新增/刷新 -->
        <div class="flex justify-between items-center mb-4">
            <el-button type="primary" size="small" text @click="handleCreate">新增</el-button>
            <el-tooltip effect="dark" content="刷新数据" placement="top">
                <el-button text @click="getData"><el-icon :size="20">
                        <Refresh />
                    </el-icon></el-button>
            </el-tooltip>
        </div>
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column label="管理员" width="200">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-avatar :size="40" :src="row.avatar">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                        </el-avatar>
                        <div class="ml-3">
                            <h6>{{ row.username }}</h6>
                            <small>ID: {{ row.id }}</small>
                        </div>
                    </div>


                </template>
            </el-table-column>
            <el-table-column label="所属管理员" align="center">
                <template #default="{ row }">
                    <el-tag>{{ row.role?.name || '-' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="120" align="center">
                <template #default="{ row }">
                    <el-switch :model-value="row.status" :active-value="1" :inactive-value="0"
                        :loading="row.statusLoading" :disabled="row.super == 1"
                        @change="handleStatusChange($event, row)"></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template #default="scope">
                    <small v-if="scope.row.super == 1" class="text-gray-500 text-sm ml-4">暂无操作</small>
                    <div v-else>
                        <el-button size="small" type="primary" @click="handleEdit(scope.row)">
                            修改
                        </el-button>
                        <el-popconfirm title="是否删除该管理员？" confirm-button-text="确认" cancel-button-text="取消"
                            @confirm="handleDelete(scope.row.id)">
                            <template #reference>
                                <el-button text type="danger" size="small">删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </div>

                </template>
            </el-table-column>
        </el-table>
        <div class="flex justify-center items-center mt-4"> <el-pagination background layout="prev,  pager,next"
                :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData" />
        </div>
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <ChooseImage v-model="form.avatar" />
                </el-form-item>
                <el-form-item label="所属角色" prop="role_id">
                    <el-select v-model="form.role_id" placeholder="请选择角色">
                        <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>