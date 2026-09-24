import { ref, computed } from 'vue'
import { toast } from '~/composables/util.js'
//封装列表、分页、搜索、删除、修改状态
export function useInitTable(opt = {}) {
    //搜索表单：没传 searchForm 时给空对象，保证 getData 里能安全访问 searchForm.value
    const searchForm = ref({ ...(opt.searchForm || {}) })

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
        opt.getList(currentPage.value, searchForm.value).then(res => {
            if (opt.onGetListSuccess && typeof opt.onGetListSuccess == 'function') {
                opt.onGetListSuccess(res)
            } else {
                total.value = res.totalCount
                tableData.value = res.list

            }

        }).finally(() => {
            loading.value = false
        })
    }

    //重置搜索条件
    const reset = () => {
        searchForm.value = { ...(opt.searchForm || {}) }
        getData()
    }

    getData()

    //删除
    const handleDelete = (id) => {
        loading.value = true
        opt.delete(id).then(res => {
            toast('删除成功')
            getData()
        }).finally(() => {
            loading.value = false
        })
    }
    //更新状态
    const handleStatusChange = (status, row) => {
        row.statusLoading = true
        opt.updateStatus(row.id, status).then(res => {
            toast('状态更新成功')
            row.status = status
        }).finally(() => {
            row.statusLoading = false
        })
    }
    return { searchForm, reset, tableData, loading, currentPage, total, limit, getData, handleDelete, handleStatusChange }
}
//封装新增、编辑表单
export function useInitForm(opt = {}) {
    //新增管理员(表单部分)
    const formDrawerRef = ref(null)
    const formRef = ref(null)
    const defaultForm = opt.form
    const form = ref({})
    const rules = opt.rules || {
        username: [
            { required: true, message: '用户名不能为空', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
        ]
    }
    const editId = ref(0)
    //抽屉标题：opt.title 传业务名，如 '公告'、'管理员'
    const drawerTitle = computed(() => `${editId.value ? '修改' : '新增'}${opt.title || ''}`)
    const handleSubmit = () => {
        formRef.value.validate((valid) => {
            if (!valid) return
            formDrawerRef.value.showLoading()
            const fun = editId.value ? opt.update(editId.value, form.value) : opt.create(form.value)


            fun.then(res => {
                toast(drawerTitle.value + '成功')
                //先关抽屉再刷新，避免刷新报错导致抽屉关不掉
                formDrawerRef.value.close()
                //修改→留在当前页(不传参)，新增→回到第一页
                if (editId.value) {
                    opt.getData()
                } else {
                    opt.getData(1)
                }
            }).finally(() => {
                formDrawerRef.value.hideLoading()
            })
        })


    }
    //重置表单：row 为空则填默认值
    function resetForm(row = null) {
        if (formRef.value) formRef.value.clearValidate()
        for (const key in defaultForm) {
            form.value[key] = row ? row[key] : defaultForm[key]
        }
    }
    const handleCreate = () => {
        editId.value = 0
        resetForm()
        formDrawerRef.value.open()
    }
    //编辑
    const handleEdit = (row) => {
        editId.value = row.id
        resetForm(row)
        formDrawerRef.value.open()
    }
    return {
        formDrawerRef, formRef, form, rules, editId, drawerTitle,
        handleSubmit, resetForm, handleCreate, handleEdit
    }

}
