import axiosInstance from './axiosInstance';

export const sessionApi = {
  startExam: (examId) =>
    axiosInstance.post(`/api/exams/${examId}/start`).then(r => r.data),

  getSession: (sessionId) =>
    axiosInstance.get(`/api/sessions/${sessionId}`).then(r => r.data),

  saveAnswer: (sessionId, questionId, selectedAnswer) =>
    axiosInstance.patch(`/api/sessions/${sessionId}/answer`, {
      questionId,
      selectedAnswer,
    }).then(r => r.data),

  submitExam: (sessionId) =>
    axiosInstance.post(`/api/sessions/${sessionId}/submit`).then(r => r.data),

  getResult: (sessionId) =>
    axiosInstance.get(`/api/sessions/${sessionId}/result`).then(r => r.data),
};
