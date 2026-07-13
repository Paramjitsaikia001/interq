'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '@/lib/state-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { Lock, AtSign, ShieldCheck } from 'lucide-react';

import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { loginWithGoogle } from '@/lib/auth-client';

export default function Login() {
  const router = useRouter();
  const { setUserRole } = useSimulationStore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Dynamically hide the header and footer when visiting the login page
  React.useEffect(() => {
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');
    
    let originalMainClasses = '';
    
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (main) {
      originalMainClasses = main.className;
      // Make main occupy the full screen and remove limits/paddings
      main.className = 'flex-1 w-full flex flex-col min-h-screen p-0 m-0 max-w-none';
    }
    
    return () => {
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
      if (main) main.className = originalMainClasses;
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/questions');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push('/questions');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Google sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = () => {
    setUserRole('admin');
    router.push('/admin');
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col md:flex-row w-full font-sans bg-white">
      <StateWrapper>
        {/* Left Pane - Branding & Grid Graphic Background */}
        <div 
          className="hidden md:flex md:w-[45%] flex-col justify-between p-12 lg:p-16 relative overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px)`,
            backgroundSize: '24px 24px',
            backgroundColor: '#0B132A',
          }}
        >
          {/* Top Logo */}
          <div className="z-10 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-black border border-[#D97706] flex flex-col items-center justify-center p-0.5 shadow-md">
              <span className="text-[7px] leading-[7px] font-bold text-[#F59E0B] tracking-tighter font-mono">int</span>
              <span className="text-[7px] leading-[7px] font-bold text-[#F59E0B] tracking-tighter font-mono -mt-0.5">erQ</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans">
              interQ
            </span>
          </div>

          {/* Core Intro Text */}
          <div className="z-10 max-w-lg my-auto py-12 flex flex-col">
            <h1 className="text-[44px] lg:text-[48px] font-extrabold tracking-tight text-white leading-[1.1] font-sans">
              Built for the next <br /> generation of <br /> engineers.
            </h1>

            <p className="text-sm text-[#8fa0bd] mt-6 max-w-md font-sans leading-relaxed">
              Access the most comprehensive dataset for precision engineering and technical community insights.
            </p>
          </div>

          {/* Left Footer/Status */}
          <div className="z-10 flex items-center">
            <span className="relative flex h-2 w-2 mr-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF8A65] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF8A65]"></span>
            </span>
            <span className="text-[10px] font-bold font-mono text-[#8fa0bd] tracking-widest uppercase">
              Network Operational
            </span>
          </div>
        </div>

        {/* Right Pane - Sign In Form */}
        <div className="w-full md:w-[55%] min-h-screen flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 lg:p-20 bg-white">
          <div className="max-w-[420px] w-full flex flex-col space-y-6">
            
            {/* Title Header */}
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#191b23] font-sans">
                Sign In
              </h2>
              <p className="text-sm text-[#565e74] mt-2 font-sans">
                Welcome back! Please enter your details.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 text-red-600 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              
              {/* Google Button */}
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full h-11 border border-border/80 hover:bg-[#fafbff] bg-white text-sm font-medium flex items-center justify-center gap-2.5 rounded-lg shadow-sm font-mono text-[#191b23]"
                disabled={loading}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              {/* Separator */}
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-[#e2e8f5]"></div>
                <span className="flex-shrink mx-4 text-[10px] font-bold font-mono text-[#a3a6b8] tracking-wider uppercase">OR</span>
                <div className="flex-grow border-t border-[#e2e8f5]"></div>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                
                {/* Email Address */}
                <div>
                  <label className="text-[11px] font-bold font-mono text-[#191b23] uppercase tracking-wider block mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-3 h-4 w-4 text-[#a3a6b8]" />
                    <Input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 border border-border/80 focus-visible:ring-1 focus-visible:ring-[#0047D4] focus-visible:border-[#0047D4] rounded-lg font-sans text-sm pl-10 pr-4 bg-[#fafbff] text-[#191b23]"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <label className="text-[11px] font-bold font-mono text-[#191b23] uppercase tracking-wider">
                      Password
                    </label>
                    <Link href="/auth/forgot-password" className="text-[10px] font-bold font-mono text-[#0047D4] hover:underline uppercase">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-[#a3a6b8]" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 border border-border/80 focus-visible:ring-1 focus-visible:ring-[#0047D4] focus-visible:border-[#0047D4] rounded-lg font-sans text-sm pl-10 pr-4 bg-[#fafbff] text-[#191b23]"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#0047D4] hover:bg-[#003cb3] text-white font-bold font-mono text-xs uppercase tracking-wider rounded-lg shadow-sm mt-2"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* Sign Up Link */}
              <div className="text-center text-xs text-[#565e74] pt-2">
                Don't have an account?{' '}
                <Link href="/auth/register" className="font-bold text-[#0047D4] hover:underline">
                  Sign up
                </Link>
              </div>

              {/* Admin Shortcut Quick Login */}
              <div className="h-px bg-border/60 w-full my-4" />
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleAdminLogin} 
                className="w-full border-amber-500/30 text-amber-600 hover:bg-amber-500/10 flex items-center justify-center gap-1.5 font-mono text-[11px] uppercase tracking-wider h-10"
              >
                <ShieldCheck className="h-4 w-4" /> Simulate Admin Login
              </Button>
            </form>

            {/* Footer Links */}
            <div className="flex gap-4 justify-center pt-8 text-[11px] font-mono text-[#a3a6b8]">
              <Link href="/help" className="hover:text-gray-600">Help</Link>
              <Link href="/privacy" className="hover:text-gray-600">Privacy</Link>
              <Link href="/terms" className="hover:text-gray-600">Terms</Link>
            </div>
          </div>
        </div>

      </StateWrapper>
    </div>
  );
}
