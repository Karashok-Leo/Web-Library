import request from '@/utils/request';

export const getBookInfoList = () => request.get('/bookInfo');

export const getBookInfo = (bookId) => request.get('/bookInfo/' + bookId);