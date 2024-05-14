import request from '@/utils/request'
import { useUserStore } from '@/stores/user';

export const getCollect = (user_id) => request.get('/collect/user/' + user_id);

export const addCollect = (book_id, user_id) => request.post('/collect', { user_id: user_id, book_id: book_id });

export const deleteCollect = (collect_id) => request.delete('/collect/' + collect_id);

export const deleteCollectList = (data) => request.delete('/collect', data);