import request from '@/utils/request';

//获取评论列表数据
export const getTopCardsService = () => request.get('/report');