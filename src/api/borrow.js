import request from "@/utils/request.js";
import { useUserStore } from '@/stores/user';

//借阅书籍
export const borrowBook = (book_id) => request.get('/qrcode', { responseType: 'blob', user_id: useUserStore().userInfo.user_id, book_id: book_id });

//获取借阅列表数据
export const borrowBooksListService = () => request.get('/borrowInfo');

//获取借阅列表数据
export const borrowBooksListByUserId = () => request.get('/borrowInfo/user/' + useUserStore().userInfo.user_id);

//修改借阅信息
export const editBorrowBooks = (id, data) => request.put('/borrowInfo/' + id, data);

//延期
export const updateReturnDate = (id,data) => request.put('/borrowInfo/' + id, data);

//还书
export const updateBorrowInfo = (id,data) => request.put('/borrowInfo/' + id, data);