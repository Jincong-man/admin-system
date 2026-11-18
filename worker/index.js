/**
 * Cloudflare Workers（静态资源模式）入口
 *
 * 作用有两个：
 *  1. 把 /api/* 反向代理到后端（生产环境没有 Vite dev proxy，且后端是 http 明文）；
 *  2. 其余请求交给 dist 里的静态文件。
 */
const API_ORIGIN = 'http://ceshi13.dishait.cn'

async function proxyApi(request) {
  const url = new URL(request.url)

  // /api/goods/list?page=1  ->  http://ceshi13.dishait.cn/goods/list?page=1
  const targetUrl = API_ORIGIN + url.pathname.replace(/^\/api/, '') + url.search

  const headers = new Headers(request.headers)
  headers.delete('host')

  const hasBody = !['GET', 'HEAD'].includes(request.method)
  const body = hasBody ? await request.arrayBuffer() : undefined

  const resp = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
    redirect: 'manual',
  })

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

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) {
      try {
        return await proxyApi(request)
      } catch (e) {
        return new Response(JSON.stringify({ msg: '接口转发失败：' + e.message }), {
          status: 502,
          headers: { 'content-type': 'application/json; charset=utf-8' },
        })
      }
    }

    // 静态资源（dist 目录）
    return env.ASSETS.fetch(request)
  },
}
