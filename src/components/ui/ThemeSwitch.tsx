import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ThemeSwitch() {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  // Toggle dark/light mode
  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark(!isDark);
  };

  return (
    <div className="fixed top-4 right-4 flex items-center space-x-3">
    <Label>{isDark ? "Dark Mode" : "Light Mode"}</Label>
            <Switch
            checked={isDark}
            onCheckedChange={toggleTheme}
            className="w-auto h-5"
            />
    </div>
  );
}

