import { useState, useEffect, Profiler } from "react";
import { cn } from "../lib/utils"; 
import { Button } from "./ui/button";
import { Home, Settings, Menu, X, Contact, LayoutDashboard, User } from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("sidebarCollapsed") === "true";
    }
    return false; // Default: Expanded
  });

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  return (
    <div
      className={cn(
        "h-screen bg-background dark:bg-gray-900 shadow-md p-7 flex flex-col transition-all duration-300",
        collapsed ? "w-24" : "w-44"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between mb-5">
        <Button
          variant="ghost"
          size="icon"
          className="mb-6"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu className=" h-5 w-5" /> : <X className="h-5 w-5" />}
        </Button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex flex-col space-y-3">
        <a
          href="/Home"
          className={cn(
            "flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition",
            collapsed && "justify-center"
          )}
        >
          <Home className="h-7 w-7" />
          {!collapsed && <span>Home</span>}
        </a>
        <a
          href="/user"
          className={cn(
            "flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition",
            collapsed && "justify-center"
          )}
        >
          < User className="h-7 w-7" />
          {!collapsed && <span>Profile</span>}
        </a>
        <a
          href="/dashboard"
          className={cn(
            "flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition",
            collapsed && "justify-center"
          )}
        >
          < LayoutDashboard className="h-7 w-7" />
          {!collapsed && <span>Dashboard</span>}
        </a>
        <a
          href="/contact"
          className={cn(
            "flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition",
            collapsed && "justify-center"
          )}
        >
          <Contact className="h-7 w-7" />
          {!collapsed && <span>Contact</span>}
        </a>
        <a
          href="/settings"
          className={cn(
            "flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition",
            collapsed && "justify-center"
          )}
        >
          <Settings className="h-7 w-7" />
          {!collapsed && <span>Settings</span>}
        </a>
        
      </nav>
    </div>
  );
};

export default Sidebar;
