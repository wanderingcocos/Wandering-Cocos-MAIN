import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WelcomeGreeting } from "@/components/WelcomeGreeting";
import LandingPage from "@/pages/LandingPage";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import ShippingPolicy from "@/pages/ShippingPolicy";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import Reserve from "@/pages/Reserve";
import JoinTheCircle from "@/pages/JoinTheCircle";
import RefundPolicy from "@/pages/RefundPolicy";
import NotFound from "@/pages/not-found";
import VideoPromo from "@/pages/VideoPromo";
import TheArchives from "@/pages/TheArchives";
import Gifting from "@/pages/Gifting";
import Recipes from "@/pages/Recipes";
import Admin from "@/pages/Admin";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);
  return null;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/video" component={VideoPromo} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/shipping" component={ShippingPolicy} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={FAQ} />
      <Route path="/reserve" component={Reserve} />
      <Route path="/join" component={JoinTheCircle} />
      <Route path="/refund-policy" component={RefundPolicy} />
      <Route path="/archive" component={TheArchives} />
      <Route path="/gifting" component={Gifting} />
      <Route path="/recipes" component={Recipes} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WelcomeGreeting />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ScrollToTop />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
