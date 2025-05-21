
import { Suspense } from "react";
import Home from "./Home";
import AdminBanner from "@/components/AdminBanner";

const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-findora-navy"></div>
  </div>
);

const Index = () => {
  return (
    <>
      <AdminBanner />
      <Suspense fallback={<Loading />}>
        <Home />
      </Suspense>
    </>
  );
};

export default Index;
