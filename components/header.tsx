'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSimulationStore } from '@/lib/state-store';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { SearchBar } from './ui/search-bar';
import { ThemeToggle } from './ui/theme-toggle';
import {
  HelpCircle,
  Menu,
  X,
  PlusCircle,
  LayoutDashboard,
  ShieldCheck,
  Search,
  User,
  LogOut,
  Settings as SettingsIcon,
  BookOpen
} from 'lucide-react';

export function Header() {

  const router = useRouter();
  const pathname = usePathname();
  const { userRole, currentUser, setUserRole } = useSimulationStore();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  // Close menus on path changes
  React.useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const { signOut } = await import('firebase/auth');
      const { getFirebaseAuth } = await import('@/lib/firebase');
      await signOut(getFirebaseAuth());
    } catch (error) {
      console.error('Error signing out:', error);
    }
    setUserRole('guest');
    setProfileDropdownOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Main Navigation (Left) */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-tight text-black font-heading hover:opacity-90 transition-opacity">
              inter<span className='text-[#f95427] font-black'>Q</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-semibold tracking-wide h-full">
            <Link
              href="/questions"
              className={`transition-colors hover:text-primary h-16 flex items-center border-b-2 ${isActive('/questions') ? 'text-primary border-primary font-bold' : 'text-muted-foreground border-transparent'}`}
            >
              Questions
            </Link>
            <Link
              href="/bookmarks"
              className={`transition-colors hover:text-primary h-16 flex items-center border-b-2 ${isActive('/bookmarks') ? 'text-primary border-primary font-bold' : 'text-muted-foreground border-transparent'}`}
            >
              Bookmarks
            </Link>
          </nav>
        </div>

        {/* Action Controls (Right) */}
        <div className="flex items-center justify-end gap-4 relative">
          {/* Add Question Button */}
          <Link href="/questions/ask" className="hidden md:block">
            <Button size="sm" className="bg-primary hover:bg-primary/95 text-white font-bold rounded-lg px-4 flex items-center gap-1">
              <span>+</span> Add Question
            </Button>
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:block w-full max-w-[260px]">
            <SearchBar
              placeholder="Search questions..."
              onSearch={(value) => {
                const params = new URLSearchParams();

                if (value.trim()) {
                  params.set("search", value);
                }

                router.replace(
                  value.trim()
                    ? `/questions?${params.toString()}`
                    : "/questions",
                  {
                    scroll: false,
                  }
                );
              }}
            />
          </div>

          {/* Notifications */}
          {/* <button className="relative p-1.5 text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-md">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
          </button> */}

          {/* User Avatar */}
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
          >
            <Avatar
              src={currentUser?.avatarUrl}
              fallback={currentUser?.name || 'U'}
              className="h-8 w-8 hover:ring-2 hover:ring-primary/30 transition-all cursor-pointer"
            />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 top-12 mt-1 w-52 origin-top-right rounded-xl border border-border bg-card p-2 shadow-lg ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-border/60 mb-1">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="text-sm font-semibold truncate text-foreground">{currentUser?.name || 'Guest'}</p>
              </div>

              <div className="space-y-0.5">
                {userRole === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-muted text-amber-600 dark:text-amber-400 font-medium"
                  >
                    <ShieldCheck className="h-4 w-4" /> Admin Console
                  </Link>
                )}
                <Link
                  href="/profile"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-muted text-foreground"
                >
                  <User className="h-4 w-4" /> Profile
                </Link>
                <Link
                  href="/settings"
                  onClick={() => setProfileDropdownOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-muted text-foreground"
                >
                  <SettingsIcon className="h-4 w-4" /> Settings
                </Link>
                {userRole !== 'guest' ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-red-500/10 text-red-600 w-full text-left"
                  >
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg hover:bg-muted text-foreground w-full text-left"
                  >
                    <User className="h-4 w-4" /> Log in
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-muted-foreground hover:text-foreground focus:outline-none"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card px-4 py-4 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex-1">
              <SearchBar placeholder="Search questions..." />
            </div>
          </div>
          <nav className="flex flex-col gap-3 font-medium text-muted-foreground">
            <Link href="/questions" className={isActive('/questions') || isActive('/') ? 'text-foreground font-bold' : ''}>Questions</Link>
            <Link href="/bookmarks" className={isActive('/bookmarks') ? 'text-foreground font-bold' : ''}>Bookmarks</Link>

            {userRole !== 'guest' && (
              <>
                <div className="h-px bg-border my-1" />
                {userRole === 'admin' && (
                  <Link href="/admin" className="text-amber-600 dark:text-amber-400">Admin Dashboard</Link>
                )}
                <Link href="/settings">Settings</Link>
              </>
            )}
          </nav>

          <div className="pt-2 border-t border-border/60">
            {userRole === 'guest' ? (
              <div className="flex flex-col gap-2">
                <Link href="/auth/login" className="w-full">
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/auth/register" className="w-full">
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar fallback={currentUser?.name || 'U'} src={currentUser?.avatarUrl} className="h-9 w-9" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{currentUser?.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userRole} Role</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-1" /> Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
