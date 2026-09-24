<script setup>
import { ref } from 'vue'
import { getManagerList, updateManagerStatus, deleteManager, updateManager, createManager } from '~/api/manager'
import FormDrawer from '~/components/FormDrawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon.js'
const roles = ref([])
const { searchForm, reset, tableData, loading, currentPage, total, limit, getData, handleDelete, handleStatusChange }
    = useInitTable({
        searchForm: {
            keyword: '',
        },
        getList: getManagerList,
        onGetListSuccess: (res) => {
            roles.value = res.roles
            total.value = res.totalCount
            // 每一个对象状态加载
            tableData.value = res.list.map(o => {
                o.statusLoading = false
                return o
            })
        },
        delete: deleteManager,
        updateStatus: updateManagerStatus,

    })
const {
    formDrawerRef, formRef, form, rules, drawerTitle,
    handleSubmit, handleCreate, handleEdit
} = useInitForm({
    title: '管理员',
    form: {
        username: '',
        password: '',
        status: 1,
        role_id: null,
        avatar: '',
    },
    getData,
    create: createManager,
    update: updateManager,
})
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