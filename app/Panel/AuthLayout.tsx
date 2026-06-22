import Link from 'next/link';
import { MessageSquare } from 'lucide-react';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export default function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-[#1b1c1f] text-[#e4e6eb] flex flex-col">
      {/* Minimal top bar */}
      <header className="border-b border-[rgba(255,255,255,0.06)]">
        <div className="max-w-6xl mx-auto px-4 h-12 flex items-center">
            <Link href="/" className="flex text-[#e4e6eb] hover:text-[#4b8ef1] items-center gap-2 shrink-0">
                <img src="/logo.png" className="w-10" alt="BUNNYFORUM" />
                  <span className="font-semibold text-sm tracking-tight hidden sm:block">
                      BUNNY FORUM
                  </span>
           </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="rounded-lg border border-[rgba(255,255,255,0.06)] bg-[#242528] overflow-hidden">
            <div className="px-6 pt-6 pb-5 border-b border-[rgba(255,255,255,0.06)]">
              <h1 className="text-base font-bold text-[#e4e6eb] leading-none">{title}</h1>
              <p className="text-[#8a8d91] text-xs mt-1.5">{subtitle}</p>
            </div>
            <div className="px-6 py-6">
              {children}
            </div>
          </div>
          <div className="text-center mt-4">
            {footer}
          </div>
        </div>
      </main>
    </div>
  );
}