<script setup>
import { computed, ref } from 'vue'
import { getNoticeList, createNotice, updateNotice, deleteNotice } from '~/api/notice'
import FormDrawer from '~/components/FormDrawer.vue'
import { toast } from '~/composables/util.js'
const tableData = ref([])

const loading = ref(false)
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)
function getData(p = null) {
    if (typeof p == 'number') {
        currentPage.value = p
    }
    loading.value = true
    getNoticeList(currentPage.value).then(res => {
        total.value = res.totalCount
        tableData.value = res.list
    }).finally(() => {
        loading.value = false
    })
}
getData()
//新增公告(表单部分)
const formDrawerRef = ref(null)
const formRef = ref(null)
const form = ref({
    title: '',
    content: '',
})
const rules = ref({
    title: [
        { required: true, message: '公告标题不能为空', trigger: 'blur' },
    ],
    content: [
        { required: true, message: '公告内容不能为空', trigger: 'blur' },
    ]
})
const editId = ref(0)
const drawerTitle = computed(() => editId.value ? '修改公告' : '新增公告')
const handleSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) return
        formDrawerRef.value.showLoading()
        const fun = editId.value ? updateNotice(editId.value, form.value) : createNotice(form.value)


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
        title: '',
        content: '',
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
    deleteNotice(id).then(res => {
        toast('删除成功')
        getData()
    }).finally(() => {
        loading.value = false
    })
}
</script>
<template>
    <el-card shadow="never" class="border-0">
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
            <el-table-column prop="title" label="公告标题" />
            <el-table-column prop="create_time" label="创建时间" width="380" />
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button size="small" type="primary" @click="handleEdit(scope.row)">
                        修改
                    </el-button>
                    <el-popconfirm title="是否删除该公告？" confirm-button-text="确认" cancel-button-text="取消"
                        @confirm="handleDelete(scope.row.id)">
                        <template #reference>
                            <el-button text type="danger" size="small">删除
                            </el-button>
                        </template>
                    </el-popconfirm>

                </template>
            </el-table-column>
        </el-table>
        <div class="flex justify-center items-center mt-4"> <el-pagination background layout="prev,  pager,next"
                :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData" />
        </div>
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="公告标题" prop="title">
                    <el-input v-model="form.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input v-model="form.content" placeholder="请输入内容" type="textarea" :rows="5"></el-input>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>