import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MarketingLayout } from "@/components/MarketingLayout";
import { ScrollToTop } from "@/components/ScrollToTop";

const HomePage = lazy(() => import("./pages/HomePage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const FonctionnalitesPage = lazy(() => import("./pages/FonctionnalitesPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const MentionsLegalesPage = lazy(() => import("./pages/MentionsLegalesPage"));
const CguPage = lazy(() => import("./pages/CguPage"));
const AProposPage = lazy(() => import("./pages/AProposPage"));
const PolitiqueConfidentialitePage = lazy(() => import("./pages/PolitiqueConfidentialitePage"));
const RoadmapPage = lazy(() => import("./pages/RoadmapPage"));
const ChangelogPage = lazy(() => import("./pages/ChangelogPage"));
const RecrutementPage = lazy(() => import("./pages/RecrutementPage"));
const EFacturePage = lazy(() => import("./pages/EFacturePage"));
const DiagnosticPage = lazy(() => import("./pages/DiagnosticPage"));
const GenerateurFacturXPage = lazy(() => import("./pages/GenerateurFacturXPage"));
const ArtisansPage = lazy(() => import("./pages/ArtisansPage"));
const MetierPage = lazy(() => import("./pages/MetierPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route element={<MarketingLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/fonctionnalites" element={<FonctionnalitesPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
                <Route path="/cgu" element={<CguPage />} />
                <Route path="/a-propos" element={<AProposPage />} />
                <Route path="/politique-confidentialite" element={<PolitiqueConfidentialitePage />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/changelog" element={<ChangelogPage />} />
                <Route path="/recrutement" element={<RecrutementPage />} />
                <Route path="/e-facture" element={<EFacturePage />} />
                <Route path="/diagnostic" element={<DiagnosticPage />} />
                <Route path="/generateur-factur-x" element={<GenerateurFacturXPage />} />
                <Route path="/artisans" element={<ArtisansPage />} />
                <Route path="/commerce" element={<MetierPage slug="commerce" />} />
                <Route path="/professions-liberales" element={<MetierPage slug="professions-liberales" />} />
                <Route path="/cabinets-comptables" element={<MetierPage slug="cabinets-comptables" />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
