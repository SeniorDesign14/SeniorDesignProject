import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

// Internal Server Error

export const nutritionalService = {
  getNutritionalInfo: (foodID: number) => 
    apiClient.get(ENDPOINTS.NUTRITIONAL_INFO + `/${foodID}`),
};