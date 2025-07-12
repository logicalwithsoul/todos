export const getDefaultDueDate = (
  period: "day" | "week" | "month" | "year" | "unspecified"
): string => {
  const today = new Date();

  switch (period) {
    case "day":
      return today.toISOString().split("T")[0];
    case "week":
      const weekFromNow = new Date(today);
      weekFromNow.setDate(today.getDate() + 7);
      return weekFromNow.toISOString().split("T")[0];
    case "month":
      const monthFromNow = new Date(today);
      monthFromNow.setMonth(today.getMonth() + 1);
      return monthFromNow.toISOString().split("T")[0];
    case "year":
      const yearFromNow = new Date(today);
      yearFromNow.setFullYear(today.getFullYear() + 1);
      return yearFromNow.toISOString().split("T")[0];
    default:
      return "";
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const isToday = (dateString: string): boolean => {
  const today = new Date().toISOString().split("T")[0];
  return dateString === today;
};

export const isOverdue = (dateString: string): boolean => {
  const today = new Date().toISOString().split("T")[0];
  return dateString < today;
};
