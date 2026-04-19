import type { ReactNode } from "react";
import {
  Home as HomeIcon,
  BookMarked,
  Settings as SettingsIcon,
  User,
  HelpCircle,
} from "lucide-react";
import { useUI, type Route } from "../lib/store";

type NavItem = { key: Route; label: string; Icon: typeof HomeIcon };

const nav: NavItem[] = [
  { key: "home", label: "Home", Icon: HomeIcon },
  { key: "settings", label: "Settings", Icon: SettingsIcon },
  { key: "account", label: "Account", Icon: User },
];

export function Shell({ children }: { children: ReactNode }) {
  const { route, setRoute } = useUI();

  return (
    <div className="h-full grid grid-cols-[240px_1fr] text-[var(--text)]">
      <aside className="flex flex-col justify-between border-r border-[var(--border)] bg-[var(--sidebar)] px-4 py-5">
        <div>
          <div className="flex items-center gap-2 px-2 mb-7">
            <div className="text-[17px] font-semibold tracking-tight">
              proof<span className="text-[var(--accent)]">·</span>red
            </div>
            <span className="text-[10.5px] px-2 py-[2px] rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text-soft)]">
              Basic
            </span>
          </div>

          <nav className="flex flex-col gap-[2px]">
            {nav.map(({ key, label, Icon }) => {
              const active = route === key;
              return (
                <button
                  key={key}
                  onClick={() => setRoute(key)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13.5px] transition-colors cursor-pointer ${
                    active
                      ? "bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]"
                      : "text-[var(--text-soft)] hover:bg-[var(--surface)]/60 border border-transparent"
                  }`}
                >
                  <Icon size={16} strokeWidth={1.75} />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-[2px]">
          <SidebarFoot Icon={BookMarked} label="Shortcut  ⌃⌃ (double-tap Control)" />
          <SidebarFoot Icon={HelpCircle} label="Help" />
        </div>
      </aside>

      <main className="h-full overflow-y-auto">
        <div className="max-w-[1100px] mx-auto px-10 pt-10 pb-20">{children}</div>
      </main>
    </div>
  );
}

function SidebarFoot({
  Icon,
  label,
}: {
  Icon: typeof HomeIcon;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 text-[12.5px] text-[var(--text-faint)]">
      <Icon size={15} strokeWidth={1.75} />
      <span>{label}</span>
    </div>
  );
}
