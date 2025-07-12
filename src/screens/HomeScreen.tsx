import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert } from "react-native";
import { TodoSection } from "../components/TodoSection";
import { Todo, TodoStatus, TodoFormData } from "../types";
import { TodoService } from "../services/todoService";

interface HomeScreenProps {
  navigation: any;
  route: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  navigation,
  route,
}) => {
  const [todayTodos, setTodayTodos] = useState<Todo[]>([]);
  const [backlogTodos, setBacklogTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true); // 추가

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      const [today, backlog] = await Promise.all([
        TodoService.getTodayTodos(),
        TodoService.getBacklogTodos(),
      ]);
      setTodayTodos(today);
      setBacklogTodos(backlog);
    } catch (error) {
      console.error("Error loading todos:", error);
      Alert.alert("오류", "할 일을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  useEffect(() => {
    if (route.params?.newTodo) {
      handleCreateTodo(route.params.newTodo);
      // 파라미터 초기화
      navigation.setParams({ newTodo: undefined });
    }
  }, [route.params?.newTodo]);

  const handleCreateTodo = async (todoData: TodoFormData) => {
    try {
      const newTodo = await TodoService.createTodo(todoData);
      if (newTodo) {
        await loadTodos();
        Alert.alert("성공", "할 일이 생성되었습니다.");
      } else {
        Alert.alert("오류", "할 일 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error creating todo:", error);
      Alert.alert("오류", "할 일 생성에 실패했습니다.");
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: TodoStatus) => {
    try {
      const nextStatus =
        currentStatus === "pending" ? "in_progress" : "pending";
      const success = await TodoService.updateTodoStatus(id, nextStatus);
      if (success) {
        await loadTodos();
      } else {
        Alert.alert("오류", "상태 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating todo status:", error);
      Alert.alert("오류", "상태 변경에 실패했습니다.");
    }
  };

  const handleCheckToggle = async (id: string) => {
    try {
      const todo = [...todayTodos, ...backlogTodos].find((t) => t.id === id);
      if (!todo) return;

      const newStatus = todo.status === "completed" ? "pending" : "completed";
      const success = await TodoService.updateTodoStatus(id, newStatus);
      if (success) {
        await loadTodos();
      } else {
        Alert.alert("오류", "상태 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating todo status:", error);
      Alert.alert("오류", "상태 변경에 실패했습니다.");
    }
  };

  const handleAddTodo = () => {
    navigation.navigate("AddTodo");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>할 일 관리</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.todaySection}>
          <TodoSection
            title="오늘의 할 일"
            todos={todayTodos}
            onStatusToggle={handleStatusToggle}
            onCheckToggle={handleCheckToggle}
            showCompleted={showCompleted}
            onShowCompletedToggle={setShowCompleted}
          />
        </View>

        <View style={styles.backlogSection}>
          <TodoSection
            title="백로그"
            todos={backlogTodos}
            onStatusToggle={handleStatusToggle}
            onCheckToggle={handleCheckToggle}
            showCompleted={true}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.fab} onPress={handleAddTodo}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#007AFF",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  todaySection: {
    flex: 1,
    marginBottom: 8,
  },
  backlogSection: {
    flex: 1,
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
  },
});
