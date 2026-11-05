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

export function ProfileForm({ initialData }: { initialData: any }) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialData?.fullName || "",
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      bio: initialData?.bio || "",
      shortBio: initialData?.shortBio || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      location: initialData?.location || "",
      website: initialData?.website || "",
      avatar: initialData?.avatar || "",
      heroImage: initialData?.heroImage || "",
      resumeUrl: initialData?.resumeUrl || "",
      yearsOfExperience: initialData?.yearsOfExperience || 5,
      projectsCompleted: initialData?.projectsCompleted || 24,
      happyClients: initialData?.happyClients || 18,
      availability: initialData?.availability || "Available for high-impact projects",
      status: initialData?.status || "published",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      const res = await updateProfile(data);
      if (res.success) {
        toast.success("Profile updated successfully", {
          description: "Live 3D hero & identity state updated with cache revalidation.",
        });
      } else {
        toast.error("Failed to update profile", { description: res.error });
      }
    } catch (e: any) {
      toast.error("Error", { description: e.message || "An error occurred" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="bg-card border-border">
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Full Name *</Label>
              <Input placeholder="e.g. Arun M" {...register("fullName")} />
              {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Professional Title *</Label>
              <Input placeholder="e.g. Senior Full-Stack Architect & 3D Engineer" {...register("title")} />
              {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Hero Subtitle</Label>
            <Input placeholder="e.g. Architecting immersive digital universe, scalable cloud platforms & creative web" {...register("subtitle")} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Short Bio (Hero/Cards)</Label>
            <Input placeholder="e.g. 8+ years crafting high-performance distributed systems & WebGL architectures." {...register("shortBio")} />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-zinc-300">Full Personal Story / Narrative</Label>
            <Textarea rows={5} placeholder="Write your full professional journey..." {...register("bio")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Email Address</Label>
              <Input type="email" placeholder="contact@domain.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Location</Label>
              <Input placeholder="e.g. Bangalore, India / Remote" {...register("location")} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Availability Status</Label>
              <Input placeholder="e.g. Available for Q1 Contracts" {...register("availability")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Years of Experience</Label>
              <Input type="number" {...register("yearsOfExperience")} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Completed Projects</Label>
              <Input type="number" {...register("projectsCompleted")} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Happy Clients / Organizations</Label>
              <Input type="number" {...register("happyClients")} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Resume / CV Link</Label>
              <Input placeholder="https://example.com/resume.pdf" {...register("resumeUrl")} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-zinc-300">Publication Status</Label>
              <Select
                value={watch("status")}
                onValueChange={(val: any) => setValue("status", val)}
              >
                <SelectTrigger className="bg-background/50 border-border">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="unpublished">Unpublished</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSaving}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs px-6"
        >
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Profile Changes
        </Button>
      </div>
    </form>
  );
}
