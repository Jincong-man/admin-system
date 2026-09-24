import axios from '~/axios'

export function login(username, password) {
  return axios.post('/admin/login', {
    username,
    password
  })
}

export function getInfo() {
  return axios.post('/admin/getinfo')
}

export function logout() {
  return axios.post('/admin/logout')
}

export function updatePassword(data) {
  return axios.post('/admin/updatepassword', data)
}
//获取管理员列表
export function getManagerList(page, query = {}) {
  let q = []
  for (const key in query) {
    if (query[key]) {
      q.push(`${key}=${encodeURIComponent(query[key])}`)

    }
  }
  let r = q.join('&')
  r = r ? ('?' + r) : ''
  return axios.get(`/admin/manager/${page}${r}`);
}
//更新管理员状态
export function updateManagerStatus(id, status) {
  return axios.post(`/admin/manager/${id}/update_status`, {
    status
  })
}
//删除管理员
export function deleteManager(id) {
  return axios.post(`/admin/manager/${id}/delete`)
}
//修改管理员信息
export function updateManager(id, data) {
  return axios.post(`/admin/manager/${id}`, data)
}
//添加管理员
export function createManager(data) {
  return axios.post(`/admin/manager`, data)
}
