import request from '@/utils/request';

export const getCommentByBookId = (bookId) => request.get('/comment/book/' + bookId);

export const getCommentByUserId = (userId) => request.get('/comment/user/' + userId);

export const leaveComment = (data) => request.post('/comment', data);