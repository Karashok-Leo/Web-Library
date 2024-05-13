import request from "@/utils/request.js";

//获取借阅列表数据
export const borrowBooksListService=()=>request.get('/borrowInfo');

//修改借阅信息
export const editBorrowBooks=(id,data)=>request.put('/borrowInfo/'+id,data);
