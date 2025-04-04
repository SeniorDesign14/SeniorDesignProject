import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

export const scheduleService = {
    getSchedule: (hallid: string, date: string) => apiClient.get(ENDPOINTS.SCHEDULE + `/${hallid}/${date}`),
    getScheduleRange: (startDate: string, endDate: string) => apiClient.get(ENDPOINTS.SCHEDULE + `/range/${startDate}/${endDate}`),
};