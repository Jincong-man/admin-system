import axios from 'axios'
import { toast } from '~/composables/util'
import { getToken } from '~/composables/auth'
import store from './store'

// 后端返回的图片等资源是 http 绝对地址，在 https 页面里会被浏览器当混合内容拦截。
// 统一改写成同源 /api 路径，交给 Cloudflare Pages Function 转发。
const BACKEND_ORIGIN = 'http://ceshi13.dishait.cn'

function rewriteBackendUrls(value, depth = 0) {
    if (value == null || depth > 10) return value
    if (typeof value === 'string') {
        return value.startsWith(BACKEND_ORIGIN)
            ? '/api' + value.slice(BACKEND_ORIGIN.length)
            : value
    }
    if (Array.isArray(value)) return value.map(v => rewriteBackendUrls(v, depth + 1))
    if (typeof value === 'object') {
        for (const key in value) value[key] = rewriteBackendUrls(value[key], depth + 1)
        return value
    }
    return value
}

const service = axios.create({
    baseURL: '/api', // url = base url + request url
    // 线上接口走公网代理，1 秒太容易超时，放宽到 15 秒
    timeout: 15000,
    headers: { 'X-Custom-Header': 'foobar' }
});
// 添加请求拦截器
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    //往hearders中添加token
    const token = getToken()
    if (token) {
        config.headers['token'] = token
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return rewriteBackendUrls(response.data.data);
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // 断网 / 代理失败时 error.response 不存在，这里要兜住
    const msg = error.response?.data?.msg || (error.response ? '请求失败' : '网络异常，请稍后重试')

    // if (error.response.status === 401) {
    if(msg == '非法token，请先登录！'){
        store.dispatch('logout').finally(() => window.location.reload())
    }
    toast(msg, 'error')
    return Promise.reject(error);

});
export default service

