
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { checkIsAdmin } from "@/utils/supabaseHelpers";
import { Search, Upload, ArrowRight } from "lucide-react";

const Home = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const verifyAdmin = async () => {
      if (user) {
        try {
          const adminStatus = await checkIsAdmin(user.id);
          setIsAdmin(adminStatus);
        } catch (error) {
          console.error("Error checking admin status:", error);
        }
      }
    };

    verifyAdmin();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mb-16 md:mb-24">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6">
            <span className="text-findora-navy">Find it with Findora</span>
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
            The easiest way to find your lost items on campus. Our platform connects people who have lost items with those who have found them.
          </p>
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <Button asChild size="lg" className="bg-findora-navy px-6 py-5 text-base">
              <Link to="/search" className="flex items-center">
                <Search className="mr-2 h-5 w-5" />
                Find Lost Items
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-6 py-5 text-base">
              <Link to="/upload" className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Register Found Item
              </Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 mt-8 md:mt-0">
          <img
            src="/images/hero-image.png"
            alt="Lost and Found"
            className="w-full h-auto rounded-lg shadow-xl"
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
            <div className="bg-findora-navy w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Register Found Item</h3>
            <p className="text-gray-600">
              Found something? Register it on our platform with details and a photo.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
            <div className="bg-findora-navy w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Search Lost Items</h3>
            <p className="text-gray-600">
              Lost something? Search our database to see if someone has found it.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
            <div className="bg-findora-navy w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
            <h3 className="text-lg md:text-xl font-semibold mb-2">Get Connected</h3>
            <p className="text-gray-600">
              Found a match? Connect with the finder to arrange collection.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-findora-navy text-white py-12 md:py-16 rounded-lg mb-16 md:mb-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-3xl md:text-4xl font-bold mb-2">500+</p>
              <p className="text-lg md:text-xl">Items Found</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold mb-2">300+</p>
              <p className="text-lg md:text-xl">Happy Users</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold mb-2">95%</p>
              <p className="text-lg md:text-xl">Success Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="mb-16 md:mb-24">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
            <p className="italic mb-4 text-gray-700">
              "I lost my student ID during finals week and was panicking. Someone found it and registered it on Findora. I got it back the same day!"
            </p>
            <p className="font-semibold">- Sarah J., Student</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
            <p className="italic mb-4 text-gray-700">
              "The platform is so easy to use. I found a laptop in the library and wanted to return it to its owner. Thanks to Findora, I was able to do that within hours."
            </p>
            <p className="font-semibold">- Michael T., Faculty</p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center mb-16 md:mb-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Ready to Find What You've Lost?</h2>
        <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
          Join our community today and experience the easiest way to recover lost items on campus.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild className="bg-findora-navy px-6 py-5 text-base">
            <Link to="/search" className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Start Searching
            </Link>
          </Button>
          <Button asChild variant="outline" className="px-6 py-5 text-base">
            <Link to="/signup" className="flex items-center">
              Join Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {isAdmin && (
        <div className="mt-8 p-4 border border-amber-300 bg-amber-50 rounded-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h3 className="font-bold text-amber-800">Admin Access</h3>
              <p className="text-amber-700">You have administrator privileges</p>
            </div>
            <Button asChild className="bg-amber-600 hover:bg-amber-700 mt-4 sm:mt-0">
              <Link to="/admin">Go to Admin Dashboard</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
