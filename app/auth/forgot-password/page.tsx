'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

import { sendPasswordResetEmail } from 'firebase/auth';
import { getFirebaseAuth } from '@/lib/firebase';

export default function ForgotPassword() {
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email);
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to send password reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 font-sans max-w-md mx-auto w-full">
      <StateWrapper>
        <Card className="w-full border-border/80 bg-card/60 backdrop-blur-sm shadow-xl">
          <CardHeader className="space-y-1.5 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">Reset Password</CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground">
              Enter your email address and we'll send you a password reset link.
            </CardDescription>
          </CardHeader>
          
          {submitted ? (
            <CardContent className="space-y-4 text-center py-4">
              <div className="flex justify-center text-emerald-500 mb-2">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <h3 className="font-bold text-foreground">Reset Link Sent</h3>
              <p className="text-xs text-muted-foreground">
                If an account exists for **{email}**, we have sent instructions to reset your password.
              </p>
              <div className="pt-4">
                <Link href="/auth/login">
                  <Button className="w-full">Return to Sign In</Button>
                </Link>
              </div>
            </CardContent>
          ) : (
             <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold">
                    {error}
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 mt-2">
                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold">
                  <Send className="mr-1.5 h-3.5 w-3.5" /> {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
                
                <Link href="/auth/login" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors mt-2">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </StateWrapper>
    </div>
  );
}
