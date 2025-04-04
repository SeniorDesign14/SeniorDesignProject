import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

const gptService = {
  sendQuestion: (question: string) =>
    apiClient.post(ENDPOINTS.GPT, { question }),
};

export default gptService;