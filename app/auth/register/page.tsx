'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSimulationStore } from '@/lib/state-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { ShieldCheck, Code2 } from 'lucide-react';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';
import { loginWithGoogle } from '@/lib/auth-client';

export default function Register() {
  const router = useRouter();
  const { setUserRole } = useSimulationStore();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  // Dynamically hide the header and footer when visiting the register page
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      if (name) {
        await updateProfile(userCredential.user, { displayName: name });
      }
      router.push('/questions');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create account.');
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

  return (
    <div className="flex-1 min-h-screen flex flex-col md:flex-row w-full font-sans bg-white">
      <StateWrapper>
        {/* Left Pane - Branding & Graphic background */}
        <div 
          className="hidden md:flex md:w-1/2 flex-col justify-between p-12 lg:p-16 relative overflow-hidden border-r border-[#e2e8f5]"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 74, 198, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 74, 198, 0.04) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            backgroundColor: '#f6f9fe',
          }}
        >
          {/* Subtle concentric grid background helper */}
          <div className="absolute right-0 bottom-0 w-[400px] h-[400px] pointer-events-none opacity-20">
            <svg viewBox="0 0 400 400" fill="none" className="w-full h-full text-[#004ac6]">
              <circle cx="400" cy="400" r="100" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
              <circle cx="400" cy="400" r="200" stroke="currentColor" strokeWidth="1" />
              <circle cx="400" cy="400" r="300" stroke="currentColor" strokeWidth="1" strokeDasharray="8 8" />
            </svg>
          </div>

          {/* Top Logo */}
          <div className="z-10">
            <div className="border border-border/80 bg-white rounded-xl p-2 w-[56px] h-[56px] flex flex-col items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <div className="relative w-6 h-6 flex items-center justify-center">
                {/* Target/Magnifier */}
                <div className="absolute w-4 h-4 rounded-full border-2 border-[#004ac6] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#004ac6]" />
                </div>
                {/* Diagonal handle for magnifier */}
                <div className="absolute right-0.5 bottom-0.5 w-[5px] h-[2px] bg-[#004ac6] rotate-45 origin-top-left translate-x-[1px] translate-y-[1px]" />
                {/* Crosshair lines */}
                <div className="absolute top-0 w-[1.5px] h-1 bg-[#004ac6]/70" />
                <div className="absolute bottom-0 w-[1.5px] h-1 bg-[#004ac6]/70" />
                <div className="absolute left-0 h-[1.5px] w-1 bg-[#004ac6]/70" />
                <div className="absolute right-0 h-[1.5px] w-1 bg-[#004ac6]/70" />
              </div>
              <span className="text-[10px] font-black tracking-tight text-[#191b23] mt-0.5">interQ</span>
            </div>
          </div>

          {/* Core Intro Text & Visual Cards */}
          <div className="z-10 max-w-lg my-auto py-12 flex flex-col">
            <h1 className="text-[44px] lg:text-[50px] font-extrabold tracking-tight text-[#191b23] leading-[1.1] font-heading">
              Built for the next <br /> generation of <br />
              <span className="text-[#004ac6] relative inline-block">
                engineers.
                <span className="absolute left-0 bottom-1 w-full h-[4px] bg-[#004ac6]/20 rounded" />
              </span>
            </h1>

            <p className="text-md text-[#565e74] mt-6 max-w-md font-sans leading-relaxed">
              Join 50k+ developers mastering technical interviews through community-driven insights and structured preparation.
            </p>

            {/* Avatar Stats Badge */}
            <div className="border border-[#e2e8f5] bg-white rounded-2xl p-4 flex items-center gap-4 shadow-[0_2px_12px_rgba(0,0,0,0.02)] max-w-sm mt-10">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#eceef4] flex items-center justify-center text-[10px] font-bold text-[#434655]">JD</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#e0ecff] flex items-center justify-center text-[10px] font-bold text-[#004ac6]">AM</div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#ffeeda] flex items-center justify-center text-[10px] font-bold text-[#c96c00]">SL</div>
              </div>
              <div className="text-xs font-mono text-foreground font-semibold">
                <span className="text-[#004ac6] font-extrabold">50k+</span> members actively preparing.
              </div>
            </div>

            {/* Bottom Twin Cards */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="border border-[#e2e8f5] bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm flex flex-col justify-between h-[110px]">
                <div className="w-8 h-8 rounded-lg bg-[#eef4ff] flex items-center justify-center text-[#004ac6] mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono text-[#191b23]">Verified Questions</h3>
                  <p className="text-[10px] font-mono text-[#565e74] mt-0.5 leading-normal">
                    Sourced from real rounds at FAANG & top startups.
                  </p>
                </div>
              </div>

              <div className="border border-[#e2e8f5] bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm flex flex-col justify-between h-[110px]">
                <div className="w-8 h-8 rounded-lg bg-[#eef4ff] flex items-center justify-center text-[#004ac6] mb-2">
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold font-mono text-[#191b23]">Technical Precision</h3>
                  <p className="text-[10px] font-mono text-[#565e74] mt-0.5 leading-normal">
                    Focus on code quality and architectural patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Left Footer */}
          <div className="z-10 text-[10px] font-mono text-[#565e74]/80 text-center w-full">
            © 2024 interQ. Community-driven interview prep.
          </div>
        </div>

        {/* Right Pane - Registration Form */}
        <div className="w-full md:w-1/2 min-h-screen flex flex-col justify-center items-center p-6 sm:p-12 md:p-16 lg:p-20 bg-white">
          <div className="max-w-md w-full flex flex-col space-y-6">
            
            {/* Title Header */}
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-[#191b23] font-heading">
                Create your account
              </h2>
              <p className="text-sm text-[#565e74] mt-2 font-sans">
                Join interQ and elevate your interview performance.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold">
                {error}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-4">
              
              {/* Google Button */}
              <Button
                type="button"
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full h-11 border border-border/80 hover:bg-[#fafbff] bg-white text-sm font-medium flex items-center justify-center gap-2.5 rounded-lg shadow-sm font-sans text-[#191b23]"
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
                <span className="flex-shrink mx-4 text-[10px] font-bold font-mono text-[#a3a6b8] tracking-wider uppercase">OR EMAIL</span>
                <div className="flex-grow border-t border-[#e2e8f5]"></div>
              </div>

              {/* Inputs Wrapper */}
              <div className="space-y-4">
                
                {/* Full Name */}
                <div>
                  <label className="text-[11px] font-bold font-mono text-[#191b23] uppercase tracking-wider block mb-1.5">
                    Full Name
                  </label>
                  <Input
                    placeholder="Ada Lovelace"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 border border-border/80 focus-visible:ring-1 focus-visible:ring-[#004ac6] focus-visible:border-[#004ac6] rounded-lg font-mono text-sm px-4 bg-[#fafbff] text-[#191b23]"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="text-[11px] font-bold font-mono text-[#191b23] uppercase tracking-wider block mb-1.5">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="ada@interq.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 border border-border/80 focus-visible:ring-1 focus-visible:ring-[#004ac6] focus-visible:border-[#004ac6] rounded-lg font-mono text-sm px-4 bg-[#fafbff] text-[#191b23]"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-baseline mb-1.5">
                    <label className="text-[11px] font-bold font-mono text-[#191b23] uppercase tracking-wider">
                      Password
                    </label>
                    <span className="text-[10px] font-mono text-[#8b8e9f]">Min. 8 characters</span>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border border-border/80 focus-visible:ring-1 focus-visible:ring-[#004ac6] focus-visible:border-[#004ac6] rounded-lg font-mono text-sm px-4 bg-[#fafbff] text-[#191b23]"
                    required
                    disabled={loading}
                  />
                </div>

              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-2.5 pt-2">
                <input
                  type="checkbox"
                  id="agree"
                  required
                  className="mt-1 h-4 w-4 rounded border-[#c3c6d7] text-[#004ac6] focus:ring-[#004ac6]"
                />
                <label htmlFor="agree" className="text-xs text-[#565e74] font-mono leading-normal">
                  I agree to the <Link href="/terms" className="text-[#004ac6] hover:underline font-bold">Terms of Service</Link> and <Link href="/privacy" className="text-[#004ac6] hover:underline font-bold">Privacy Policy</Link>.
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#004ac6] hover:bg-[#003da3] text-white font-bold font-mono text-xs uppercase tracking-wider rounded-lg shadow-sm mt-2"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              {/* Login Link */}
              <div className="text-center text-xs font-mono text-[#565e74] pt-2">
                Already have an account?{' '}
                <Link href="/auth/login" className="font-bold text-[#004ac6] hover:underline">
                  Log in
                </Link>
              </div>

            </form>
          </div>
        </div>

      </StateWrapper>
    </div>
  );
}

