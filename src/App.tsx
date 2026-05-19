import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { RestaurantProvider } from "@/context/RestaurantContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Billing from "./pages/Billing";
import Scanner from "./pages/Scanner";
import Inventory from "./pages/Inventory";
import Forecast from "./pages/Forecast";
import Social from "./pages/Social";
import Assistant from "./pages/Assistant";
import Voice from "./pages/Voice";
import AlgorithmInsights from "./pages/AlgorithmInsights";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <RestaurantProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="billing" element={<Billing />} />
            <Route path="scan" element={<Scanner />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="forecast" element={<Forecast />} />
            <Route path="social" element={<Social />} />
            <Route path="assistant" element={<Assistant />} />
            <Route path="voice" element={<Voice />} />
            <Route path="daa" element={<AlgorithmInsights />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </RestaurantProvider>
  </QueryClientProvider>
);

export default App;
