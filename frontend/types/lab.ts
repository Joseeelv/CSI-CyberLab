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

export type ActiveLabPanelProps = {
  activeLab: {
    startTime: number;
    duration: number;
    ip: string;
    url: string;
  };
  lab: {
    uuid: string;
    name: string;
  };
  onStop: () => void;
  user: {
    id: string;
    // agrega aquí otros campos de usuario si los necesitas
  } | null;
  onComplete?: (labUuid: string) => void;
};

export type FlagSubmission = {
  name: string;
  isCorrect: boolean;
  created: string;
};