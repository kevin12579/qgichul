import axiosInstance from './axiosInstance';

export const certApi = {
  getCertifications: () =>
    axiosInstance.get('/api/certifications').then(r => r.data),

  getCertification: (id) =>
    axiosInstance.get(`/api/certifications/${id}`).then(r => r.data),

  getExamsByCert: (certId) =>
    axiosInstance.get(`/api/certifications/${certId}/exams`).then(r => r.data),

  getExam: (examId) =>
    axiosInstance.get(`/api/exams/${examId}`).then(r => r.data),

  getExamQuestions: (examId) =>
    axiosInstance.get(`/api/exams/${examId}/questions`).then(r => r.data),
};
