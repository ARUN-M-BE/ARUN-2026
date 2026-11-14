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
import { Loader2, Save } from "lucide-react";
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

      {/* Tabbed Form Editor */}
      <div className="max-w-5xl">
        <div className="space-y-4">
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
      </div>
    </form>
  );
}
