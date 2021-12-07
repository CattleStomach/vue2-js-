// 提供cookie操作的方法（简化）
import Cookies from 'js-cookie'

/**
 * 前端本地存储方案 =》一直在
 * 1. localStorage
 *   大小：5M
 * 2. sessionStorage =》浏览器关闭存储数据就丢了
 *   大小：5M
 *
 * 3. cookie =》设置过期时间
 *   大小：4KB
 */

// 存储cookie的key
const TokenKey = 'hr-admin-token-129'

// 从本地cookie根据key获取token
export function getToken () {
  return Cookies.get(TokenKey)
}

// 存储token
export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

// 删除token
export function removeToken () {
  return Cookies.remove(TokenKey)
}
