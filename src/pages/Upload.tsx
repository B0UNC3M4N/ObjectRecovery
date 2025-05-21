
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload as UploadIcon } from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { testStorageUpload } from "@/utils/supabaseHelpers";

const Upload = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [placeFound, setPlaceFound] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingPermission, setIsCheckingPermission] = useState(true);
  const [hasUploadPermission, setHasUploadPermission] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Check upload permissions when component loads
  useEffect(() => {
    const checkPermissions = async () => {
      setIsCheckingPermission(true);
      if (user) {
        const canUpload = await testStorageUpload(user.id);
        setHasUploadPermission(canUpload);
        
        if (!canUpload) {
          toast.warning("You don't have permission to upload files. Please try refreshing the page or contact support.");
        }
      }
      setIsCheckingPermission(false);
    };
    
    // Only check permissions if user is logged in
    if (user) {
      checkPermissions();
    } else {
      setIsCheckingPermission(false);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to upload an item");
      navigate("/login");
      return;
    }
    
    if (!image) {
      toast.error("Please upload an image of the item");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Upload the image to Supabase Storage
      const fileExt = image.name.split('.').pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload the file
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('lost-items')
        .upload(filePath, image);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: publicUrlData } = supabase
        .storage
        .from('lost-items')
        .getPublicUrl(filePath);
        
      const imageUrl = publicUrlData.publicUrl;
      
      // Save the item info to the database
      const { data, error } = await supabase
        .from('lost_items')
        .insert({
          name,
          phone,
          place_found: placeFound,
          location_to_collect: location,
          image_url: imageUrl,
          user_id: user.id
        });
        
      if (error) {
        throw error;
      }
      
      toast.success("Item uploaded successfully!");
      
      // Clear the form
      setName("");
      setPhone("");
      setLocation("");
      setPlaceFound("");
      setImage(null);
      setImagePreview(null);
      
      // Redirect to search page
      navigate("/search");
      
    } catch (error: any) {
      console.error("Error uploading item:", error);
      toast.error(error.message || "Failed to upload item");
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingPermission) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-3xl mx-auto p-8 bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Checking Upload Permissions</h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-findora-navy"></div>
            </div>
            <p className="mt-4 text-gray-600">Please wait while we verify your upload permissions...</p>
          </div>
        </Card>
      </div>
    );
  }

  // Show permission error if needed and retry option
  if (!isCheckingPermission && !hasUploadPermission && user) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-3xl mx-auto p-8 bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Permission Error</h1>
            <p className="mb-4">You don't have permission to upload files. This could be due to missing storage policies.</p>
            <Button 
              onClick={() => {
                setIsCheckingPermission(true);
                // Retry permission check
                testStorageUpload(user.id).then(canUpload => {
                  setHasUploadPermission(canUpload);
                  setIsCheckingPermission(false);
                  
                  if (!canUpload) {
                    toast.error("Still having permission issues. Please try logging out and back in.");
                  }
                });
              }}
            >
              Retry
            </Button>
            <Button 
              variant="outline" 
              className="ml-2"
              onClick={() => navigate("/search")}
            >
              Return to Search
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Register Missing items</h1>

      <Card className="max-w-3xl mx-auto p-8 bg-gray-50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  className="bg-findora-navy"
                  onClick={() => document.getElementById("upload-image")?.click()}
                >
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                <Input
                  id="upload-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="text-sm text-gray-500 overflow-hidden text-ellipsis">
                    {image?.name}
                  </div>
                )}
              </div>

              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto max-h-60 object-contain rounded-md"
                  />
                </div>
              )}
            </div>

            <div className="col-span-1 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Name on missing items:
                </label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-1">
                  Enter your number
                </label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="678308859"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="place" className="block text-sm font-medium mb-1">
                Place found
              </label>
              <Input
                id="place"
                value={placeFound}
                onChange={(e) => setPlaceFound(e.target.value)}
                placeholder="UB_Campus"
                required
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium mb-1">
                Location to collect
              </label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="UB_Class Room Block"
                required
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              type="submit" 
              className="bg-findora-navy px-10"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Upload;
