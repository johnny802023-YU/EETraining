import {
  Activity,
  BookOpenCheck,
  Bug,
  Car,
  Cpu,
  Gauge,
  LayoutDashboard,
  Network,
  ClipboardList,
  Search,
  Wrench,
  Zap,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/components", label: "元件資料庫", icon: Cpu },
  { to: "/circuits", label: "電路基礎", icon: Zap },
  { to: "/protocols", label: "通訊協定", icon: Network },
  { to: "/debug", label: "FA Debug", icon: Bug },
  { to: "/automotive", label: "車用系統", icon: Car },
  { to: "/tools", label: "量測工具", icon: Wrench },
  { to: "/quiz", label: "Quiz 測驗", icon: BookOpenCheck },
  { to: "/records", label: "學習紀錄", icon: ClipboardList },
];

const progressItems = [
  { section: "components", label: "元件" },
  { section: "circuits", label: "電路" },
  { section: "protocols", label: "通訊" },
  { section: "debug", label: "Debug" },
  { section: "automotive", label: "車用" },
  { section: "tools", label: "工具" },
];

export default function Sidebar({ searchQuery, setSearchQuery, progress }) {
  return (
    <aside className="z-20 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur md:fixed md:inset-y-0 md:left-0 md:w-72 md:border-b-0 md:border-r md:px-5 md:py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-white">
          <Gauge className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-navy-900">EE 基礎訓練平台</p>
          <p className="text-xs text-slate-500">For EE Training</p>
        </div>
      </div>

      <label className="mt-5 flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 transition focus-within:border-navy-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-navy-100">
        <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="h-full w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
          placeholder="搜尋元件、電路、協定、案例、車用、工具"
          type="search"
        />
      </label>

      <nav className="mt-5 grid grid-cols-2 gap-2 md:grid-cols-1" aria-label="Main navigation">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                "focus-ring flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition",
                isActive
                  ? "bg-navy-900 text-white shadow-card"
                  : "text-slate-600 hover:bg-slate-100 hover:text-navy-900",
              ].join(" ")
            }
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 hidden rounded-lg border border-slate-200 bg-white p-4 shadow-card md:block">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase text-slate-500">Learning Progress</p>
            <p className="mt-1 text-3xl font-semibold text-navy-900">{progress.percent}%</p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>{progress.completed}</p>
            <p>/ {progress.total}</p>
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-signal-green transition-all"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <div className="mt-4 space-y-3">
          {progressItems.map((item) => {
            const section = progress.getSectionProgress(item.section);
            return (
              <div key={item.section} className="grid grid-cols-[3rem_1fr_2.5rem] items-center gap-2 text-xs">
                <span className="font-medium text-slate-600">{item.label}</span>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-navy-500"
                    style={{ width: `${section.percent}%` }}
                  />
                </div>
                <span className="text-right text-slate-500">{section.percent}%</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-5 hidden rounded-lg border border-cyan-100 bg-cyan-50 p-4 text-sm text-cyan-950 md:block">
        <div className="flex items-center gap-2 font-semibold">
          <Activity className="h-4 w-4" aria-hidden="true" />
          Training Focus
        </div>
        <p className="mt-2 leading-6 text-cyan-900">
          從元件規格、量測點與故障模式開始，建立可重複的 EE debug 思維。
        </p>
      </div>
    </aside>
  );
}
