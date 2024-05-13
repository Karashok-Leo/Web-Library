import request from '@/utils/request';
import { useUserStore } from '@/stores/user';

export const getCommentByBookId = (bookId) => request.get('/comment/book/' + bookId);

export const getCommentByUserId = () => request.get('/comment/user/' + useUserStore().userInfo.user_id);

export const leaveComment = (content, bookId) => request.post('/comment', { content: content, book_id: bookId, user_id: useUserStore().userInfo.user_id });