import api from "./api";

export const fetchUsers = () => api.get("/auth/users/").then(r => r.data);
export const fetchDashboard = () => api.get("/auth/dashboard/").then(r => r.data);
export const registerUser = (data) => api.post("/auth/register/", data).then(r => r.data);