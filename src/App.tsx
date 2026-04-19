import { Shell } from "./components/Shell";
import { Home } from "./routes/Ledger";
import { Settings } from "./routes/Settings";
import { Account } from "./routes/Account";
import { useUI } from "./lib/store";

export default function App() {
  const route = useUI((s) => s.route);
  return (
    <Shell>
      {route === "home" && <Home />}
      {route === "settings" && <Settings />}
      {route === "account" && <Account />}
    </Shell>
  );
}
