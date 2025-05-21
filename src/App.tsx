
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Search from "./pages/Search";
import Upload from "./pages/Upload";
import GetTag from "./pages/GetTag";
import Stories from "./pages/Stories";
import AffiliateProgram from "./pages/AffiliateProgram";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import { setupLostItemsBucket, checkLostItemsRLS, testStorageUpload } from "./utils/supabaseHelpers";

const queryClient = new QueryClient();

const AppContent = () => {
  const [systemChecked, setSystemChecked] = useState(false);

  useEffect(() => {
    // Set up the lost items bucket and policies when app initializes
    const initializeSystem = async () => {
      try {
        // 1. Set up the storage bucket
        const bucketSetup = await setupLostItemsBucket();
        if (!bucketSetup) {
          console.warn("Lost items bucket setup incomplete");
        }
        
        // 2. Check if Row Level Security is properly configured
        const rlsConfigured = await checkLostItemsRLS();
        if (!rlsConfigured) {
          toast.warning("Database access is restricted. Some features may not work correctly.");
        }
        
        setSystemChecked(true);
        console.log("System initialization completed");
      } catch (error) {
        console.error("Error during system initialization:", error);
        toast.error("System initialization failed. Please contact support.");
        setSystemChecked(true);
      }
    };
    
    initializeSystem();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<Search />} />
          <Route 
            path="/upload" 
            element={<ProtectedRoute><Upload /></ProtectedRoute>} 
          />
          <Route path="/get-tag" element={<GetTag />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/affiliate" element={<AffiliateProgram />} />
          <Route 
            path="/profile" 
            element={<ProtectedRoute><Profile /></ProtectedRoute>} 
          />
          <Route 
            path="/admin" 
            element={<AdminRoute><Admin /></AdminRoute>} 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
