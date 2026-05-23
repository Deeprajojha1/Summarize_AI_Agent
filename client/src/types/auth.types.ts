export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  githubUsername?: string;
  currentAddress?: string;
};

export type LoginPayload = { email: string; password: string };
export type SignupPayload = LoginPayload & { name: string };
