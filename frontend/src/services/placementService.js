import api from "./api";

export const fetchPlacements = () => api.get("/placements/").then(r => r.data);
export const fetchPlacementById = (id) => api.get(`/placements/${id}/`).then(r => r.data);
export const createPlacement = (data) => api.post("/placements/", data).then(r => r.data);