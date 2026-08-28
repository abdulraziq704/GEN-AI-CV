import { Link, NavLink } from "react-router";
import { FileStack, Moon, Sun } from "lucide-react";
import { Themecontext } from "../context/theme.context";
import { useContext } from "react";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from "@clerk/react";


const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/tool", label: "Tool" },
  { to: "/mycv", label: "My CVs" },

];

export default function Navbar() {
  const { theme, toggleTheme } = useContext(Themecontext);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex gap-4 items-center">
           <Link to={"/"} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileStack size={18} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-foreground">
            CareerAI
          </span>
        </Link>
           
        </div>
       

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
            prefetch="intent"
              key={item.to}
              to={item.to} 
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
         

          {/* placeholder avatar — replace with <UserButton afterSignOutUrl="/" /> */}
          <div className="flex items-center gap-4">
            <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
            <div />
            <Show when="signed-out">
              <SignInButton mode="modal" forceRedirectUrl="/tool">
                <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </button>
              </SignInButton>

              <SignUpButton mode="modal" forceRedirectUrl="/tool">
                <button className="text-sm cursor-pointer font-semibold bg-primary text-primary-foreground hover:bg-primary-hover px-5 py-2 rounded-xl shadow-sm transition-colors">
                  Register
                </button>
              </SignUpButton>
            </Show>

            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
        </div>
      </div>
    </header>
  );
}
