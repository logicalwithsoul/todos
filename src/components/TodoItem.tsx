import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Todo, TodoStatus } from "../types";
import { formatDate, isOverdue } from "../utils/dateUtils";

interface TodoItemProps {
  todo: Todo;
  onStatusToggle: (id: string, currentStatus: TodoStatus) => void;
  onCheckToggle: (id: string) => void;
  showCompleted?: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onStatusToggle,
  onCheckToggle,
  showCompleted = true,
}) => {
  const getStatusText = (status: TodoStatus): string => {
    switch (status) {
      case "pending":
        return "예정";
      case "in_progress":
        return "진행중";
      case "completed":
        return "완료";
      default:
        return "예정";
    }
  };

  const getStatusColor = (status: TodoStatus): string => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "in_progress":
        return "#007AFF";
      case "completed":
        return "#34C759";
      default:
        return "#FFA500";
    }
  };

  const handleStatusPress = () => {
    if (todo.status === "completed") {
      onCheckToggle(todo.id);
    } else {
      const nextStatus = todo.status === "pending" ? "in_progress" : "pending";
      onStatusToggle(todo.id, nextStatus);
    }
  };

  const handleCheckPress = () => {
    onCheckToggle(todo.id);
  };

  // 완료된 항목이고 showCompleted가 false면 숨김
  if (todo.status === "completed" && !showCompleted) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.checkbox} onPress={handleCheckPress}>
        <View
          style={[
            styles.checkboxInner,
            todo.status === "completed" && styles.checked,
          ]}
        >
          {todo.status === "completed" && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.content} onPress={handleStatusPress}>
        <Text
          style={[
            styles.title,
            todo.status === "completed" && styles.completedTitle,
          ]}
        >
          {todo.title}
        </Text>

        {todo.due_date && (
          <Text
            style={[styles.dueDate, isOverdue(todo.due_date) && styles.overdue]}
          >
            {formatDate(todo.due_date)}
          </Text>
        )}

        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(todo.status) },
            ]}
          >
            <Text style={styles.statusText}>{getStatusText(todo.status)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  checked: {
    backgroundColor: "#007AFF",
  },
  checkmark: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  dueDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  overdue: {
    color: "#FF3B30",
    fontWeight: "500",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
  },
});
