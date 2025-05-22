
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { setDatadogUser } from "@/utils/datadog";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth event:", event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === "SIGNED_IN" && currentSession) {
          // Track user in Datadog
          try {
            const userData = currentSession.user?.user_metadata;
            const name = userData?.name || 'Unknown User';
            const email = currentSession.user?.email || 'unknown@example.com';
            setDatadogUser(currentSession.user?.id || 'anonymous', name, email);
          } catch (error) {
            console.warn('Failed to set Datadog user:', error);
            // Continue with sign-in process even if Datadog fails
          }
          
          toast.success("Signed in successfully");
          setTimeout(() => {
            navigate("/");
          }, 0);
        }
        if (event === "SIGNED_OUT") {
          // Reset Datadog user to anonymous
          try {
            setDatadogUser('anonymous', 'Anonymous User', 'anonymous@example.com');
          } catch (error) {
            console.warn('Failed to reset Datadog user:', error);
            // Continue with sign-out process even if Datadog fails
          }
          
          toast.info("Signed out");
          setTimeout(() => {
            navigate("/login");
          }, 0);
        }
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        throw error;
      }
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) {
        toast.error(error.message);
        throw error;
      }
      
      toast.success("Signup successful! Please check your email for verification.");
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
        throw error;
      }
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
