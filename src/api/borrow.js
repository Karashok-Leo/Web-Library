import request from '@/utils/request.js'

// 借书
export const borrowBook = (data) => request.post('/borrow', data);

// 还书
export const returnBook = (data) => request.post('/return', data);

// 获取借阅记录
export const getBorrowRecords = (data) => request.get('/borrow/record', { params: data });

// 延迟还书
export const delayReturnBook = (data) => request.post('/delay/return', data);