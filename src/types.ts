export type Status = "active" | "completed" | "deleted";

export interface Task {
  id: number;
  text: string;
  status: Status;
}
