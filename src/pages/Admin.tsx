
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { checkIsAdmin, deleteLostItem } from "@/utils/supabaseHelpers";

type LostItem = {
  id: string;
  name: string;
  phone: string;
  place_found: string;
  location_to_collect: string;
  image_url: string | null;
  user_id: string | null;
  created_at: string;
};

const Admin = () => {
  const [items, setItems] = useState<LostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Check if user is an admin
  useEffect(() => {
    const verifyAdmin = async () => {
      if (user) {
        const adminStatus = await checkIsAdmin(user.id);
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          toast.error("You don't have permission to access the admin dashboard");
          navigate("/");
        }
      } else {
        navigate("/login");
      }
    };
    
    verifyAdmin();
  }, [user, navigate]);
  
  // Fetch all items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('lost_items')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setItems(data || []);
      } catch (error: any) {
        console.error("Error fetching items:", error);
        toast.error(error.message || "Failed to fetch items");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (isAdmin) {
      fetchItems();
    }
  }, [isAdmin]);

  const handleDelete = async (itemId: string) => {
    try {
      setDeletingItemId(itemId);
      
      const success = await deleteLostItem(itemId);
      
      if (success) {
        // Update the items list
        setItems(prev => prev.filter(item => item.id !== itemId));
        toast.success("Item deleted successfully");
      }
    } catch (error: any) {
      console.error("Error deleting item:", error);
      toast.error(error.message || "Failed to delete item");
    } finally {
      setDeletingItemId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-3xl mx-auto p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Verifying permissions...</h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-findora-navy"></div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Admin Dashboard</h1>

      <Card>
        <CardHeader>
          <CardTitle>Lost Items Management</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center my-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-findora-navy"></div>
            </div>
          ) : items.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Found At</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date Posted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="h-16 w-16 object-cover rounded-md"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Not+Found";
                          }}
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded-md flex items-center justify-center">
                          <span className="text-xs text-gray-500">No image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.place_found}</TableCell>
                    <TableCell>{item.phone}</TableCell>
                    <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingItemId === item.id}
                      >
                        {deletingItemId === item.id ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Deleting...
                          </div>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold text-gray-700">No items found</h3>
              <p className="text-gray-500">No lost items have been posted yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Admin;
