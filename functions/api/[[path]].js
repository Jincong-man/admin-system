/**
 * Cloudflare Pages Function：把前端的 /api/* 请求反向代理到后端
 *
 * 为什么需要：
 *  1. 打包后没有 Vite 的 dev proxy，/api/* 在静态站上会直接 404；
 *  2. 后端是 http 明文，https 页面直连会被浏览器当作混合内容拦截。
 * 由 Cloudflare 在服务端完成转发，浏览器只看到同源的 /api，两个问题一起解决。
 */
const API_ORIGIN = 'http://ceshi13.dishait.cn'

export async function onRequest(context) {
  const { request } = context
  const url = new URL(request.url)

  // /api/goods/list?page=1  ->  http://ceshi13.dishait.cn/goods/list?page=1
  const targetUrl = API_ORIGIN + url.pathname.replace(/^\/api/, '') + url.search

  const headers = new Headers(request.headers)
  headers.delete('host')

  const hasBody = !['GET', 'HEAD'].includes(request.method)
  const body = hasBody ? await request.arrayBuffer() : undefined

  let resp
  try {
    resp = await fetch(targetUrl, {
      method: request.method,
      headers,
      body,
      redirect: 'manual',
    })
  } catch (e) {
    return new Response(JSON.stringify({ msg: '接口转发失败：' + e.message }), {
      status: 502,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    })
  }

  // 原样透传响应，去掉会和运行时冲突的头
  const respHeaders = new Headers(resp.headers)
  respHeaders.delete('content-encoding')
  respHeaders.delete('content-length')
  respHeaders.delete('transfer-encoding')

  return new Response(resp.body, {
    status: resp.status,
    statusText: resp.statusText,
    headers: respHeaders,
  })
}
