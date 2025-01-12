import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export const diningService = {
    getDiningHalls: () => apiClient.get(ENDPOINTS.DINING_HALLS),
};