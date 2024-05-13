import request from '@/utils/request';
import { useUserStore } from '@/stores/user';

//获取评论列表数据
export const getCommentsService = () => request.get('/comment');

export const getCommentByUserId = () => request.get('/comment/user/' + useUserStore().userInfo.user_id);

export const getCommentByBookId = (book_id) => request.get('/comment/book/' + book_id);

export const leaveComment = (content, bookId) => request.post('/comment', { content: content, book_id: bookId, user_id: useUserStore().userInfo.user_id });
//批量删除评论
export const deleteCommentByGroupService = (data) => request.delete('/comment', data);

//删除删除评论
export const deleteCommentService = (id) => request.delete('//comment/' + id);
