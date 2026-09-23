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
export function getManagerList(page = 1, keyword = 'ceshi') {
    return axios.get(`/admin/manager/${page}?limit=${10}&keyword=${keyword}`);
}
