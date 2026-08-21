import { api } from "./api";
import { setSession, updateCurrentUser } from "@/src/stores/authStore";
import { Session, User } from "@/src/types/auth.types";
import { addNotification } from "@/src/stores/notificationStore";

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = LoginInput & {
  name: string;
  confirmPassword: string;
  role: User["role"];
  studentId?: string;
  staffId?: string;
  faculty?: string;
  department?: string;
  programme?: string;
  yearGroup?: string;
  awardType?: string;
};

type RegistrationResult = {
  user: User;
  message: string;
};

export const authService = {
  login: async (input: LoginInput) => {
    const session = await api<Session>("/auth/login", {
      method: "POST",
      auth: false,
      body: JSON.stringify(input),
    });
    setSession(session);
    addNotification("New device login", `Signed in as ${session.user.name}`);

    return session;
  },

  register: async (input: RegisterInput) => {
    return api<RegistrationResult>("/auth/register", {
      method: "POST",
      auth: false,
      body: JSON.stringify(input),
    });
  },

  googleLogin: async (idToken: string) => {
    const session = await api<Session>("/auth/google", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ idToken }),
    });
    setSession(session);
    return session;
  },

  completeGoogleProfile: async (input: Record<string, string>) => {
    const response = await api<{ user: User }>(
      "/auth/google/complete-profile",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
    );
    updateCurrentUser(response.user);
    return response.user;
  },

  forgotPassword: (email: string) =>
    api<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email }),
    }),

  verifyResetCode: (email: string, code: string) =>
    api<{ valid: boolean }>("/auth/verify-reset-code", {
      method: "POST",
      auth: false,
      body: JSON.stringify({ email, code }),
    }),

  resetPassword: (input: {
    email: string;
    code: string;
    password: string;
    confirmPassword: string;
  }) =>
    api<{ message: string }>("/auth/reset-password", {
      method: "POST",
      auth: false,
      body: JSON.stringify(input),
    }),

  me: async () => {
    const response = await api<{ user: User }>("/auth/me");
    updateCurrentUser(response.user);

    return response.user;
  },

  logout: async () => {
    await api<{ ok: boolean }>("/auth/logout", { method: "POST" }).catch(
      () => null,
    );
    setSession(null);
  },
};
