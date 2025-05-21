
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const AffiliateProgram = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here we would normally register with Supabase
    // Will be implemented once Supabase is connected
    
    toast({
      title: "Info",
      description: "Please connect Supabase to enable affiliate program registration",
    });
  };
  
  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <img 
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTQ0MTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTU4MDEzNjJ8&ixlib=rb-4.0.3&q=80&w=512" 
            alt="Person using laptop" 
            className="rounded-lg shadow-lg"
          />
        </div>
        
        <div>
          <h1 className="text-4xl font-bold mb-2">Join Us</h1>
          <h2 className="text-2xl text-gray-600 mb-6">Our Affiliate Program</h2>
          
          <h3 className="text-xl font-medium mb-4">
            Earn While Helping Others Get Found – Join the Findora Affiliate Program!
          </h3>
          
          <p className="mb-4">
            As a finder, help connect valuable people to their lost items – while building a 
            community of connectors.
          </p>
          
          <ul className="space-y-3 mb-8">
            <li className="flex items-start">
              <span className="bg-green-500 text-white rounded-full p-1 mr-2 mt-1">✓</span>
              <span>Join our Affiliate Program and let your influence help people.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-500 text-white rounded-full p-1 mr-2 mt-1">✓</span>
              <span>Get paid for every sign-up tag purchase through you.</span>
            </li>
            <li className="flex items-start">
              <span className="bg-green-500 text-white rounded-full p-1 mr-2 mt-1">✓</span>
              <span>Help others find what matters – and get rewarded for it.</span>
            </li>
          </ul>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="affiliate-email" className="block text-sm font-medium mb-1">
                Enter your email to join
              </label>
              <div className="flex gap-2">
                <Input 
                  id="affiliate-email"
                  type="email" 
                  placeholder="youremail@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" className="bg-findora-navy">
                  Apply Now
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-findora-lightblue p-6 rounded-lg">
            <div className="w-16 h-16 mx-auto bg-findora-navy rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
              1
            </div>
            <h3 className="text-xl font-medium mb-2">Sign Up</h3>
            <p>
              Register for the Findora Affiliate Program with your email and create your profile.
            </p>
          </div>
          
          <div className="text-center bg-findora-lightblue p-6 rounded-lg">
            <div className="w-16 h-16 mx-auto bg-findora-navy rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
              2
            </div>
            <h3 className="text-xl font-medium mb-2">Share Your Link</h3>
            <p>
              Get your unique referral link and share it with your audience on social media, your website, or via email.
            </p>
          </div>
          
          <div className="text-center bg-findora-lightblue p-6 rounded-lg">
            <div className="w-16 h-16 mx-auto bg-findora-navy rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
              3
            </div>
            <h3 className="text-xl font-medium mb-2">Earn Rewards</h3>
            <p>
              Earn a 15% commission on every tag purchase made through your referral link. Get paid monthly.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-16 bg-findora-navy text-white p-8 rounded-lg">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2">Ready to Get Started?</h2>
          <p className="text-xl">Join thousands of affiliates already earning with Findora</p>
        </div>
        
        <div className="flex justify-center">
          <Button className="bg-white text-findora-navy hover:bg-gray-100">
            Check out
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AffiliateProgram;
