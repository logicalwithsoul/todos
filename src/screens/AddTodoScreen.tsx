import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { TodoFormData } from "../types";

interface AddTodoScreenProps {
  navigation: any;
  route: any;
}

function getLastDayOfWeek(year: number, week: number): string {
  // ISO week의 마지막 날짜(일요일) 반환
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const lastDay = new Date(simple);
  lastDay.setDate(simple.getDate() + (7 - dow));
  return lastDay.toISOString().split("T")[0];
}

function getLastDayOfMonth(year: number, month: number): string {
  // month: 1~12
  return new Date(year, month, 0).toISOString().split("T")[0];
}

export const AddTodoScreen: React.FC<AddTodoScreenProps> = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [duePeriod, setDuePeriod] = useState<
    "day" | "week" | "month" | "year" | "unspecified"
  >("day");
  const [dueDate, setDueDate] = useState<string>("");
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [modalVisible, setModalVisible] = useState(false);

  const periods = [
    { key: "day", label: "일" },
    { key: "week", label: "주" },
    { key: "month", label: "달" },
    { key: "year", label: "연" },
    { key: "unspecified", label: "미지정" },
  ];

  const handlePeriodChange = (
    period: "day" | "week" | "month" | "year" | "unspecified"
  ) => {
    setDuePeriod(period);
    setDueDate("");
  };

  // 달력에서 날짜 선택 (일)
  const handleDaySelect = (day: any) => {
    setDueDate(day.dateString);
    setCalendarVisible(false);
  };

  // 달력에서 주 선택 (주)
  const handleWeekSelect = (day: any) => {
    // day 객체에서 해당 주차 계산
    const date = new Date(day.dateString);
    const year = date.getFullYear();
    // ISO week number 계산
    const firstJan = new Date(date.getFullYear(), 0, 1);
    const days = Math.floor(
      (date.getTime() - firstJan.getTime()) / (24 * 60 * 60 * 1000)
    );
    const week = Math.ceil((days + firstJan.getDay() + 1) / 7);
    setSelectedWeek(week);
    setSelectedYear(year);
    setDueDate(getLastDayOfWeek(year, week));
    setCalendarVisible(false);
  };

  // 월 선택
  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month);
    setDueDate(getLastDayOfMonth(selectedYear, month));
    setCalendarVisible(false);
  };

  // 연도 선택
  const handleYearSelect = (year: number) => {
    setSelectedYear(year);
    setDueDate(`${year}-12-31`);
    setCalendarVisible(false);
  };

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("오류", "할 일 내용을 입력해주세요.");
      return;
    }
    if (title.length > 20) {
      Alert.alert("오류", "할 일 내용은 20글자를 초과할 수 없습니다.");
      return;
    }
    const todoData: TodoFormData = {
      title: title.trim(),
      due_period: duePeriod === "unspecified" ? undefined : duePeriod,
      due_date: dueDate || undefined,
    };
    navigation.navigate("Home", { newTodo: todoData });
  };

  // 연도 선택용 배열
  const years = Array.from(
    { length: 11 },
    (_, i) => new Date().getFullYear() - 5 + i
  );
  // 월 선택용 배열
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>새로운 할 일</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>할 일 내용</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="할 일을 입력하세요 (최대 20글자)"
            maxLength={20}
            multiline
          />
          <Text style={styles.charCount}>{title.length}/20</Text>
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>일정 단위</Text>
          <View style={styles.periodContainer}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.key}
                style={[
                  styles.periodButton,
                  duePeriod === period.key && styles.periodButtonActive,
                ]}
                onPress={() => handlePeriodChange(period.key as any)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    duePeriod === period.key && styles.periodButtonTextActive,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {duePeriod !== "unspecified" && (
          <View style={styles.inputGroup}>
            <Text style={styles.label}>마감일</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.dateButtonText}>
                {dueDate
                  ? duePeriod === "week"
                    ? `${selectedYear}년 ${selectedWeek}주차 (마감: ${dueDate})`
                    : duePeriod === "month"
                    ? `${selectedYear}년 ${selectedMonth}월 (마감: ${dueDate})`
                    : duePeriod === "year"
                    ? `${selectedYear}년 (마감: ${dueDate})`
                    : dueDate
                  : "날짜를 선택하세요"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* 달력/월/연도 선택 모달 */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {duePeriod === "day" && (
              <Calendar
                onDayPress={(day) => {
                  handleDaySelect(day);
                  setModalVisible(false);
                }}
                markedDates={dueDate ? { [dueDate]: { selected: true } } : {}}
              />
            )}
            {duePeriod === "week" && (
              <View>
                <Calendar
                  onDayPress={(day) => {
                    handleWeekSelect(day);
                    setModalVisible(false);
                  }}
                  markedDates={
                    dueDate
                      ? {
                          [dueDate]: {
                            selected: true,
                            selectedColor: "#007AFF",
                          },
                        }
                      : {}
                  }
                  markingType="period"
                />
                <Text style={{ textAlign: "center", marginTop: 8 }}>
                  원하는 주의 아무 날짜나 선택하세요
                </Text>
              </View>
            )}
            {duePeriod === "month" && (
              <View style={{ padding: 16 }}>
                <Text style={{ textAlign: "center", marginBottom: 8 }}>
                  월을 선택하세요
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {months.map((m) => (
                    <TouchableOpacity
                      key={m}
                      style={{
                        width: 60,
                        height: 40,
                        margin: 4,
                        borderRadius: 8,
                        backgroundColor:
                          selectedMonth === m ? "#007AFF" : "#eee",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        handleMonthSelect(m);
                        setModalVisible(false);
                      }}
                    >
                      <Text
                        style={{
                          color: selectedMonth === m ? "#fff" : "#333",
                          fontWeight: "bold",
                        }}
                      >
                        {m}월
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    marginTop: 12,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedYear(selectedYear - 1)}
                    style={{ marginHorizontal: 12 }}
                  >
                    <Text style={{ fontSize: 18 }}>◀</Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      marginHorizontal: 8,
                    }}
                  >
                    {selectedYear}년
                  </Text>
                  <TouchableOpacity
                    onPress={() => setSelectedYear(selectedYear + 1)}
                    style={{ marginHorizontal: 12 }}
                  >
                    <Text style={{ fontSize: 18 }}>▶</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {duePeriod === "year" && (
              <View style={{ padding: 16 }}>
                <Text style={{ textAlign: "center", marginBottom: 8 }}>
                  연도를 선택하세요
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {years.map((y) => (
                    <TouchableOpacity
                      key={y}
                      style={{
                        width: 80,
                        height: 40,
                        margin: 4,
                        borderRadius: 8,
                        backgroundColor:
                          selectedYear === y ? "#007AFF" : "#eee",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => {
                        handleYearSelect(y);
                        setModalVisible(false);
                      }}
                    >
                      <Text
                        style={{
                          color: selectedYear === y ? "#fff" : "#333",
                          fontWeight: "bold",
                        }}
                      >
                        {y}년
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeModalButtonText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    minHeight: 80,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
    marginTop: 4,
  },
  periodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#fff",
  },
  periodButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  periodButtonText: {
    fontSize: 14,
    color: "#666",
  },
  periodButtonTextActive: {
    color: "#fff",
    fontWeight: "500",
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    minWidth: 320,
    maxWidth: 400,
    alignSelf: "center",
    elevation: 8,
  },
  closeModalButton: {
    marginTop: 16,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingVertical: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  closeModalButtonText: {
    color: "#333",
    fontSize: 16,
  },
});
