import request from '@/utils/request'

/** C 端：站点名称与 Logo（无需登录） */
export const getSiteBranding = () => request.get('/api/site/branding')
