interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  role?: string;
}

export type { User };