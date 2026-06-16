import { Link2, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

/**
 * Partage B2B sobre et souverain : « Copier le lien » + LinkedIn (lien simple).
 * Aucun SDK tiers, aucun tracker, aucun compteur de partages.
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
    <div className="mt-12 flex items-center gap-3 text-sm text-muted-foreground">
      <span className="font-medium">Partager</span>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Link2 className="h-4 w-4" />
        Copier le lien
      </button>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Partager « ${title} » sur LinkedIn`}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Linkedin className="h-4 w-4" />
        LinkedIn
      </a>
    </div>
  );
}
