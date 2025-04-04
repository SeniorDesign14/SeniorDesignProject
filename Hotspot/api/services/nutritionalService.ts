import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export const nutritionalService = {
    getNutritional: (foodid: string) => apiClient.get(ENDPOINTS.NUTRITIONAL + `/${foodid}`),
};