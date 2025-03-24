import React from "react";
import NewsSection from "../Components/NewsSection";
import ReportNewsButton from "../Components/ReportNewsButton";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";

const NewsPage = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="container mx-auto p-4">
        <br></br> 
      <h1 className="text-3xl font-bold mb-6">Environmental News</h1>
      <NewsSection />

      {/* Floating Report News Button */}
      {user && <ReportNewsButton userId={user.uid} />}
    </div>
  );
};

export default NewsPage;