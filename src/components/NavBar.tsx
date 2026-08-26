import { NavLink, useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { cn } from "../lib/cn";

const links = [
  { to: "/rallye", label: "Rallye", icon: "🎯" },
  { to: "/programme", label: "Programme", icon: "💻" },
  { to: "/praesentation", label: "Präsentation", icon: "🎬" },
];

export function NavBar() {
  const location = useLocation();
  // Hide the nav while inside a station – only "Rallye verlassen" is shown there.
  const inStation = /^\/rallye\/station\//.test(location.pathname);
  if (inStation) return null;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-ink-900/60 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <NavLink to="/" className="focus:outline-none">
          <Logo size="sm" />
        </NavLink>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-xl text-sm font-medium transition-all",
                  "flex items-center gap-2",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-ink-200 hover:text-white hover:bg-white/5"
                )
              }
            >
              <span aria-hidden>{l.icon}</span>
              <span className="hidden sm:inline">{l.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
