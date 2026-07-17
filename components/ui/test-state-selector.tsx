'use client';

import * as React from 'react';
import { useSimulationStore, AppState, UserRole } from '@/lib/state-store';
import { Settings, ShieldAlert, UserCheck, Eye, Moon, Sun } from 'lucide-react';
import { Button } from './button';

export function TestStateSelector() {
  // Only render in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const { appState, userRole, setAppState, setUserRole } = useSimulationStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    // Initial sync
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 font-sans select-none">
      {isOpen && (
        <div className="w-64 rounded-xl border border-border bg-card/90 backdrop-blur-md p-4 shadow-xl text-card-foreground animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-border/80">
            <span className="font-semibold text-xs tracking-wider uppercase text-muted-foreground flex items-center gap-1.5">
              <Settings className="h-3.5 w-3.5" /> Simulation Console
            </span>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={toggleDarkMode}
              className="text-muted-foreground"
            >
              {isDarkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>
          </div>

          <div className="space-y-3.5">
            {/* UI States */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                UI State
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {(['normal', 'loading', 'empty', 'error'] as AppState[]).map((state) => (
                  <button
                    key={state}
                    onClick={() => setAppState(state)}
                    className={`px-2 py-1 text-xs rounded border text-center font-medium capitalize transition-all ${
                      appState === state
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-border bg-background hover:bg-muted text-foreground'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Roles */}
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                Simulated Auth Role
              </label>
              <div className="flex flex-col gap-1">
                {(['guest', 'user', 'admin'] as UserRole[]).map((role) => {
                  let Icon = Eye;
                  if (role === 'user') Icon = UserCheck;
                  if (role === 'admin') Icon = ShieldAlert;

                  return (
                    <button
                      key={role}
                      onClick={() => setUserRole(role)}
                      className={`flex items-center gap-2 px-2.5 py-1.5 text-xs rounded border font-medium capitalize transition-all w-full ${
                        userRole === role
                          ? 'bg-primary border-primary text-primary-foreground'
                          : 'border-border bg-background hover:bg-muted text-foreground'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{role}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="default"
        size="lg"
        className="rounded-full shadow-lg h-12 w-12 flex items-center justify-center bg-primary text-primary-foreground hover:scale-105 transition-transform"
      >
        <Settings className={`h-5 w-5 ${isOpen ? 'rotate-90' : ''} transition-transform duration-300`} />
      </Button>
    </div>
  );
}
