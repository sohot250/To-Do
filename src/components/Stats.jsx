import { dueState } from "../dates";

export default function Stats({ todos }) {
  const total = todos.length;
  const done = todos.filter((t) => t.done).length;
  const overdue = todos.filter((t) => dueState(t.due, t.done) === "overdue").length;
  const active = total - done - overdue;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const segs = [
    ["เสร็จแล้ว", done, "var(--low-bar)"],
    ["กำลังทำ", active, "var(--accent)"],
    ["เลยกำหนด", overdue, "var(--high-bar)"],
  ];
  let offset = 0;

  return (
    <section className="card p-4" aria-label="สถิติ">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0" style={{ width: 84, height: 84 }}>
          <svg viewBox="0 0 36 36" width="84" height="84" role="img" aria-label={`เสร็จแล้ว ${pct}%`}>
            <circle cx="18" cy="18" r="15.9155" fill="none" stroke="var(--soft)" strokeWidth="4" />
            {total > 0 &&
              segs.map(([label, n, color]) => {
                const len = (n / total) * 100;
                const el = n > 0 && (
                  <circle
                    key={label}
                    cx="18" cy="18" r="15.9155" fill="none"
                    stroke={color} strokeWidth="4"
                    strokeDasharray={`${len} ${100 - len}`}
                    strokeDashoffset={25 - offset}
                  />
                );
                offset += len;
                return el;
              })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-lg">{pct}%</div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm" style={{ color: "var(--mute)" }}>
            ทั้งหมด <b style={{ color: "var(--ink)" }}>{total}</b> งาน
          </div>
          <ul className="list-none p-0 m-0 mt-1 text-sm">
            {segs.map(([label, n, color]) => (
              <li key={label} className="flex items-center gap-2">
                <span className="dot" style={{ background: color }} />
                <span style={{ color: "var(--mute)" }}>{label}</span>
                <b className="ml-auto">{n}</b>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
