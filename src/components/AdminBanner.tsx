
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { checkIsAdmin } from "@/utils/supabaseHelpers";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

const AdminBanner = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const verifyAdmin = async () => {
      if (user) {
        try {
          const adminStatus = await checkIsAdmin(user.id);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error("Error checking admin status:", error);
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsChecking(false);
      }
    };

    verifyAdmin();
  }, [user]);

  if (!user || isChecking || !isAdmin) {
    return null;
  }

  return (
    <div className="bg-amber-100 p-2 text-center">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
        <div className="flex items-center">
          <ShieldCheck className="h-4 w-4 mr-2 text-amber-800" />
          <p className="font-medium text-amber-800">You have admin access</p>
        </div>
        <Button asChild size="sm" className="bg-amber-800 hover:bg-amber-900">
          <Link to="/admin">Admin Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminBanner;
