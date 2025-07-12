export interface Todo {
  id: string;
  title: string;
  status: "pending" | "in_progress" | "completed";
  due_date?: string;
  due_period?: "day" | "week" | "month" | "year" | "unspecified";
  created_at: string;
  updated_at: string;
}

export interface TodoFormData {
  title: string;
  due_date?: string;
  due_period?: "day" | "week" | "month" | "year" | "unspecified";
}

export type TodoStatus = "pending" | "in_progress" | "completed";

export interface TodoSection {
  title: string;
  todos: Todo[];
  showCompleted: boolean;
}
