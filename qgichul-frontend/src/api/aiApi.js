import axiosInstance from './axiosInstance';

const AI_TIMEOUT = 60000;

export const aiApi = {
  getHomeRecommend: () =>
    axiosInstance.get('/api/ai/home-recommend', { timeout: AI_TIMEOUT }).then(r => r.data),

  getAnalysis: () =>
    axiosInstance.get('/api/ai/analysis', { timeout: AI_TIMEOUT }).then(r => r.data),

  getGeneratedQuestions: () =>
    axiosInstance.get('/api/ai/generated-questions').then(r => r.data),

  generateQuestions: (count = 3) =>
    axiosInstance.post('/api/ai/generate-questions', { count }, { timeout: AI_TIMEOUT }).then(r => r.data),

  answerGeneratedQuestion: (id, selectedAnswer) =>
    axiosInstance.post(`/api/ai/generated-questions/${id}/answer`, { selectedAnswer }).then(r => r.data),
};
