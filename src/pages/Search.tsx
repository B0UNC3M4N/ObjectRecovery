
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type LostItem = {
  id: string;
  name: string;
  phone: string;
  place_found: string;
  location_to_collect: string;
  image_url: string;
  user_id: string;
  created_at: string;
};

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [items, setItems] = useState<LostItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "recent" | "all-items">("all");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('lost_items')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        setItems(data || []);
        setFilteredItems(data || []);
      } catch (error: any) {
        console.error("Error fetching items:", error);
        toast.error(error.message || "Failed to fetch items");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchItems();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = [...items];
    
    if (searchTerm) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.place_found.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filter === 'recent') {
      // Last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      result = result.filter(item => 
        new Date(item.created_at) >= sevenDaysAgo
      );
    }
    
    setFilteredItems(result);
  }, [searchTerm, items, filter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchTerm ? { q: searchTerm } : {});
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Search For Missing Items</h1>

      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Search for missing item......"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-10 py-6 bg-gray-100 rounded-md"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <SearchIcon className="h-5 w-5 text-gray-500" />
            </div>
          </div>
          <Button type="submit" className="bg-findora-navy">Search</Button>
        </form>
      </div>

      <div className="mb-8">
        <div className="flex gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"} 
            className={`rounded-full px-6 ${filter === "all" ? "bg-findora-navy" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button 
            variant={filter === "recent" ? "default" : "outline"} 
            className={`rounded-full px-6 ${filter === "recent" ? "bg-findora-navy" : ""}`}
            onClick={() => setFilter("recent")}
          >
            Recent
          </Button>
          <Button 
            variant={filter === "all-items" ? "default" : "outline"} 
            className={`rounded-full px-6 ${filter === "all-items" ? "bg-findora-navy" : ""}`}
            onClick={() => setFilter("all-items")}
          >
            View All
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-findora-navy"></div>
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="group">
              <div className="mb-2 aspect-square overflow-hidden rounded-md">
                <img
                  src={item.image_url || "https://via.placeholder.com/300"}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/300?text=Image+Not+Found";
                  }}
                />
              </div>
              <div className="text-center">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-gray-500">Found at: {item.place_found}</p>
                <Button variant="outline" size="sm" className="mt-2">View Details</Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-700">No items found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <div className="flex justify-center mt-8 gap-2">
        <Button variant="outline" size="icon" disabled>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
        </Button>
        <Button variant="outline" size="icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default Search;
