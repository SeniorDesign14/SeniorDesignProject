import { API_CONFIG } from "./config"

const apiClient = {
    request: async (endpoint: string, options: RequestInit = {}) => {
        const url = `${API_CONFIG.BASE_URL}${endpoint}`;
        const headers = {
            ...API_CONFIG.HEADERS,
            ...options.headers
        };
        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            if (!response.ok) {
                throw new Error(`HTTP error!: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    get: (endpoint: string) =>
        apiClient.request(endpoint, { method: 'GET' }),

    post: (endpoint: string, data: any) =>
        apiClient.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        }),
    
    put: (endpoint: string, data: any) =>
        apiClient.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
    
    delete: (endpoint: string) =>
        apiClient.request(endpoint, { method: 'DELETE' }),
};

export default apiClient;