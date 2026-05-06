import axiosInstance from "./axiosInstance";

export const authApi = {
    //회원가입
    signup: async (userData) => {
        const response = await axiosInstance.post("/api/auth/signup", userData);
        return response.data;
    },
    //로그인
    login: async (credentials) => {
        const response = await axiosInstance.post(
            "/api/auth/login",
            credentials,
        );
        return response.data;
    },
    // 내 정보 조회 (토큰 유효성 확인용)
    getMe: async () => {
        const response = await axiosInstance.get("/api/auth/me");
        return response.data;
    },
};
