
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const GetTag = () => {
  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Get a Tag</h1>
          <p className="text-xl mb-4">Never lose it for good again.</p>
          
          <p className="mb-4">Our smart tags connect finders directly to you.</p>
          <p className="mb-4">Simple to use, colorful in action.</p>
          <p className="mb-4">Powered by Findora's secure technology.</p>
          <p className="mb-6">FindBack - because everything valuable deserves a way back.</p>
          
          <Button className="bg-findora-navy text-white mb-6">
            Know more
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="font-medium mb-4">How it works:</h2>
            <ol className="list-decimal list-inside space-y-2">
              <li>Order your personalized Findora tag</li>
              <li>Attach it to your valuable items</li>
              <li>If lost, the finder scans the QR code</li>
              <li>You get notified immediately</li>
              <li>Arrange return of your item securely</li>
            </ol>
          </div>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w0NTQ0MTZ8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTU4MDEyMzd8&ixlib=rb-4.0.3&q=80&w=512" 
              alt="Findora Tag" 
              className="w-full h-auto rounded-lg mb-4"
            />
            
            <div className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Name:</div>
                  <div className="bg-gray-100 p-2 rounded">John</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Phone:</div>
                  <div className="bg-gray-100 p-2 rounded">+1 234 567 890</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Address:</div>
                  <div className="bg-gray-100 p-2 rounded">123 Main St, Anytown</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-gray-800 text-white p-4 w-full rounded-lg flex items-center justify-center">
                <svg className="w-32 h-32" viewBox="0 0 100 100">
                  <rect x="10" y="10" width="30" height="30" fill="white" />
                  <rect x="60" y="10" width="30" height="30" fill="white" />
                  <rect x="10" y="60" width="30" height="30" fill="white" />
                  <rect x="50" y="40" width="10" height="10" fill="white" />
                  <rect x="60" y="60" width="10" height="10" fill="white" />
                  <rect x="80" y="60" width="10" height="10" fill="white" />
                  <rect x="70" y="70" width="10" height="10" fill="white" />
                  <rect x="60" y="80" width="10" height="10" fill="white" />
                  <rect x="80" y="80" width="10" height="10" fill="white" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-findora-lightblue p-6 rounded-lg text-center">
            <div className="text-4xl font-bold text-findora-navy mb-2">Basic</div>
            <div className="text-2xl mb-6">$9.99</div>
            <ul className="space-y-2 text-left mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                1 QR Code Tag
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Basic Notification
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                6 Months Service
              </li>
            </ul>
            <Button className="w-full bg-findora-navy">
              Order Now
            </Button>
          </div>
          
          <div className="bg-findora-navy text-white p-6 rounded-lg text-center relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-findora-navy font-medium px-4 py-1 rounded-full">
              Most Popular
            </div>
            <div className="text-4xl font-bold mb-2">Standard</div>
            <div className="text-2xl mb-6">$19.99</div>
            <ul className="space-y-2 text-left mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                3 QR Code Tags
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                SMS + Email Notifications
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                1 Year Service
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Finder Reward Option
              </li>
            </ul>
            <Button className="w-full bg-white text-findora-navy hover:bg-gray-100">
              Order Now
            </Button>
          </div>
          
          <div className="bg-findora-lightblue p-6 rounded-lg text-center">
            <div className="text-4xl font-bold text-findora-navy mb-2">Premium</div>
            <div className="text-2xl mb-6">$29.99</div>
            <ul className="space-y-2 text-left mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                5 QR Code Tags
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                All Notifications
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Lifetime Service
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Courier Return Service
              </li>
            </ul>
            <Button className="w-full bg-findora-navy">
              Order Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetTag;
