import request from '@/utils/request.js'

//添加分类
export const addCategoryService = (data) =>request.post('/categoryInfo',data);

//删除分类
export const delCategoryService = (id)=>request.delete('/categoryInfo/'+id);

//分类查询
export const categoryListService = () =>request.get('/categoryInfo');

//修改
export const editCategoryService=(id,data)=>request.put('/categoryInfo/'+id,data);
