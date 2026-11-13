import { requireAdmin } from "@/lib/auth-guard";
import { getDashboardStats, getContactMessages, getProfile } from "@/lib/actions";
import { PageHeader } from "@/components/admin/page-header";
import { AdminAnalyticsChart } from "@/components/admin/analytics-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FolderGit2,
  Cpu,
  Briefcase,
  Mail,
  ArrowRight,
  Plus,
  Eye,
  GraduationCap,
  Award,
  MessageSquareQuote,
  CheckCircle2,
  Layers,
  Compass,
  Share2,
  User,
  SlidersHorizontal,
} from "lucide-react";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const [stats, recentMessagesData, profile] = await Promise.all([
    getDashboardStats(),
    getContactMessages({ limit: 5 }),
    getProfile(),
  ]);

  const statCards = [
    {
      title: "Sections",
      value: stats.sections,
      desc: `${stats.publishedSections} published, ${stats.draftSections} drafts`,
      icon: Layers,
      color: "from-sky-500/20 to-sky-500/5 text-sky-400 border-sky-500/20",
      href: "/admin/sections",
    },
    {
      title: "Projects",
      value: stats.projects,
      desc: `${stats.publishedProjects ?? stats.projects} live in universe`,
      icon: FolderGit2,
      color: "from-cyan-500/20 to-cyan-500/5 text-cyan-400 border-cyan-500/20",
      href: "/admin/projects",
    },
    {
      title: "Skills",
      value: stats.skills,
      desc: "Tech skills in constellation",
      icon: Cpu,
      color: "from-violet-500/20 to-violet-500/5 text-violet-400 border-violet-500/20",
      href: "/admin/skills",
    },
    {
      title: "Work Experience",
      value: stats.experience,
      desc: "Timeline milestones",
      icon: Briefcase,
      color: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20",
      href: "/admin/experience",
    },
    {
      title: "Unread Messages",
      value: stats.unreadMessages,
      desc: "Client inquiries awaiting reply",
      icon: Mail,
      color: stats.unreadMessages > 0 ? "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20" : "from-zinc-500/20 to-zinc-500/5 text-zinc-400 border-border",
      href: "/admin/messages",
    },
    {
      title: "Education",
      value: stats.education,
      desc: "Academic degrees archived",
      icon: GraduationCap,
      color: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20",
      href: "/admin/education",
    },
    {
      title: "Certifications",
      value: stats.certifications,
      desc: "Industry verified credentials",
      icon: Award,
      color: "from-pink-500/20 to-pink-500/5 text-pink-400 border-pink-500/20",
      href: "/admin/certifications",
    },
    {
      title: "Testimonials",
      value: stats.testimonials,
      desc: "Client recommendations",
      icon: MessageSquareQuote,
      color: "from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/20",
      href: "/admin/testimonials",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Universe Command Center"
        description="Monitor system statistics, manage sections & navbar, showcase projects, and respond to incoming inquiries."
      >
        <div className="flex items-center gap-2">
          <Link href="/admin/projects/new">
            <Button size="sm" className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Project
            </Button>
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Button size="sm" variant="outline" className="text-xs border-border">
              <Eye className="w-3.5 h-3.5 mr-1" />
              Preview Live
            </Button>
          </a>
        </div>
      </PageHeader>

      {/* Quick Actions Control Bar */}
      <Card className="bg-card/70 border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground font-mono">
                Website Management Quick Actions
              </CardTitle>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">v2.4 Control Suite</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            <Link href="/admin/sections">
              <Button variant="outline" className="w-full justify-start text-xs border-border hover:border-sky-500/40 hover:bg-sky-500/10 h-10 px-3">
                <Layers className="w-3.5 h-3.5 mr-2 text-sky-400 shrink-0" />
                <span className="truncate">Manage Sections</span>
              </Button>
            </Link>
            <Link href="/admin/projects/new">
              <Button variant="outline" className="w-full justify-start text-xs border-border hover:border-cyan-500/40 hover:bg-cyan-500/10 h-10 px-3">
                <Plus className="w-3.5 h-3.5 mr-2 text-cyan-400 shrink-0" />
                <span className="truncate">Add Project</span>
              </Button>
            </Link>
            <Link href="/admin/navigation">
              <Button variant="outline" className="w-full justify-start text-xs border-border hover:border-indigo-500/40 hover:bg-indigo-500/10 h-10 px-3">
                <Compass className="w-3.5 h-3.5 mr-2 text-indigo-400 shrink-0" />
                <span className="truncate">Customize Navbar</span>
              </Button>
            </Link>
            <Link href="/admin/social-links">
              <Button variant="outline" className="w-full justify-start text-xs border-border hover:border-pink-500/40 hover:bg-pink-500/10 h-10 px-3">
                <Share2 className="w-3.5 h-3.5 mr-2 text-pink-400 shrink-0" />
                <span className="truncate">Manage Socials</span>
              </Button>
            </Link>
            <Link href="/admin/profile">
              <Button variant="outline" className="w-full justify-start text-xs border-border hover:border-amber-500/40 hover:bg-amber-500/10 h-10 px-3">
                <User className="w-3.5 h-3.5 mr-2 text-amber-400 shrink-0" />
                <span className="truncate">Customize Profile</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Website Sections & Projects Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Sections Breakdown */}
        <Card className="bg-gradient-to-br from-card to-card/60 border-border">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                Website Sections Overview
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Total lifecycle state of page sections
              </CardDescription>
            </div>
            <Link href="/admin/sections">
              <Button variant="ghost" size="sm" className="text-xs text-sky-400 hover:text-sky-300 h-8">
                Configure
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                <div className="text-xl font-bold text-white font-mono">{stats.sections}</div>
                <div className="text-[10px] uppercase font-mono text-muted-foreground mt-1">Total</div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-xl font-bold text-emerald-400 font-mono">{stats.publishedSections}</div>
                <div className="text-[10px] uppercase font-mono text-emerald-400/80 mt-1">Published</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-xl font-bold text-amber-400 font-mono">{stats.draftSections}</div>
                <div className="text-[10px] uppercase font-mono text-amber-400/80 mt-1">Drafts</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-500/10 border border-border">
                <div className="text-xl font-bold text-zinc-400 font-mono">{stats.unpublishedSections}</div>
                <div className="text-[10px] uppercase font-mono text-zinc-400/80 mt-1">Hidden</div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 flex items-center justify-between">
              <span>* Draft and hidden sections are never rendered on the live website.</span>
            </p>
          </CardContent>
        </Card>

        {/* Projects Breakdown */}
        <Card className="bg-gradient-to-br from-card to-card/60 border-border">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-cyan-400" />
                Projects Showcase Status
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Distribution of published works & in-progress drafts
              </CardDescription>
            </div>
            <Link href="/admin/projects">
              <Button variant="ghost" size="sm" className="text-xs text-cyan-400 hover:text-cyan-300 h-8">
                View All
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 rounded-xl bg-secondary/50 border border-border">
                <div className="text-xl font-bold text-white font-mono">{stats.projects}</div>
                <div className="text-[10px] uppercase font-mono text-muted-foreground mt-1">Total</div>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <div className="text-xl font-bold text-cyan-400 font-mono">{stats.publishedProjects ?? stats.projects}</div>
                <div className="text-[10px] uppercase font-mono text-cyan-400/80 mt-1">Published</div>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-xl font-bold text-amber-400 font-mono">{stats.draftProjects ?? 0}</div>
                <div className="text-[10px] uppercase font-mono text-amber-400/80 mt-1">Drafts</div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-3 flex items-center justify-between">
              <span>Supports grid & list views, image galleries, and category filters.</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile quick banner */}
      <Card className="bg-gradient-to-r from-card to-card/60 border-border/80 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-cyan-500/10 via-violet-500/5 to-transparent pointer-events-none" />
        <CardContent className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              SYSTEM IDENTITY READY
            </div>
            <h2 className="text-xl font-bold text-white">
              {profile?.fullName || "Developer Portfolio"} • {profile?.title || "Full-Stack Architect"}
            </h2>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl">
              {profile?.bio || "Configure your developer story, skills, projects, and contact points using the CMS."}
            </p>
          </div>
          <Link href="/admin/profile">
            <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-xs">
              Configure Identity & Bio
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className="group">
              <Card className="bg-card hover:bg-card/80 border-border hover:border-cyan-500/30 transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {card.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-gradient-to-b border ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white tracking-tight">{card.value}</div>
                  <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-between">
                    <span>{card.desc}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-cyan-400" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Live Ingress & Real-Time Analytics Graph */}
      <AdminAnalyticsChart />

      {/* Recent Inquiries & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold text-white">Recent Inquiries</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Latest submissions from the 3D portfolio contact form
              </CardDescription>
            </div>
            <Link href="/admin/messages">
              <Button variant="ghost" size="sm" className="text-xs text-cyan-400 hover:text-cyan-300">
                View All Messages
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentMessagesData.items.length === 0 ? (
              <div className="text-center py-8 text-xs text-muted-foreground">
                No inquiries received yet. Test the contact form on the public page!
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {recentMessagesData.items.map((msg) => (
                  <div key={msg.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-white">{msg.name}</span>
                        <span className="text-[11px] text-muted-foreground">({msg.email})</span>
                        {msg.messageStatus === "unread" && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">
                            UNREAD
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.message}</p>
                    </div>
                    <div className="text-[11px] text-muted-foreground shrink-0 font-mono">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick System Architecture Check */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-white">System Diagnostics</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Architecture & compliance readiness
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Database Engine
              </span>
              <span className="font-mono text-white">PostgreSQL (Drizzle)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                3D Visual Layer
              </span>
              <span className="font-mono text-cyan-400">R3F + Three.js</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                DPDP Act 2023 Compliance
              </span>
              <span className="font-mono text-emerald-400">Active</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Authentication
              </span>
              <span className="font-mono text-violet-400">NextAuth JWT</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Sections & Nav Management
              </span>
              <span className="font-mono text-sky-400">Integrated</span>
            </div>

            <div className="pt-4 border-t border-border">
              <Link href="/admin/settings">
                <Button variant="outline" size="sm" className="w-full text-xs border-border">
                  Configure Settings & Themes
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
