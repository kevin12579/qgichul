import axiosInstance from './axiosInstance';

const params = (certId) => (certId ? { params: { certId } } : {});

export const statsApi = {
  getSummary: (certId) =>
    axiosInstance.get('/api/stats/summary', params(certId)).then(r => r.data),

  getSubjectStats: (certId) =>
    axiosInstance.get('/api/stats/subjects', params(certId)).then(r => r.data),

  getUnitStats: (certId) =>
    axiosInstance.get('/api/stats/units', params(certId)).then(r => r.data),

  getHistory: (certId) =>
    axiosInstance.get('/api/stats/history', params(certId)).then(r => r.data),

  getCertsTaken: () =>
    axiosInstance.get('/api/stats/cert-list').then(r => r.data),
};
