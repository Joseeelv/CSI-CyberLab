interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  role?: Role | string | number;
  roleId?: Role | string | number;
  points?: number;
}

interface Role {
  id: number;
  name: string;
}

export type { User };