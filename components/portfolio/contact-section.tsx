"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { submitContactForm } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Send,
  Loader2,
  CheckCircle2,
  MapPin,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useLanguage } from "@/context/languageContext";

interface ContactSectionProps {
  profile: any;
  socialLinks: any[];
}

export function ContactSection({ profile, socialLinks }: ContactSectionProps) {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      phone: "",
      company: "",
      consentGiven: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await submitContactForm(data);
      if (res.success) {
        setIsSuccess(true);
        toast.success(t("contact.successTitle", "Message Transmitted Successfully"), {
          description: t("contact.successDesc", "Thank you for reaching out. A confirmation has been logged and you will receive a response shortly."),
        });
        reset();
      } else {
        toast.error("Transmission failed", { description: res.error });
      }
    } catch {
      toast.error("An unexpected error occurred while transmitting message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-600 dark:text-cyan-400">
              <Mail className="w-3.5 h-3.5" />
              <span>{t("contact.badge", "Get in touch")}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {t("contact.title", "Let's Build Something Exceptional")}
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {t("contact.subtitle", "Reach out for architectural consulting, enterprise contract development, or full-time roles.")}
            </p>

            {/* Quick Contact Info */}
            <div className="space-y-3 pt-4 border-t border-border text-xs">
              <div className="flex items-center gap-3 text-foreground/90">
                <Mail className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>{profile?.email || "arun@arun-m.in"}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/90">
                <MapPin className="w-4 h-4 text-violet-500 shrink-0" />
                <span>{profile?.location || "Bangalore, India (Available Worldwide Remote)"}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/90">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  {language === "ar" ? "زمن الرد المتوقع: أقل من 24 ساعة" : "Typical response latency: < 24 hours"}
                </span>
              </div>
            </div>

            {/* Social handles list */}
            {socialLinks.length > 0 && (
              <div className="pt-6 border-t border-border">
                <h4 className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-3">
                  {language === "ar" ? "الشبكات المهنية وروابط المطور" : "Developer Handles & Networks"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.map((s) => (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 border border-border text-xs text-foreground transition-all flex items-center gap-1.5"
                    >
                      <span>{s.label || s.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-8 sm:p-10 relative overflow-hidden border border-border">
            {isSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{t("contact.successTitle", "Transmission Successful")}</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                  {t("contact.successDesc", "Your message and DPDP Act 2023 consent record have been logged.")}
                </p>
                <Button
                  size="sm"
                  onClick={() => setIsSuccess(false)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-white font-semibold text-xs mt-4"
                >
                  {language === "ar" ? "إرسال رسالة أخرى" : "Send Another Inquiry"}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-foreground font-medium">{t("contact.name", "Your Full Name")} *</Label>
                    <Input
                      placeholder={t("contact.namePlaceholder", "Jane Doe")}
                      {...register("name")}
                      className="bg-background text-foreground text-xs border-border"
                    />
                    {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-foreground font-medium">{t("contact.email", "Email Address")} *</Label>
                    <Input
                      type="email"
                      placeholder={t("contact.emailPlaceholder", "jane@example.com")}
                      {...register("email")}
                      className="bg-background text-foreground text-xs border-border"
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-foreground font-medium">{t("contact.subject", "Project Scope / Subject")} *</Label>
                  <Input
                    placeholder={t("contact.subjectPlaceholder", "Architecture Redesign & 3D Implementation")}
                    {...register("subject")}
                    className="bg-background text-foreground text-xs border-border"
                  />
                  {errors.subject && <p className="text-xs text-destructive">{errors.subject.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label className="text-xs text-foreground font-medium">{t("contact.message", "Message / Brief")} *</Label>
                  <Textarea
                    rows={4}
                    placeholder={t("contact.messagePlaceholder", "Tell me about your project, timeline, and technical objectives...")}
                    {...register("message")}
                    className="bg-background text-foreground text-xs border-border resize-none"
                  />
                  {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                </div>

                {/* Statutory DPDP Act 2023 Consent Checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register("consentGiven")}
                      className="mt-0.5 rounded border-border text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-[11px] text-muted-foreground leading-relaxed">
                      {t("contact.consent", "I agree to the processing of my contact information in accordance with DPDP Act 2023 and the Privacy Policy.")}{" "}
                      <Link href="/legal/privacy-policy" className="text-cyan-500 hover:underline">
                        Privacy Policy
                      </Link>.
                    </span>
                  </label>
                  {errors.consentGiven && (
                    <p className="text-xs text-destructive mt-1">{errors.consentGiven.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-xs h-11 rounded-xl shadow-lg shadow-cyan-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("contact.sending", "Transmitting...")}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t("contact.send", "Transmit Message")}
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
