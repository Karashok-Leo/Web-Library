import request from '@/utils/request.js'

//添加分类
export const addCategoryService = (data) =>request.post('/categories',categoryData);

//删除分类
export const delCategoryService = (id)=>request.delete('/categories/'+id);

//分类查询
export const categoryListService = () =>request.get('/categories');

//修改
export const editCategoryService=(DataObj)=>request.put(url);
