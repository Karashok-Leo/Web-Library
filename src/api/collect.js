import request from '@/utils/request'
import { useUserStore } from '@/stores/user';

export const getCollect = () => request.get('/collect/user/' + useUserStore().userInfo.user_id);

export const addCollect = (bookId) => request.post('/collect', { user_id: useUserStore().userInfo.user_id, book_id: bookId });

export const deleteCollect = (collect_id) => request.delete('/collect/' + collect_id);

export const deleteCollectList = (data) => request.delete('/collect', data);