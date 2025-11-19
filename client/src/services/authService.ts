import api from "./api";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  login: async (data: LoginPayload) => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  register: async (data: RegisterPayload) => {
    const res = await api.post("/auth/register", data);
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("authToken");
  },
};
