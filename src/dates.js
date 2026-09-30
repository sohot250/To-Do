const pad = (n) => String(n).padStart(2, "0");
const toStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const todayStr = () => toStr(new Date());
export const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return toStr(d);
};

// "overdue" | "today" | "later" | null (YYYY-MM-DD strings compare correctly)
export const dueState = (due, done) => {
  if (!due) return null;
  const t = todayStr();
  if (due === t) return "today";
  if (due < t && !done) return "overdue";
  return "later";
};

export const fmtDate = (s) =>
  new Date(s + "T00:00:00").toLocaleDateString("th-TH", { day: "numeric", month: "short" });
