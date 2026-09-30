import { useRef, useState } from "react";
import { CheckCheck, Plus, Search } from "lucide-react";
import TodoItem from "./components/TodoItem";
import Stats from "./components/Stats";
import { CATS, CAT_KEYS, ORDER, PRI } from "./constants";
import { addDays } from "./dates";

export default function App() {
  const nextId = useRef(6);
  const [todos, setTodos] = useState([
    { id: 1, text: "ส่งรายงานประจำสัปดาห์", done: false, priority: "high", cat: "work", due: addDays(-1) },
    { id: 2, text: "ซื้อของเข้าบ้านที่ตลาด", done: false, priority: "medium", cat: "shopping", due: addDays(0) },
    { id: 3, text: "อ่านหนังสือ 20 หน้า", done: true, priority: "low", cat: "personal", due: "" },
    { id: 4, text: "ไปวิ่งสวนสาธารณะ", done: false, priority: "medium", cat: "health", due: addDays(2) },
    { id: 5, text: "เตรียมสไลด์ประชุมทีม", done: false, priority: "high", cat: "work", due: addDays(3) },
  ]);
  const [text, setText] = useState("");
  const [pri, setPri] = useState("medium");
  const [cat, setCat] = useState("personal");
  const [due, setDue] = useState("");
  const [filter, setFilter] = useState("all");
  const [catFilter, setCatFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [removing, setRemoving] = useState([]);

  const add = () => {
    const v = text.trim();
    if (!v) return;
    setTodos((t) => [{ id: nextId.current++, text: v, done: false, priority: pri, cat, due }, ...t]);
    setText("");
    setDue("");
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

  const q = query.trim().toLowerCase();
  const base = todos.filter(
    (t) => (catFilter === "all" || t.cat === catFilter) && (!q || t.text.toLowerCase().includes(q))
  );
  const shown = base.filter((t) => (filter === "all" ? true : filter === "active" ? !t.done : t.done));
  const active = todos.filter((t) => !t.done).length;
  const doneCount = todos.length - active;
  const baseDone = base.filter((t) => t.done).length;
  const tabs = [
    ["all", "ทั้งหมด", base.length],
    ["active", "ยังไม่เสร็จ", base.length - baseDone],
    ["done", "เสร็จแล้ว", baseDone],
  ];
  const empty = q
    ? "ไม่พบงานที่ตรงกับคำค้นหา"
    : filter === "done"
    ? "ยังไม่มีงานที่เสร็จ"
    : filter === "active"
    ? "ไม่มีงานค้าง เยี่ยมเลย!"
    : "ยังไม่มีงาน เพิ่มงานแรกด้านบนได้เลย";

  const catList = [["all", { label: "ทั้งหมด", color: "var(--mute)" }], ...Object.entries(CATS)];

  return (
    <main className="mx-auto w-full px-4 py-8 sm:py-12" style={{ maxWidth: 880 }}>
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">งานของฉัน</h1>
      <p className="mb-6 text-sm" style={{ color: "var(--mute)" }}>
        ดับเบิลคลิกที่ข้อความเพื่อแก้ไข · คลิกป้ายเพื่อเปลี่ยนความสำคัญ
      </p>

      <div className="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)] items-start">
        <aside className="grid gap-4 md:sticky md:top-4">
          <Stats todos={todos} />
          <nav className="cats" aria-label="หมวดหมู่">
            {catList.map(([k, c]) => (
              <button key={k} className="cat-btn" aria-pressed={catFilter === k} onClick={() => setCatFilter(k)}>
                <span className="dot" style={{ background: c.color }} />
                {c.label}
                <span className="cnt">
                  {k === "all" ? todos.length : todos.filter((t) => t.cat === k).length}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          <section className="card p-4 mb-4">
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
            <div className="field">
              <span>ความสำคัญ</span>
              <div className="seg">
                {ORDER.map((k) => (
                  <button key={k} aria-pressed={pri === k} onClick={() => setPri(k)}>
                    <span className={"dot d-" + k} />
                    {PRI[k].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <span>หมวดหมู่</span>
              <div className="seg">
                {CAT_KEYS.map((k) => (
                  <button key={k} aria-pressed={cat === k} onClick={() => setCat(k)}>
                    <span className="dot" style={{ background: CATS[k].color }} />
                    {CATS[k].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="field">
              <span>กำหนดส่ง</span>
              <input
                type="date"
                className="input"
                style={{ width: "auto", padding: "6px 12px" }}
                value={due}
                onChange={(e) => setDue(e.target.value)}
                aria-label="วันที่กำหนดส่ง"
              />
            </div>
          </section>

          <div className="relative mb-3">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--mute)" }} />
            <input
              className="input"
              style={{ paddingLeft: 38, background: "var(--card)", boxShadow: "var(--shadow)" }}
              placeholder="ค้นหางาน…"
              aria-label="ค้นหางาน"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

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
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5"
              style={{ opacity: doneCount ? 1 : 0.4, cursor: doneCount ? "pointer" : "not-allowed" }}
              disabled={!doneCount}
              onClick={() => animateRemove(todos.filter((t) => t.done).map((t) => t.id))}
            >
              <CheckCheck size={16} /> ล้างที่เสร็จแล้ว ({doneCount})
            </button>
          </footer>
        </div>
      </div>
    </main>
  );
}
