import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

interface Favorited {
    // Define the properties of the Favorited object here
    netid: string,
    foodid: number,
    food: string,
    dininghallid: number
}

export const favoritedService = {
    getFavorited: (userid: string) => apiClient.get(ENDPOINTS.FAVORITE + `/${userid}`),
    postFavorited: (favorited: Favorited) => apiClient.post(ENDPOINTS.FAVORITE, favorited),
    deleteFavorited: (netid: string, foodid: number) => apiClient.delete(ENDPOINTS.FAVORITE + `/${netid}/${foodid}`),
    getTop5Favorited: () => apiClient.get(ENDPOINTS.FAVORITE + "/top5"),
};