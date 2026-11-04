"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Mail, Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid credentials", {
          description: "Please check your admin email and password.",
        });
        setIsLoading(false);
        return;
      }

      toast.success("Authentication successful", {
        description: "Entering 3D Developer CMS...",
      });
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Authentication failed", {
        description: "An unexpected error occurred during sign in.",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground relative overflow-hidden transition-colors">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-violet-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      <Card className="w-full max-w-md bg-card/80 backdrop-blur-xl border-border/80 shadow-2xl relative z-10">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 mb-2 text-white">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
            <span>Admin Control Nexus</span>
            <Sparkles className="w-4 h-4 text-cyan-500" />
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Enter authorized credentials to manage Arun M&apos;s 3D architecture portfolio.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium text-foreground">
                Admin Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-9 bg-background/50 border-border text-sm"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-medium text-foreground">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9 bg-background/50 border-border text-sm"
                  {...register("password")}
                />
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-semibold text-xs h-10 shadow-lg shadow-cyan-500/20 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying Identity...
                </>
              ) : (
                "Authenticate & Launch"
              )}
            </Button>

            <div className="pt-2 text-center space-y-3">
              <p className="text-[11px] text-muted-foreground">
                Protected by NextAuth JWT sessions & DPDP 2023 security protocols.
              </p>
              <div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Return to 3D Public Portfolio
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
