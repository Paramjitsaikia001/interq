import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-muted-foreground">
        {/* Left Side: Brand Logo and Copyright Text */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold tracking-tight text-black font-heading hover:opacity-90 transition-opacity">
              inter<span className='text-[#f95427] font-black'>Q</span>
            </span>
          </Link>
          <span className="hidden sm:inline text-muted-foreground/40">|</span>
          <p>© 2026 interQ. Community-driven interview prep.</p>
        </div>

        {/* Right Side: Links */}
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/about" className="hover:text-primary transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-primary transition-colors">Terms</Link>
          <div className="follow flex gap-2">
            <span>►Follow on </span>
          <Link href="https://github.com/Paramjitsaikia001" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline">Github</Link>
          <Link href="https://www.linkedin.com/in/paramjit-saikia-21615a237/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors"><span className='text-blue-600'>Linkedin</span></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
