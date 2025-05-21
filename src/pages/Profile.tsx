import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import { checkIsAdmin } from "@/utils/supabaseHelpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

type LostItem = {
  id: string;
  name: string;
  phone: string;
  place_found: string;
  location_to_collect: string;
  image_url: string | null;
  created_at: string;
};

type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
};

const profileSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(50),
  phone: z.string().min(6, "Phone number must be at least 6 digits").max(15),
});

const Profile = () => {
  const [userItems, setUserItems] = useState<LostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      phone: "",
    },
  });

  // Check if user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const adminStatus = await checkIsAdmin(user.id);
        setIsAdmin(adminStatus);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  // Fetch user profile and items
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      setIsLoading(true);
      
      try {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        if (profileData) {
          setProfile(profileData);
          form.reset({
            full_name: profileData.full_name || "",
            phone: profileData.phone || "",
          });
        }
        
        // Fetch user's lost items
        const { data: itemsData, error: itemsError } = await supabase
          .from('lost_items')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
          
        if (itemsError) {
          throw itemsError;
        }
        
        setUserItems(itemsData || []);
      } catch (error: any) {
        console.error("Error fetching user data:", error);
        toast.error(error.message || "Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, form]);

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: values.full_name,
          phone: values.phone,
          updated_at: new Date().toISOString(),
        });
        
      if (error) {
        throw error;
      }
      
      toast.success("Profile updated successfully");
      
      // Update local state
      setProfile(prev => {
        if (!prev) return null;
        return {
          ...prev,
          full_name: values.full_name,
          phone: values.phone,
        };
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-findora-navy"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Your Profile</h1>

      {isAdmin && (
        <Card className="mb-8 border-amber-300 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Admin Access</h3>
                <p className="text-amber-700">You have administrator privileges</p>
              </div>
              <Button asChild className="bg-amber-600 hover:bg-amber-700">
                <Link to="/admin">Admin Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="678308859" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-findora-navy"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Updating...
                      </div>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Lost Items</CardTitle>
            </CardHeader>
            <CardContent>
              {userItems.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Found At</TableHead>
                      <TableHead>Date Posted</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.image_url ? (
                            <img 
                              src={item.image_url} 
                              alt={item.name}
                              className="h-12 w-12 object-cover rounded-md"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Not+Found";
                              }}
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-200 rounded-md"></div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.place_found}</TableCell>
                        <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">You haven't posted any lost items yet</p>
                  <Button asChild className="mt-4 bg-findora-navy">
                    <Link to="/upload">Upload an Item</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
