import { showModal, toast } from '~/composables/util'
import { logout, updatePassword } from '~/api/manager'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

export function useRepassword() {
    const store = useStore()
    const router = useRouter()
    //修改密码
    const formDrawerRef = ref(null)
    const form = ref({
        oldpassword: '',
        password: '',
        repassword: ''
    })
    const rules = {
        oldpassword: [
            { required: true, message: '旧密码不能为空', trigger: 'blur' },
        ],
        password: [
            { required: true, message: '新密码不能为空', trigger: 'blur' },
            { min: 5, max: 20, message: '长度必须在5到20个字符之间', trigger: 'blur' },
        ],
        repassword: [
            { required: true, message: '确认密码不能为空', trigger: 'blur' },
            { min: 5, max: 20, message: '长度必须在5到20个字符之间', trigger: 'blur' },
        ],
    }
    const formRef = ref(null)

    const onSubmit = () => {
        formRef.value.validate((valid) => {
            if (!valid) {
                return false
            }
            formDrawerRef.value.showLoading()//loading
            updatePassword(form.value).then(res => {
                toast('修改密码成功,请重新登录')
                store.dispatch('logout')
                router.push('/login')
            }).finally(() => {
                formDrawerRef.value.hideLoading()
            })
        })
    }
    const openRepasswordForm = () => formDrawerRef.value.open()

    return {
        formDrawerRef,
        form,
        rules,
        formRef,
        onSubmit,
        openRepasswordForm,
    }
}
export function useLogout() {
    const store = useStore()
    const router = useRouter()
    function handleLogout() {
        showModal('提示', '确定要退出登录吗？').then(res => {
            logout().finally(() => {
                store.dispatch('logout')
                router.push('/login')  // 跳转到登录页面
                toast('退出成功')      // 显示退出成功提示
            })
        })
    }
    return {
        handleLogout,
    }

}