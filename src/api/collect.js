import request from '@/utils/request'

export const getCollect = (userId) => request.get('/collect/' + userId);

export const addCollect = (data) => request.post('/collect', data);

export const deleteCollect = (id) => request.delete('/collect/' + id);

export const deleteCollectList = (data) => request.delete('/deleteCollectList', { data });