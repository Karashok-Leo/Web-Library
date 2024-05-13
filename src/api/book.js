import request from '@/utils/request';

export const getBookInfoList = () => request.get('/bookInfo');

export const getBookInfo = (bookId) => request.get('/bookInfo/' + bookId);

export const getCategoryInfoList = () => request.get('/categoryInfo');

export const getCategoryInfo = (categoryId) => request.get('/categoryInfo/' + categoryId);