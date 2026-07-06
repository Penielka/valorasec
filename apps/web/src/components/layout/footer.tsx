import { Shield } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-border/50 bg-background/95 border-t backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="mb-3 flex items-center gap-2">
              <Shield className="text-primary h-5 w-5" />
              <span className="font-heading text-lg font-bold">
                Valora<span className="text-primary">Sec</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Open-source security platform for Soroban smart contracts.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Product</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-foreground transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Changelog
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Community</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/valorasec/valorasec"
                  className="hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Legal</h4>
            <ul className="text-muted-foreground space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  MIT License
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-border/50 text-muted-foreground mt-8 border-t pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ValoraSec. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
