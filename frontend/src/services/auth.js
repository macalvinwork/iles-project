import api from "./api";

export const loginUser = async (email, password) => {
  const response = await api.post("/login/", {
    email,
    password,
  });

  if (response.data.access) {
    localStorage.setItem("token", response.data.access);
  }

  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};

export const getToken = () => {
  return localStorage.getItem("token");
};