import React from 'react';
import Link from 'next/link';
import { Github, Twitter, MessageSquare } from 'lucide-react';

export function Footer() {
  const footerLinks = [
    { label: 'About', href: '#' },
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Github', href: '#' },
    { label: 'Discord', href: '#' },
  ];

  return (
    <footer className="bg-surface border-t border-outline-variant mt-auto">
      <div className="max-w-[1200px] mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="text-3xl font-extrabold text-primary tracking-tight">interQ</div>
            <p className="text-sm text-muted-foreground font-medium">© 2026 interQ. Community-driven interview prep.</p>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            {footerLinks.map((link) => (
              <Link 
                key={link.label} 
                href={link.href} 
                className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
