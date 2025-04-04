import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export const menuService = {
    getMenu: () => apiClient.get(ENDPOINTS.MENU),
    getFoodImage: (foodId: number) => apiClient.get(`${ENDPOINTS.MENU}/${foodId}`),
};