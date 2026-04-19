import { useEffect } from "react";
import { Shell } from "./components/Shell";
import { Home } from "./routes/Ledger";
import { Settings } from "./routes/Settings";
import { Account } from "./routes/Account";
import { useUI } from "./lib/store";
import { useProofs } from "./lib/useProofs";
import { registerHotkey } from "./lib/hotkey";

export default function App() {
  const route = useUI((s) => s.route);
  const load = useProofs((s) => s.load);

  useEffect(() => {
    load();
    registerHotkey();
  }, [load]);

  return (
    <Shell>
      {route === "home" && <Home />}
      {route === "settings" && <Settings />}
      {route === "account" && <Account />}
    </Shell>
  );
}
