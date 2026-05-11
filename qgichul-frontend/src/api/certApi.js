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

  // 카테고리 목록
  getCategories: () =>
    axiosInstance.get('/api/certifications/categories').then(r => r.data),

  // 카테고리별 등급 목록
getGradesByCategory: (category) =>
  axiosInstance.get('/api/certifications/grades', { params: { category } }).then(r => r.data),

// 카테고리 + 등급으로 자격증 목록
getCertsByGrade: (category, grade) =>
  axiosInstance.get('/api/certifications/by-grade', { params: { category, grade } }).then(r => r.data),

// 카테고리별 전체 자격증 (fallback)
getCertificationsByCategory: (category) =>
  axiosInstance.get('/api/certifications/by-category', { params: { category } }).then(r => r.data),
};
