export interface Lab {
  uuid: string;
  name: string;
  description: string;
  difficulty: { id: number; name: string };
  category?: { id: number; name: string };
  operatingSystem: { id: number; name: string };
  points: number;
  estimatedTime: number; // in minutes
  tags: string[];
}

export interface ActiveLab {
  labId: string;
  startTime: number;
  duration: number; // in minutes
  ip: string;
  url: string;
}