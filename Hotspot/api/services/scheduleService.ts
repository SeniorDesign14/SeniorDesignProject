import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export const scheduleService = {
    getSchedule: (hallid: string, date: string) => apiClient.get(ENDPOINTS.SCHEDULE + `/${hallid}/${date}`),
};