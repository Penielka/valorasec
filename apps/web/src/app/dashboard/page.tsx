'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Shield,
  Plus,
  ArrowRight,
  TrendingUp,
  FileText,
  Activity,
  Loader2,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/navbar';
import { useAuthStore } from '@/lib/store/auth-store';
import { useAuthGuard } from '@/lib/hooks/use-auth-guard';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { Project, Report } from '@valorasec/shared';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { shouldRender } = useAuthGuard();
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shouldRender) return;

    async function loadData() {
      try {
        const [projectsRes, reportsRes] = await Promise.all([
          api.getProjects({ limit: 5 }),
          api.getReports({ limit: 5 }),
        ]);
        setProjects(projectsRes.data);
        setReports(reportsRes.data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="animate-fade-in mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold">
              Welcome back, {user?.name?.split(' ')[0] ?? 'User'}
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitor your Soroban smart contract security
            </p>
          </div>
          <Link href="/projects/new">
            <Button variant="cyber">
              <Plus className="mr-2 h-4 w-4" /> New Project
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader2 className="text-primary h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
              <div className="cyber-card p-6">
                <div className="mb-3 flex items-center justify-between">
                  <TrendingUp className="text-primary h-5 w-5" />
                  <span className="text-muted-foreground text-xs">Total</span>
                </div>
                <div className="text-2xl font-bold">{projects.length}</div>
                <div className="text-muted-foreground text-sm">Projects</div>
              </div>
              <div className="cyber-card p-6">
                <div className="mb-3 flex items-center justify-between">
                  <FileText className="text-primary h-5 w-5" />
                  <span className="text-muted-foreground text-xs">Total</span>
                </div>
                <div className="text-2xl font-bold">{reports.length}</div>
                <div className="text-muted-foreground text-sm">Reports</div>
              </div>
              <div className="cyber-card p-6">
                <div className="mb-3 flex items-center justify-between">
                  <Activity className="text-primary h-5 w-5" />
                  <span className="text-muted-foreground text-xs">Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-primary h-2.5 w-2.5 animate-pulse rounded-full" />
                  <span className="text-muted-foreground text-sm">Connected</span>
                </div>
                <div className="text-muted-foreground mt-1 text-xs">Stellar Testnet</div>
              </div>
              <div className="cyber-card p-6">
                <div className="mb-3 flex items-center justify-between">
                  <Shield className="text-primary h-5 w-5" />
                  <span className="text-muted-foreground text-xs">Security</span>
                </div>
                <div className="text-primary text-2xl font-bold">--</div>
                <div className="text-muted-foreground text-sm">Avg. Score</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Recent Projects */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold">Recent Projects</h2>
                  <Link
                    href="/projects"
                    className="text-primary flex items-center text-sm hover:underline"
                  >
                    View all <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                {projects.length === 0 ? (
                  <div className="cyber-card p-8 text-center">
                    <AlertTriangle className="text-muted-foreground mx-auto mb-3 h-8 w-8" />
                    <p className="text-muted-foreground mb-4">No projects yet</p>
                    <Link href="/projects/new">
                      <Button variant="cyber" size="sm">
                        <Plus className="mr-2 h-4 w-4" /> Create your first project
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        className="cyber-card-hover flex items-center justify-between p-4"
                      >
                        <div>
                          <h3 className="font-semibold">{project.name}</h3>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="low">{project.network}</Badge>
                            <span className="text-muted-foreground text-xs">
                              {project.contracts.length} contract
                              {project.contracts.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="text-muted-foreground h-4 w-4" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Reports */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-heading text-xl font-bold">Recent Reports</h2>
                  <Link
                    href="/reports"
                    className="text-primary flex items-center text-sm hover:underline"
                  >
                    View all <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
                {reports.length === 0 ? (
                  <div className="cyber-card p-8 text-center">
                    <AlertTriangle className="text-muted-foreground mx-auto mb-3 h-8 w-8" />
                    <p className="text-muted-foreground">
                      No reports yet. Run your first scan to generate one.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reports.map((report) => (
                      <Link
                        key={report.id}
                        href={`/reports/${report.id}`}
                        className="cyber-card-hover p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <h3 className="text-sm font-semibold">{report.title}</h3>
                          <Badge variant="low">{report.status}</Badge>
                        </div>
                        <div className="text-muted-foreground flex items-center justify-between text-xs">
                          <span>{formatDate(report.createdAt)}</span>
                          {report.verifiedOnChain && (
                            <Badge variant="info" className="text-xs">
                              ✓ On-chain
                            </Badge>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
