import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, ScrollView } from "react-native";
import { Todo, TodoStatus } from "../types";
import { TodoItem } from "./TodoItem";
import { Calendar } from "react-native-calendars";

interface TodoSectionProps {
  title: string;
  todos: Todo[];
  onStatusToggle: (id: string, currentStatus: TodoStatus) => void;
  onCheckToggle: (id: string) => void;
  showCompleted: boolean;
  onShowCompletedToggle?: (value: boolean) => void;
}

export const TodoSection: React.FC<TodoSectionProps> = ({
  title,
  todos,
  onStatusToggle,
  onCheckToggle,
  showCompleted,
  onShowCompletedToggle,
}) => {
  const activeTodos = todos.filter((todo) => todo.status !== "completed");
  const completedTodos = todos.filter((todo) => todo.status === "completed");

  const [calendarMode, setCalendarMode] = useState<
    "date" | "week" | "month" | "year"
  >("date");

  // 일정 단위 변경 시
  const handlePeriodChange = (period) => {
    // setDuePeriod(period); // This state is not defined in the original file
    if (period === "day") setCalendarMode("date");
    else if (period === "week") setCalendarMode("week");
    else if (period === "month") setCalendarMode("month");
    else if (period === "year") setCalendarMode("year");
    // ...
  };

  // 달력에서 날짜/주/월/연도 선택 시
  const handleCalendarSelect = (dateOrPeriod) => {
    if (calendarMode === "date") {
      // setDueDate(dateOrPeriod); // This state is not defined in the original file
    } else if (calendarMode === "week") {
      // dateOrPeriod: {year, week}
      // week의 마지막 날짜 계산
      // const lastDay = getLastDayOfWeek(dateOrPeriod.year, dateOrPeriod.week); // This function is not defined in the original file
      // setDueDate(lastDay); // YYYY-MM-DD
    } else if (calendarMode === "month") {
      // dateOrPeriod: {year, month}
      // const lastDay = getLastDayOfMonth(dateOrPeriod.year, dateOrPeriod.month); // This function is not defined in the original file
      // setDueDate(lastDay); // YYYY-MM-DD
    } else if (calendarMode === "year") {
      // dateOrPeriod: {year}
      // setDueDate(`${dateOrPeriod.year}-12-31`); // This state is not defined in the original file
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {onShowCompletedToggle && (
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>완료된 일 숨기기</Text>
            <Switch
              value={!showCompleted}
              onValueChange={(v) => onShowCompletedToggle(!v)}
              trackColor={{ false: "#E5E5E5", true: "#007AFF" }}
              thumbColor={showCompleted ? "#fff" : "#fff"}
            />
          </View>
        )}
      </View>
      {/* ... */}
      <ScrollView style={styles.todoList}>
        {activeTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onStatusToggle={onStatusToggle}
            onCheckToggle={onCheckToggle}
            showCompleted={showCompleted}
          />
        ))}
        {showCompleted && completedTodos.length > 0 && (
          <View style={styles.completedSection}>
            <Text style={styles.completedTitle}>완료된 일</Text>
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onStatusToggle={onStatusToggle}
                onCheckToggle={onCheckToggle}
                showCompleted={showCompleted}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleLabel: {
    fontSize: 12,
    color: "#666",
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  todoList: {
    flex: 1,
  },
  completedSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  completedTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
});
