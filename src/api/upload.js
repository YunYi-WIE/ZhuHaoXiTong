import request from '@/utils/request'

/**
 * 上传单张图片（需登录且服务端已启用 OSS），成功返回 { url }
 * @param {File|Blob} file
 * @param {string} [filename]
 */
export function uploadImageFile(file, filename) {
  const name =
    filename ||
    (typeof File !== 'undefined' && file instanceof File && file.name) ||
    'image.jpg'
  const fd = new FormData()
  fd.append('file', file, name)
  return request.post('/api/upload/image', fd, {
    timeout: 120000,
  })
}
