interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  role?: string;
  points?: number;
}

export type { User };