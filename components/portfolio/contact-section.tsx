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

export function ContactSection({ profile, socialLinks = [] }: ContactSectionProps) {
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
    <section id="contact" className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14 items-start">
          {/* Left Column: Direct Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-xs font-mono text-sky-600 dark:text-sky-400">
              <Mail className="w-3.5 h-3.5" />
              <span>{t("contact.badge", "Get In Touch")}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              {t("contact.title", "Let's Build Something Exceptional")}
            </h2>

            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {t("contact.subtitle", "Reach out for architectural consulting, enterprise contract development, or full-time roles.")}
            </p>

            {/* Quick Contact Info */}
            <div className="space-y-3 pt-4 border-t border-border text-xs">
              <div className="flex items-center gap-3 text-foreground/90 p-2.5 rounded-xl bg-card/60 border border-border">
                <Mail className="w-4 h-4 text-sky-500 shrink-0" />
                <span className="font-mono">{profile?.email || "arun@arun-m.in"}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/90 p-2.5 rounded-xl bg-card/60 border border-border">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>{profile?.location || "Bangalore, India (Available Worldwide Remote)"}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground/90 p-2.5 rounded-xl bg-card/60 border border-border">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>
                  {language === "ar" ? "زمن الرد المتوقع: أقل من 24 ساعة" : "Typical response latency: < 24 hours"}
                </span>
              </div>
            </div>

            {/* Social handles list */}
            {(socialLinks || []).length > 0 && (
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
                      className="px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 border border-border text-xs text-foreground transition-all flex items-center gap-1.5 shadow-xs"
                    >
                      <span>{s.label || s.platform}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-10 relative overflow-hidden border border-border shadow-xl">
            {isSuccess ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {t("contact.successHeading", "Communication Link Established")}
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  {t("contact.successMessage", "Your dispatch has been registered with encrypted DPDP audit timestamps. Arun will respond promptly.")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSuccess(false)}
                  className="rounded-xl text-xs h-9"
                >
                  {t("contact.sendAnother", "Send Another Message")}
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-name" className="text-xs font-medium text-foreground">
                      {t("contact.formName", "Your Name *")}
                    </Label>
                    <Input
                      id="contact-name"
                      placeholder="Jane Doe"
                      className="h-11 bg-card/60 border-border text-xs rounded-xl"
                      {...register("name")}
                    />
                    {errors.name && <p className="text-[11px] text-destructive">{errors.name.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-email" className="text-xs font-medium text-foreground">
                      {t("contact.formEmail", "Your Email *")}
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      placeholder="jane@company.com"
                      className="h-11 bg-card/60 border-border text-xs rounded-xl"
                      {...register("email")}
                    />
                    {errors.email && <p className="text-[11px] text-destructive">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="contact-company" className="text-xs font-medium text-foreground">
                      {t("contact.formCompany", "Company / Organization")}
                    </Label>
                    <Input
                      id="contact-company"
                      placeholder="Enterprise Corp"
                      className="h-11 bg-card/60 border-border text-xs rounded-xl"
                      {...register("company")}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-subject" className="text-xs font-medium text-foreground">
                      {t("contact.formSubject", "Subject *")}
                    </Label>
                    <Input
                      id="contact-subject"
                      placeholder="Architecture Advisory / Project"
                      className="h-11 bg-card/60 border-border text-xs rounded-xl"
                      {...register("subject")}
                    />
                    {errors.subject && <p className="text-[11px] text-destructive">{errors.subject.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="contact-message" className="text-xs font-medium text-foreground">
                    {t("contact.formMessage", "Message Details *")}
                  </Label>
                  <Textarea
                    id="contact-message"
                    rows={4}
                    placeholder="Describe your architectural scope, project milestones, or collaboration vision..."
                    className="bg-card/60 border-border text-xs rounded-xl resize-none"
                    {...register("message")}
                  />
                  {errors.message && <p className="text-[11px] text-destructive">{errors.message.message}</p>}
                </div>

                {/* DPDP Act 2023 Explicit Consent Checkbox */}
                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    id="consentGiven"
                    type="checkbox"
                    className="mt-0.5 size-4 rounded accent-sky-500 cursor-pointer"
                    {...register("consentGiven")}
                  />
                  <label htmlFor="consentGiven" className="text-[11px] text-muted-foreground leading-snug cursor-pointer">
                    {language === "ar"
                      ? "أوافق على معالجة بيانات الاتصال هذه للرد على طلبي، وفقًا لسياسة الخصوصية وقانون حماية البيانات الرقمية DPDP Act 2023."
                      : "I consent to the collection and cryptographic logging of this message strictly for correspondence purposes in compliance with India's DPDP Act 2023."}{" "}
                    <Link href="/legal/privacy-policy" className="text-sky-600 dark:text-sky-400 underline font-medium">
                      {t("contact.privacyLink", "Privacy Policy")}
                    </Link>
                  </label>
                </div>
                {errors.consentGiven && (
                  <p className="text-[11px] text-destructive">{errors.consentGiven.message}</p>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 sm:h-12 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-xs sm:text-sm shadow-md shadow-sky-500/20 mt-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {language === "ar" ? "جارٍ إرسال الرسالة..." : "Transmitting Encrypted Message..."}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2 rtl:rotate-180" />
                      {t("contact.submitButton", "Transmit Message")}
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
