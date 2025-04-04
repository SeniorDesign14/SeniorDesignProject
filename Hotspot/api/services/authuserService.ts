import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export const authuserService = {
    getCurrentUser: () => apiClient.get(ENDPOINTS.AUTHUSER),
};