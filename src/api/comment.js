import request from "@/utils/request.js";

//获取评论列表数据
export const getCommentsService=()=>request.get('/comment');

//批量删除评论
export const deleteCommentByGroupService=(data)=>request.delete('/comment',data);

//删除删除评论
export const deleteCommentService=(id)=>request.delete('//comment/'+id);
