
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CATEGORIES = ["All", "Electronics", "Documents", "Jewelry", "Pets"];

interface Story {
  id: number;
  title: string;
  author: string;
  category: string;
  date: string;
  content: string;
  image: string;
}

const Stories = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Mock stories data
  const stories: Story[] = [
    {
      id: 1,
      title: "Found my laptop after 2 weeks",
      author: "John Smith",
      category: "Electronics",
      date: "May 15, 2025",
      content: "I never thought I'd see my laptop again after leaving it on a train. Thanks to the Findora tag, someone scanned it and contacted me the same day. Incredible service!",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTQ0MTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTU4MDEzNjJ8&ixlib=rb-4.0.3&q=80&w=512"
    },
    {
      id: 2,
      title: "Passport recovered just before my trip",
      author: "Sarah Johnson",
      category: "Documents",
      date: "April 28, 2025",
      content: "I lost my passport just days before my international trip and was panicking. A good samaritan found it and used my Findora tag to return it within hours. You saved my vacation!",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTQ0MTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTU4MDEzNjJ8&ixlib=rb-4.0.3&q=80&w=512"
    },
    {
      id: 3,
      title: "Family heirloom returned",
      author: "Robert Chen",
      category: "Jewelry",
      date: "May 10, 2025",
      content: "My grandmother's necklace fell off during a walk in the park. I thought it was gone forever until I got a notification that someone found it! The tag was small enough to attach to the clasp and saved an irreplaceable memory.",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTQ0MTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTU4MDEzNjJ8&ixlib=rb-4.0.3&q=80&w=512"
    },
    {
      id: 4,
      title: "Rex found his way home",
      author: "Emily White",
      category: "Pets",
      date: "May 5, 2025",
      content: "Our dog Rex slipped out of the yard while we were at work. Thankfully, his collar had a Findora tag, and a neighbor found him just a few blocks away. We were reunited the same afternoon!",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTQ0MTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTU4MDEzNjJ8&ixlib=rb-4.0.3&q=80&w=512"
    },
  ];
  
  const filteredStories = activeCategory === "All" 
    ? stories 
    : stories.filter(story => story.category === activeCategory);
  
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Success Stories</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Real stories from real people who have been reunited with their lost items thanks to Findora.
        Read their experiences and see how our tags have made a difference.
      </p>
      
      <Tabs defaultValue="All" className="mb-10">
        <TabsList className="grid grid-cols-5 max-w-md mx-auto">
          {CATEGORIES.map((category) => (
            <TabsTrigger 
              key={category} 
              value={category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredStories.map((story) => (
          <Card key={story.id} className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
              <div className="h-48 md:h-full">
                <img 
                  src={story.image} 
                  alt={story.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:col-span-2">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl mb-1">{story.title}</h3>
                    <p className="text-sm text-gray-500">By {story.author} | {story.date}</p>
                  </div>
                  <span className="bg-findora-lightblue text-findora-navy text-sm px-3 py-1 rounded-full">
                    {story.category}
                  </span>
                </div>
                <p className="mb-4">
                  {story.content}
                </p>
                <Button variant="link" className="text-findora-navy p-0">
                  Read full story
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="mt-12 bg-findora-lightblue p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Have a Findora success story to share?</h2>
        <p className="mb-6 max-w-2xl mx-auto">
          We'd love to hear about your experience with our tags. Share your story and inspire others 
          to protect their valuable items.
        </p>
        <Button className="bg-findora-navy">
          Share Your Story
        </Button>
      </div>
    </div>
  );
};

export default Stories;
