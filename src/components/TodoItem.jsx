import { useRef, useState } from "react";
import { CalendarDays, Check, Pencil, Trash2 } from "lucide-react";
import { CATS, PRI } from "../constants";
import { dueState, fmtDate } from "../dates";

export default function TodoItem({ todo, removing, onToggle, onDelete, onSave, onCycle }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);
  const skip = useRef(false);

  const start = () => {
    setDraft(todo.text);
    setEditing(true);
  };
  const commit = () => {
    if (skip.current) {
      skip.current = false;
      setEditing(false);
      return;
    }
    const v = draft.trim();
    if (v && v !== todo.text) onSave(todo.id, v);
    setEditing(false);
  };

  const ds = dueState(todo.due, todo.done);
  const dueLabel = ds === "today" ? "วันนี้" : ds === "overdue" ? "เลยกำหนด " + fmtDate(todo.due) : todo.due && fmtDate(todo.due);
  const cat = CATS[todo.cat];

  return (
    <li className={"row" + (removing ? " row-out" : "")}>
      <div className="row-inner">
        <div className="card item">
          <span className={"bar d-" + todo.priority} />
          <button
            className="check"
            role="checkbox"
            aria-checked={todo.done}
            aria-label="ทำเครื่องหมายว่าเสร็จแล้ว"
            onClick={() => onToggle(todo.id)}
          >
            <Check size={15} strokeWidth={3} />
          </button>

          <div className="flex-1 min-w-0">
            {editing ? (
              <input
                className="input"
                autoFocus
                value={draft}
                maxLength={120}
                style={{ padding: "6px 10px" }}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                  if (e.key === "Escape") {
                    skip.current = true;
                    e.currentTarget.blur();
                  }
                }}
              />
            ) : (
              <span
                className={"txt" + (todo.done ? " done" : "")}
                onDoubleClick={start}
                title="ดับเบิลคลิกเพื่อแก้ไข"
              >
                {todo.text}
              </span>
            )}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
              <button
                className={"badge p-" + todo.priority}
                onClick={() => onCycle(todo.id)}
                title="คลิกเพื่อเปลี่ยนระดับความสำคัญ"
              >
                {PRI[todo.priority].label}
              </button>
              {cat && (
                <span className="text-xs inline-flex items-center gap-1.5" style={{ color: "var(--mute)" }}>
                  <span className="dot" style={{ background: cat.color }} />
                  {cat.label}
                </span>
              )}
              {ds && (
                <span className={"due due-" + ds}>
                  <CalendarDays size={12} />
                  {dueLabel}
                </span>
              )}
            </div>
          </div>

          {!editing && (
            <button className="icon-btn" onClick={start} aria-label="แก้ไข">
              <Pencil size={16} />
            </button>
          )}
          <button className="icon-btn del" onClick={() => onDelete(todo.id)} aria-label="ลบงาน">
            <Trash2 size={17} />
          </button>
        </div>
      </div>
    </li>
  );
}
