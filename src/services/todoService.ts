import { supabase } from "./supabase";
import { Todo, TodoFormData, TodoStatus } from "../types";

export class TodoService {
  // 모든 할 일 가져오기
  static async getAllTodos(): Promise<Todo[]> {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching todos:", error);
      return [];
    }
  }

  // 오늘의 할 일 가져오기
  static async getTodayTodos(): Promise<Todo[]> {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .or(`due_date.eq.${today},due_period.eq.day`)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching today todos:", error);
      return [];
    }
  }

  // 백로그 할 일 가져오기 (오늘이 아닌 것들)
  static async getBacklogTodos(): Promise<Todo[]> {
    try {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .or(`due_date.gt.${today},due_date.is.null`)
        .neq("due_period", "day")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching backlog todos:", error);
      return [];
    }
  }

  // 새 할 일 생성
  static async createTodo(todoData: TodoFormData): Promise<Todo | null> {
    try {
      const { data, error } = await supabase
        .from("todos")
        .insert([todoData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating todo:", error);
      return null;
    }
  }

  // 할 일 상태 업데이트
  static async updateTodoStatus(
    id: string,
    status: TodoStatus
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating todo status:", error);
      return false;
    }
  }

  // 할 일 삭제
  static async deleteTodo(id: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting todo:", error);
      return false;
    }
  }

  // 할 일 수정
  static async updateTodo(
    id: string,
    todoData: Partial<TodoFormData>
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ ...todoData, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error updating todo:", error);
      return false;
    }
  }
}
