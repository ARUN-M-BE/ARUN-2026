"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { DeleteDialog } from "@/components/admin/delete-dialog";
import { EmptyState } from "@/components/admin/empty-state";
import { Toggle } from "@/components/ui/toggle";
import {
  createSkill,
  updateSkill,
  deleteSkill,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
} from "@/lib/actions";
import { Plus, Trash2, Cpu, Sparkles, FolderPlus, Loader2, Star, Edit2 } from "lucide-react";
import { toast } from "sonner";
import type { Skill, SkillCategory } from "@/types";

export function SkillsClient({
  initialCategories,
  initialSkills,
}: {
  initialCategories: SkillCategory[];
  initialSkills: Skill[];
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [skills, setSkills] = useState(initialSkills);

  // Skill dialog (create & edit)
  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState(categories[0]?.id || "");
  const [skillLevel, setSkillLevel] = useState(85);
  const [skillFeatured, setSkillFeatured] = useState(true);
  const [isSavingSkill, setIsSavingSkill] = useState(false);

  // Category dialog (create & edit)
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SkillCategory | null>(null);
  const [catName, setCatName] = useState("");
  const [isSavingCat, setIsSavingCat] = useState(false);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<{ type: "skill" | "category"; id: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const openCreateCategory = () => {
    setEditingCategory(null);
    setCatName("");
    setIsCatOpen(true);
  };

  const openEditCategory = (cat: SkillCategory) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setIsCatOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    setIsSavingCat(true);
    try {
      const slug = catName.toLowerCase().replace(/\s+/g, "-");
      if (editingCategory) {
        const res = await updateSkillCategory(editingCategory.id, { name: catName, slug });
        if (res.success) {
          toast.success("Category updated");
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? { ...c, name: catName, slug } : c))
          );
          setIsCatOpen(false);
          setEditingCategory(null);
          setCatName("");
          router.refresh();
        } else {
          toast.error("Failed to update category", { description: res.error });
        }
      } else {
        const res = await createSkillCategory({ name: catName, slug, status: "published" });
        if (res.success && res.data) {
          toast.success("Category created");
          setCategories((prev) => [...prev, res.data as SkillCategory]);
          setCatName("");
          setIsCatOpen(false);
          router.refresh();
        } else {
          toast.error("Failed", { description: res.error });
        }
      }
    } finally {
      setIsSavingCat(false);
    }
  };

  const openCreateSkill = (targetCatId?: string) => {
    setEditingSkill(null);
    setSkillName("");
    setSkillCategory(targetCatId || categories[0]?.id || "");
    setSkillLevel(85);
    setSkillFeatured(true);
    setIsSkillOpen(true);
  };

  const openEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillName(skill.name);
    setSkillCategory(skill.categoryId || categories[0]?.id || "");
    setSkillLevel(skill.level || 85);
    setSkillFeatured(Boolean(skill.isFeatured));
    setIsSkillOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillName.trim()) return;
    setIsSavingSkill(true);
    try {
      const slug = skillName.toLowerCase().replace(/\s+/g, "-");
      const payload = {
        name: skillName,
        slug,
        categoryId: skillCategory || null,
        level: Number(skillLevel),
        isFeatured: skillFeatured,
        status: "published" as const,
      };

      if (editingSkill) {
        const res = await updateSkill(editingSkill.id, payload);
        if (res.success) {
          toast.success("Skill updated");
          setSkills((prev) =>
            prev.map((s) => (s.id === editingSkill.id ? { ...s, ...payload } : s))
          );
          setIsSkillOpen(false);
          setEditingSkill(null);
          setSkillName("");
          router.refresh();
        } else {
          toast.error("Failed to update skill", { description: res.error });
        }
      } else {
        const res = await createSkill(payload);
        if (res.success && res.data) {
          toast.success("Skill added to constellation");
          setSkills((prev) => [...prev, res.data as Skill]);
          setSkillName("");
          setIsSkillOpen(false);
          router.refresh();
        } else {
          toast.error("Failed to add skill", { description: res.error });
        }
      }
    } finally {
      setIsSavingSkill(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === "skill") {
        await deleteSkill(deleteTarget.id);
        setSkills((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        toast.success("Skill deleted");
      } else {
        await deleteSkillCategory(deleteTarget.id);
        setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        toast.success("Category deleted");
      }
      setDeleteTarget(null);
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground font-mono">
          {skills.length} skills organized in {categories.length} constellation clusters
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={openCreateCategory}
            className="text-xs border-border rounded-xl"
          >
            <FolderPlus className="w-3.5 h-3.5 mr-1" />
            Add Category
          </Button>
          <Button
            size="sm"
            onClick={() => openCreateSkill()}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-xl"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Skill
          </Button>
        </div>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          title="No skill categories yet"
          description="Create your first category (e.g. Frontend, Backend, Architecture) to group your skills."
          icon={<Cpu className="w-6 h-6" />}
        >
          <Button size="sm" onClick={openCreateCategory} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-xl">
            Add Category
          </Button>
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => s.categoryId === cat.id);
            return (
              <Card key={cat.id} className="bg-card border-border rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      {cat.name}
                    </CardTitle>
                    <CardDescription className="text-[11px] text-muted-foreground">
                      {catSkills.length} skills in cluster
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditCategory(cat)}
                      className="h-7 w-7 text-muted-foreground hover:text-cyan-400 rounded-lg"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget({ type: "category", id: cat.id })}
                      className="h-7 w-7 text-muted-foreground hover:text-destructive rounded-lg"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {catSkills.length === 0 ? (
                    <div className="py-5 text-center rounded-xl border border-dashed border-border/70 bg-muted/20 space-y-2.5 p-4">
                      <p className="text-xs text-muted-foreground italic">No skills in this category yet.</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openCreateSkill(cat.id)}
                        className="text-xs h-8 rounded-xl border-border hover:bg-muted"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                        Add Skill to this Category
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/40">
                      {catSkills.map((skill) => (
                        <div key={skill.id} className="py-2.5 flex items-center justify-between gap-3 group">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xs font-medium text-zinc-200 truncate">{skill.name}</span>
                            {skill.isFeatured && (
                              <span title="Featured in 3D Constellation">
                                <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="w-20 sm:w-24 bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-cyan-500 to-violet-500 h-full rounded-full"
                                style={{ width: `${skill.level}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-mono text-muted-foreground w-7 text-right">
                              {skill.level}%
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditSkill(skill)}
                              className="h-6 w-6 text-muted-foreground hover:text-cyan-400 rounded-md"
                              title="Edit Skill"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeleteTarget({ type: "skill", id: skill.id })}
                              className="h-6 w-6 text-muted-foreground hover:text-destructive rounded-md"
                              title="Delete Skill"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Dialog */}
      <Dialog open={isCatOpen} onOpenChange={setIsCatOpen}>
        <DialogContent className="bg-card border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingCategory ? "Edit Skill Category" : "Add Skill Category"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveCategory} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Category Name</Label>
              <Input
                placeholder="e.g. Frontend Architecture, Cloud & DevOps, 3D WebGL"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCatOpen(false)} className="text-xs border-border rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingCat} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-xl">
                {isSavingCat && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                {editingCategory ? "Update Category" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add / Edit Skill Dialog */}
      <Dialog open={isSkillOpen} onOpenChange={setIsSkillOpen}>
        <DialogContent className="bg-card border-border rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingSkill ? "Edit Skill" : "Add Skill to Universe"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveSkill} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Skill Name</Label>
              <Input
                placeholder="e.g. React Three Fiber, Rust, Kubernetes, TypeScript"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-zinc-300">Category Cluster</Label>
              <Select value={skillCategory} onValueChange={setSkillCategory}>
                <SelectTrigger className="bg-background/50 border-border rounded-xl">
                  <SelectValue placeholder="Select cluster" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-xl">
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-xs text-zinc-300">Proficiency Mastery ({skillLevel}%)</Label>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={skillLevel}
                onChange={(e) => setSkillLevel(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="pt-2">
              <Label className="text-xs text-zinc-300 block mb-2">Display Prominence</Label>
              <Toggle
                pressed={skillFeatured}
                onPressedChange={setSkillFeatured}
                variant="sky"
                size="sm"
                className="font-mono text-xs w-full justify-center"
              >
                <Star className="w-3.5 h-3.5 mr-1.5" />
                {skillFeatured ? "Featured in 3D Constellation" : "Standard Skill"}
              </Toggle>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsSkillOpen(false)} className="text-xs border-border rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={isSavingSkill} className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-xs rounded-xl">
                {isSavingSkill && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
                {editingSkill ? "Save Changes" : "Add Skill"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
        title={`Delete ${deleteTarget?.type === "category" ? "Category" : "Skill"}?`}
      />
    </div>
  );
}
