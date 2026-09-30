import { useRef, useState } from "react";
import { CheckCheck, Plus } from "lucide-react";
import TodoItem from "./components/TodoItem";
import { ORDER, PRI } from "./constants";

export default function App() {
  const nextId = useRef(4);
  const [todos, setTodos] = useState([
    { id: 1, text: "ส่งรายงานประจำสัปดาห์", done: false, priority: "high" },
    { id: 2, text: "ซื้อของเข้าบ้านที่ตลาด", done: false, priority: "medium" },
    { id: 3, text: "อ่านหนังสือ 20 หน้า", done: true, priority: "low" },
  ]);
  const [text, setText] = useState("");
  const [pri, setPri] = useState("medium");
  const [filter, setFilter] = useState("all");
  const [removing, setRemoving] = useState([]);

  const add = () => {
    const v = text.trim();
    if (!v) return;
    setTodos((t) => [{ id: nextId.current++, text: v, done: false, priority: pri }, ...t]);
    setText("");
  };
  const animateRemove = (ids) => {
    setRemoving((r) => [...r, ...ids]);
    setTimeout(() => {
      setTodos((t) => t.filter((x) => !ids.includes(x.id)));
      setRemoving((r) => r.filter((x) => !ids.includes(x)));
    }, 260);
  };
  const toggle = (id) => setTodos((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)));
  const save = (id, v) => setTodos((t) => t.map((x) => (x.id === id ? { ...x, text: v } : x)));
  const cycle = (id) =>
    setTodos((t) =>
      t.map((x) => (x.id === id ? { ...x, priority: ORDER[(ORDER.indexOf(x.priority) + 1) % 3] } : x))
    );

  const active = todos.filter((t) => !t.done).length;
  const doneCount = todos.length - active;
  const shown = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.done : t.done
  );
  const tabs = [
    ["all", "ทั้งหมด", todos.length],
    ["active", "ยังไม่เสร็จ", active],
    ["done", "เสร็จแล้ว", doneCount],
  ];
  const empty =
    filter === "done"
      ? "ยังไม่มีงานที่เสร็จ"
      : filter === "active"
      ? "ไม่มีงานค้าง เยี่ยมเลย!"
      : "ยังไม่มีงาน เพิ่มงานแรกด้านบนได้เลย";

  return (
    <main className="mx-auto w-full px-4 py-8 sm:py-14" style={{ maxWidth: 620 }}>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">งานของฉัน</h1>
      <p className="mb-6 text-sm" style={{ color: "var(--mute)" }}>
        ดับเบิลคลิกที่ข้อความเพื่อแก้ไข · คลิกป้ายเพื่อเปลี่ยนความสำคัญ
      </p>

      <section className="card p-4 mb-5">
        <div className="flex gap-2">
          <input
            className="input"
            value={text}
            maxLength={120}
            placeholder="เพิ่มงานใหม่…"
            aria-label="ชื่องานใหม่"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
          />
          <button className="btn-primary" onClick={add} disabled={!text.trim()}>
            <Plus size={18} />
            <span>เพิ่ม</span>
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="text-sm" style={{ color: "var(--mute)" }}>ความสำคัญ</span>
          <div className="seg">
            {ORDER.map((k) => (
              <button key={k} aria-pressed={pri === k} onClick={() => setPri(k)}>
                <span className={"dot d-" + k} />
                {PRI[k].label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="tabs mb-3" role="tablist">
        {tabs.map(([k, label, n]) => (
          <button key={k} role="tab" aria-selected={filter === k} onClick={() => setFilter(k)}>
            {label}
            <span className="n">{n}</span>
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <div className="card text-center py-10 px-4 mt-3" style={{ color: "var(--mute)" }}>
          {empty}
        </div>
      ) : (
        <ul className="list-none p-0 m-0 -mx-1.5">
          {shown.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              removing={removing.includes(t.id)}
              onToggle={toggle}
              onDelete={(id) => animateRemove([id])}
              onSave={save}
              onCycle={cycle}
            />
          ))}
        </ul>
      )}

      <footer
        className="flex items-center justify-between gap-3 mt-3 px-1 text-sm flex-wrap"
        style={{ color: "var(--mute)" }}
      >
        <span>
          เหลืออีก <b style={{ color: "var(--ink)" }}>{active}</b> งาน
        </span>
        <button
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-colors"
          style={{ opacity: doneCount ? 1 : 0.4, cursor: doneCount ? "pointer" : "not-allowed" }}
          disabled={!doneCount}
          onClick={() => animateRemove(todos.filter((t) => t.done).map((t) => t.id))}
        >
          <CheckCheck size={16} /> ล้างที่เสร็จแล้ว ({doneCount})
        </button>
      </footer>
    </main>
  );
}
