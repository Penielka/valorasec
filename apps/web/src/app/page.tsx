import Link from 'next/link';
import { Shield, ArrowRight, Code, FileText, GitBranch, Lock, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout/footer';

const features = [
  {
    icon: Code,
    title: 'Smart Contract Analysis',
    description: 'Automated security analysis for Soroban contracts with customizable rules.',
  },
  {
    icon: FileText,
    title: 'Audit Reports',
    description: 'Generate comprehensive audit reports with severity scoring and recommendations.',
  },
  {
    icon: Lock,
    title: 'On-Chain Verification',
    description: 'Store audit records on Stellar Testnet for immutable verification.',
  },
  {
    icon: GitBranch,
    title: 'Version Tracking',
    description: 'Track security posture across contract versions and deployments.',
  },
  {
    icon: Zap,
    title: 'Quick Scans',
    description: 'Run instant security scans with detailed findings in seconds.',
  },
  {
    icon: Globe,
    title: 'Open Source',
    description: 'MIT licensed. Community-driven. Transparent. Extensible.',
  },
];

export default function LandingPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Navigation */}
      <header className="border-border/50 bg-background/95 sticky top-0 z-50 w-full border-b backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="text-primary h-6 w-6" />
            <span className="font-heading text-xl font-bold tracking-tight">
              Valora<span className="text-primary">Sec</span>
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-muted-foreground hover:text-foreground text-sm">
              Sign In
            </Link>
            <Link href="/register">
              <Button variant="cyber" size="sm">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid-pattern bg-grid-size absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <div className="max-w-3xl">
            <div className="border-primary/30 bg-primary/5 text-primary mb-6 inline-flex items-center rounded-full border px-3 py-1 text-sm">
              <Zap className="mr-2 h-3.5 w-3.5" />
              Now on Stellar Testnet
            </div>
            <h1 className="font-heading mb-6 text-5xl font-extrabold tracking-tight lg:text-6xl">
              Secure Your <span className="text-primary cyber-text-glow">Soroban</span> Smart
              Contracts
            </h1>
            <p className="text-muted-foreground mb-8 max-w-2xl text-lg">
              ValoraSec provides automated security analysis, audit reports, and on-chain
              verification for Soroban smart contracts on the Stellar Network. Open source,
              community-driven, and built for developers.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button variant="cyber" size="lg">
                  Start Auditing <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a
                href="https://github.com/valorasec/valorasec"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
          <div className="text-muted-foreground mt-12 flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="bg-primary h-2 w-2 animate-pulse rounded-full" />
              Stellar Testnet Connected
            </div>
            <div>•</div>
            <div>8 Security Rules</div>
            <div>•</div>
            <div>On-Chain Verification</div>
            <div>•</div>
            <div>MIT Licensed</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-16 text-center">
          <h2 className="font-heading mb-4 text-3xl font-bold">Everything You Need</h2>
          <p className="text-muted-foreground mx-auto max-w-xl">
            Comprehensive tools for auditing and securing your Soroban smart contracts.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="cyber-card-hover p-6">
              <feature.icon className="text-primary mb-4 h-8 w-8" />
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-border/50 border-t">
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h2 className="font-heading mb-4 text-3xl font-bold">Ready to Audit Your Contracts?</h2>
          <p className="text-muted-foreground mx-auto mb-8 max-w-lg">
            Join developers securing their Soroban smart contracts on the Stellar Network.
          </p>
          <Link href="/register">
            <Button variant="cyber" size="lg">
              Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
