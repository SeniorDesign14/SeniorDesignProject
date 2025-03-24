import apiClient from "../client";
import { ENDPOINTS } from "../endpoints";

interface Favorited {
    // Define the properties of the Favorited object here
    userid: number,
    foodid: number,
    food: string,
    dininghallid: number
}

export const favoritedService = {
    getFavorited: (userid: string) => apiClient.get(ENDPOINTS.FAVORITE + `/${userid}`),
    postFavorited: (favorited: Favorited) => apiClient.post(ENDPOINTS.FAVORITE, favorited),
    // deleteFavorited: (favorited: Favorited) => apiClient.delete(ENDPOINTS.FAVORITED, favorited),
};