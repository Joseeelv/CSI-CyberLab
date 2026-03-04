import type { User } from "./user";

export type UserLab = {
  id: string;
  userId: string;
  labId: string;
  user: User;
  lab?: {
    name: string;
  };
  score: number;
  progress: number;
  isFinished: boolean;
};
