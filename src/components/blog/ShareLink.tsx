import { ArrowUpRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { fr } from "@/lib/typo";

/**
 * Partage B2B sobre et souverain : « Copier le lien » + LinkedIn (lien simple).
 * Aucun SDK tiers, aucun traceur, aucun compteur de partages.
 */
export function ShareLink({ url, title }: { url: string; title: string }) {
  const { toast } = useToast();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: "Lien copié", description: "Vous pouvez le coller où vous voulez." });
    } catch {
      toast({ title: "Impossible de copier le lien", variant: "destructive" });
    }
  };

  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.9375rem] text-muted-foreground">
      <span>{fr("Partager cet article :")}</span>
      <button type="button" onClick={copy} className="min-h-10 font-bold text-foreground link-underline">
        Copier le lien
      </button>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={fr(`Partager « ${title} » sur LinkedIn (nouvel onglet)`)}
        className="inline-flex min-h-10 items-center gap-1 font-bold text-foreground link-underline"
      >
        LinkedIn
        <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" />
      </a>
    </p>
  );
}
