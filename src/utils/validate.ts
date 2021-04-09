/**
 * 校验地址路径是否是一个外部路径
 * @param {string} path 路径
 * @returns {Boolean} 是否是外部路径
 */
export function isExternal (path: string): boolean {
  return /^(https?:|mailto:|tel:)/.test(path)
}
