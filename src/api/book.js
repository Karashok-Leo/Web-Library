import request from "@/utils/request.js";

//获取图书列表数据
export const getBooksService=()=>request.get('/bookInfo');

export const getBookInfo = (bookId) => request.get('/bookInfo/' + bookId);

export const getCategoryInfoList = () => request.get('/categoryInfo');

export const getCategoryInfo = (categoryId) => request.get('/categoryInfo/' + categoryId);

//编辑图书信息
export const editBookService=(id,data)=>request.put('/bookInfo/'+id,data);

//批量删除图书
export const deleteBookByGroupService=(data)=>request.delete('/bookInfo',data);

//删除图书
export const deleteBookService=(id)=>request.delete('/bookInfo/'+id);

//添加图书
export const bookAddService=(data)=>request.post('/bookInfo',data);
