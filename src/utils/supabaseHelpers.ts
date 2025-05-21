
import { supabase } from "@/integrations/supabase/client";

/**
 * Checks if the lost-items bucket exists, creates it if not
 */
export const setupLostItemsBucket = async () => {
  try {
    // Check if bucket exists first to avoid unnecessary operations
    const { data: buckets, error: listError } = await supabase
      .storage
      .listBuckets();
      
    if (listError) {
      console.error("Error listing buckets:", listError);
      return false;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'lost-items');
    
    if (!bucketExists) {
      // Create bucket if it doesn't exist
      const { error: bucketError } = await supabase.storage.createBucket('lost-items', {
        public: true
      });

      if (bucketError) {
        console.error("Error creating lost-items bucket:", bucketError);
        return false;
      }
      console.log("Created lost-items bucket successfully");
    }
    
    return true;
  } catch (error) {
    console.error("Error in setupLostItemsBucket:", error);
    return false;
  }
};

/**
 * Check if the lost_items table has row level security enabled
 */
export const checkLostItemsRLS = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('lost_items')
      .select('*')
      .limit(1);

    if (error) {
      console.error("RLS might be blocking access:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error checking RLS:", error);
    return false;
  }
};

/**
 * Test the ability to upload files to the storage bucket
 */
export const testStorageUpload = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) {
      console.warn("No user ID provided for storage upload test");
      return false;
    }
    
    // Create a small test file
    const testBlob = new Blob(['test'], { type: 'text/plain' });
    const testFilePath = `${userId}/test-permission.txt`;
    
    // Try to upload the test file
    const { error: uploadError } = await supabase
      .storage
      .from('lost-items')
      .upload(testFilePath, testBlob, { upsert: true });
      
    if (uploadError) {
      console.error("Storage upload test failed:", uploadError);
      return false;
    }
    
    // Clean up the test file
    await supabase.storage.from('lost-items').remove([testFilePath]);
    console.log("Storage upload test successful");
    
    return true;
  } catch (error) {
    console.error("Error testing storage upload:", error);
    return false;
  }
};

/**
 * Check if the current user is an admin
 */
export const checkIsAdmin = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) {
      return false;
    }
    
    const { data, error } = await supabase
      .rpc('is_admin', { user_id: userId });
      
    if (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
    
    return data || false;
  } catch (error) {
    console.error("Error in checkIsAdmin:", error);
    return false;
  }
};

/**
 * Delete a lost item
 */
export const deleteLostItem = async (itemId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('lost_items')
      .delete()
      .eq('id', itemId);
      
    if (error) {
      console.error("Error deleting lost item:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteLostItem:", error);
    return false;
  }
};
