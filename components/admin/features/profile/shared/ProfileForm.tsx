"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileFormData } from "@/lib/validations";
import { updateProfile } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Loader2,
  Save,
  MapPin,
  FileText,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import type { Profile, Status } from "@/types";

interface ProfileFormProps {
  initialData?: Profile | null;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "bio" | "contact" | "metrics" | "theme">("general");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialData?.fullName || "Arun M",
      title: initialData?.title || "Senior Full-Stack Architect & 3D Engineer",
      subtitle: initialData?.subtitle || "Architecting resilient cloud engines, distributed systems, and futuristic 3D web experiences.",
      bio: initialData?.bio || "Accomplished full-stack architect with a focus on distributed microservices, PostgreSQL, and WebGL environments.",
      shortBio: initialData?.shortBio || "Senior Architect & Creative Technologist crafting next-generation digital platforms.",
      email: initialData?.email || "arun@arun-m.in",
      phone: initialData?.phone || "+91 98765 43210",
      location: initialData?.location || "Bangalore, India",
      website: initialData?.website || "https://arun-m.in",
      avatar: initialData?.avatar || "/avatar.png",
      heroImage: initialData?.heroImage || "/hero.jpg",
      resumeUrl: initialData?.resumeUrl || "#",
      yearsOfExperience: initialData?.yearsOfExperience || 8,
      projectsCompleted: initialData?.projectsCompleted || 35,
      happyClients: initialData?.happyClients || 24,
      availability: initialData?.availability || "AVAILABLE FOR ARCHITECTURAL ADVISORY & CONTRACTS",
      status: (initialData?.status as Status) || "published",
    },
  });

  const watchedValues = watch();

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      const res = await updateProfile(data);
      if (res.success) {
        toast.success("Profile updated successfully", {
          description: "All changes persisted and live website cache revalidated.",
        });
      } else {
        toast.error("Failed to update profile", { description: res.error });
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "An error occurred";
      toast.error("Error", { description: msg });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Top Header / Save Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border shadow-xs">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Profile & Identity Command Center</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Complete freedom to customize your avatar, bio, titles, metrics, and live availability.
          </p>
        </div>
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs px-6 shadow-sm"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
              Saving Profile...
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 mr-2" />
              Save & Publish Changes
            </>
          )}
        </Button>
      </div>

      {/* Main Grid: Form Editor (7 cols) + Real-time Profile Preview (5 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left: Tabbed Form Editor */}
        <div className="xl:col-span-7 space-y-4">
          {/* Tab Switcher */}
          <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-card border border-border shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "general" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Identity & Avatar
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("bio")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "bio" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Bio & Story
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("contact")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "contact" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Contact & Resume
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("metrics")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === "metrics" ? "bg-primary text-primary-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Key Metrics
            </button>
          </div>

          <Card className="bg-card border-border shadow-xs">
            <CardContent className="p-6 space-y-4">
              {/* Tab 1: Identity & Avatar */}
              {activeTab === "general" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Full Name *</Label>
                      <Input placeholder="e.g. Arun M" {...register("fullName")} className="bg-background/50 border-border" />
                      {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Professional Title *</Label>
                      <Input placeholder="e.g. Senior Full-Stack Architect" {...register("title")} className="bg-background/50 border-border" />
                      {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">Hero Subtitle</Label>
                    <Input placeholder="One-line subtitle for hero section" {...register("subtitle")} className="bg-background/50 border-border" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Avatar Photo URL</Label>
                      <Input placeholder="/avatar.png or https://..." {...register("avatar")} className="bg-background/50 border-border" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Hero Background Image URL</Label>
                      <Input placeholder="/hero.jpg or https://..." {...register("heroImage")} className="bg-background/50 border-border" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">Live Availability Badge</Label>
                    <Input placeholder="e.g. AVAILABLE FOR ARCHITECTURAL ADVISORY & CONTRACTS" {...register("availability")} className="bg-background/50 border-border font-mono text-xs uppercase" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">Publication Status</Label>
                    <Select
                      value={watch("status")}
                      onValueChange={(val) => setValue("status", val as Status)}
                    >
                      <SelectTrigger className="bg-background/50 border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="published">
                          <span className="text-emerald-400">● Published (Live Profile)</span>
                        </SelectItem>
                        <SelectItem value="draft">
                          <span className="text-amber-400">▲ Draft (Under Review)</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Tab 2: Bio & Story */}
              {activeTab === "bio" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">Short Bio (Hero & Quick Cards)</Label>
                    <Input placeholder="Short punchy bio" {...register("shortBio")} className="bg-background/50 border-border" />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">Detailed Introduction / About Me Narrative</Label>
                    <Textarea rows={8} placeholder="Write your full engineering background, architecture philosophy, and career highlights..." {...register("bio")} className="bg-background/50 border-border text-xs leading-relaxed" />
                  </div>
                </div>
              )}

              {/* Tab 3: Contact & Resume */}
              {activeTab === "contact" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Public Email Address</Label>
                      <Input placeholder="arun@arun-m.in" {...register("email")} className="bg-background/50 border-border" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Phone Number</Label>
                      <Input placeholder="+91 98765 43210" {...register("phone")} className="bg-background/50 border-border" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Base Location</Label>
                      <Input placeholder="Bangalore, India" {...register("location")} className="bg-background/50 border-border" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Official Website</Label>
                      <Input placeholder="https://arun-m.in" {...register("website")} className="bg-background/50 border-border" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-foreground">Downloadable Resume / CV Link</Label>
                    <Input placeholder="https://.../resume.pdf" {...register("resumeUrl")} className="bg-background/50 border-border" />
                  </div>
                </div>
              )}

              {/* Tab 4: Metrics */}
              {activeTab === "metrics" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Years of Experience</Label>
                      <Input type="number" {...register("yearsOfExperience", { valueAsNumber: true })} className="bg-background/50 border-border" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Projects Completed</Label>
                      <Input type="number" {...register("projectsCompleted", { valueAsNumber: true })} className="bg-background/50 border-border" />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-foreground">Happy Clients</Label>
                      <Input type="number" {...register("happyClients", { valueAsNumber: true })} className="bg-background/50 border-border" />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Live Real-Time Profile Card Preview (5 cols) */}
        <div className="xl:col-span-5 space-y-4 sticky top-6">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-semibold text-foreground">Real-time Identity Preview</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground uppercase">Live Mirror</span>
            </div>

            {/* Profile Preview Card */}
            <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 text-white space-y-4 shadow-xl">
              {/* Top Banner & Avatar */}
              <div className="flex items-center gap-3.5">
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shrink-0 border border-white/20">
                  {watchedValues.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={watchedValues.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    "AM"
                  )}
                </div>

                <div className="min-w-0">
                  <h4 className="font-extrabold text-base text-white truncate">{watchedValues.fullName || "Arun M"}</h4>
                  <p className="text-xs text-sky-400 font-medium truncate">{watchedValues.title || "Full-Stack Architect"}</p>
                  {watchedValues.location && (
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-zinc-500" />
                      <span>{watchedValues.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Availability badge */}
              {watchedValues.availability && (
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wide truncate">
                    {watchedValues.availability}
                  </span>
                </div>
              )}

              {/* Subtitle & Bio */}
              <div className="space-y-1.5 text-xs text-zinc-300 leading-relaxed border-t border-zinc-800/80 pt-3">
                {watchedValues.subtitle && (
                  <p className="font-medium text-white">{watchedValues.subtitle}</p>
                )}
                <p className="text-zinc-400">{watchedValues.shortBio || watchedValues.bio}</p>
              </div>

              {/* Career Stats Grid */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-800/80 text-center">
                <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-lg font-black text-sky-400 block">{watchedValues.yearsOfExperience}+</span>
                  <span className="text-[9px] font-mono text-zinc-400 uppercase">Years Exp</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-lg font-black text-indigo-400 block">{watchedValues.projectsCompleted}+</span>
                  <span className="text-[9px] font-mono text-zinc-400 uppercase">Projects</span>
                </div>
                <div className="p-2 rounded-xl bg-zinc-900/60 border border-zinc-800">
                  <span className="text-lg font-black text-emerald-400 block">{watchedValues.happyClients}+</span>
                  <span className="text-[9px] font-mono text-zinc-400 uppercase">Clients</span>
                </div>
              </div>

              {/* Contact Icons */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs text-zinc-400">
                <span className="truncate">{watchedValues.email}</span>
                {watchedValues.resumeUrl && watchedValues.resumeUrl !== "#" && (
                  <span className="text-sky-400 font-semibold text-[11px] flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    CV Ready
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
