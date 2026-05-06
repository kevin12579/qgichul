import axiosInstance from './axiosInstance';

export const noteApi = {
  getNotes: () =>
    axiosInstance.get('/api/notes').then(r => r.data),

  getNoteDetail: (questionId) =>
    axiosInstance.get(`/api/notes/${questionId}`).then(r => r.data),

  saveMemo: (questionId, memo) =>
    axiosInstance.post(`/api/notes/${questionId}/memo`, { memo }).then(r => r.data),

  updateMemo: (questionId, memo) =>
    axiosInstance.put(`/api/notes/${questionId}/memo`, { memo }).then(r => r.data),
};
