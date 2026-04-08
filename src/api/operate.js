import request from '@/utils/request'

export const getHomeBannerList = () => request.get('/api/operate/banner/list')

export const getHomeNavList = () => request.get('/api/operate/nav/list')

/** 首页租号/出租教程（图文） */
export const getHomeTutorialList = () => request.get('/api/operate/tutorial/list')

/** 首页账号列表排序 Tab（与大厅 sortType/sortDesc 一致） */
export const getHomeSortList = () => request.get('/api/operate/home-sort/list')

