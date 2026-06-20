import { useState } from "react";
import { MotionDiv } from "@/components/MotionDiv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SEOHead } from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  company: z.string().trim().max(100).optional(),
  message: z.string().trim().min(1, "Le message est requis").max(2000),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    if (formData.get("website")) return;

    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      company: (formData.get("company") as string) || undefined,
      message: formData.get("message") as string,
    };

    const result = contactSchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactForm;
        fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: result.data,
      });

      if (error) throw error;

      toast({
        title: "Message envoyé !",
        description: "Merci, nous vous recontacterons dans les plus brefs délais.",
      });
      (event.target as HTMLFormElement).reset();
    } catch {
      toast({
        title: "Erreur",
        description: "L'envoi a échoué. Veuillez réessayer ou nous contacter par email.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <SEOHead
        title="Contact — OdocPilot | Demandez une démo"
        description="Contactez l'équipe OdocPilot pour une démonstration personnalisée de notre solution de facturation et de conformité."
        canonical="/contact"
      />

      <MotionDiv className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">Contactez-nous</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Discutons de la manière dont OdocPilot peut aider votre entreprise. Remplissez le formulaire ou demandez une démo.
        </p>
      </MotionDiv>

      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.32, 0.72, 0, 1] as [number, number, number, number] }}
        viewport={{ once: true }}
        className="mt-12"
      >
        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl shadow-card border border-border">
          <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input type="text" name="website" id="website" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">Nom complet</label>
              <Input type="text" name="name" id="name" required className="mt-1.5" />
              {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">Email professionnel</label>
              <Input type="email" name="email" id="email" required className="mt-1.5" />
              {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-foreground">Entreprise</label>
            <Input type="text" name="company" id="company" className="mt-1.5" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground">Votre message</label>
            <Textarea name="message" id="message" rows={4} required className="mt-1.5" />
            {errors.message && <p className="mt-1 text-xs text-destructive">{errors.message}</p>}
          </div>
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Envoyer le message
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            Vos données sont protégées conformément au RGPD. Nous ne les partagerons jamais.
          </p>
        </form>
      </MotionDiv>
    </div>
  );
}
