import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export const authService = {
    getCurrentUser: () => apiClient.get(ENDPOINTS.AUTH),
};