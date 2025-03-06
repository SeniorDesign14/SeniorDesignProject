import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export const menuService = {
    getMenu: () => apiClient.get(ENDPOINTS.MENU),
};