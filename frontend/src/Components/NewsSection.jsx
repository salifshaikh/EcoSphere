import { useState, useEffect } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { firestore } from "../firebase/config";
import NewsCard from "./NewsCard";

const NewsSection = () => {
  const [apiNews, setApiNews] = useState([]);
  const [userSubmittedNews, setUserSubmittedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("api"); // "api" or "community"

  // Fetch API news
  useEffect(() => {
    const fetchApiNews = async () => {
      try {
        const apiKey = "YOUR_NEWS_API_KEY"; // Replace with your actual API key
        const response = await fetch(
          `https://newsapi.org/v2/everything?q=environment+sustainability&sortBy=publishedAt&apiKey=${apiKey}`
        );
        const data = await response.json();
        
        if (data.status === "ok") {
          setApiNews(data.articles.slice(0, 10)); // Limit to 10 articles
        } else {
          console.error("Error fetching news:", data.message);
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        // Use sample data when API fails
        setApiNews([
          {
            title: "Example Environmental News",
            description: "This is an example article about environmental issues.",
            publishedAt: new Date(),
            source: { name: "Example Source" },
            urlToImage: "https://via.placeholder.com/300?text=Example+News"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchApiNews();
  }, []);

  // Fetch user-submitted news that has been approved
  useEffect(() => {
    const fetchUserNews = async () => {
      try {
        // Get approved news from Firestore
        const newsRef = collection(firestore, "reportedNews");
        const q = query(
          newsRef,
          where("status", "==", "approved"),
          orderBy("approvedAt", "desc")
        );
        
        const snapshot = await getDocs(q);
        const newsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setUserSubmittedNews(newsData);
      } catch (error) {
        console.error("Error fetching user news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserNews();
  }, []);

  return (
    <div>
      {/* Tabs */}
      <div className="flex mb-6 border-b">
        <button
          className={`px-4 py-2 ${
            activeTab === "api"
              ? "border-b-2 border-green-500 font-medium text-green-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("api")}
        >
          Global News
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "community"
              ? "border-b-2 border-green-500 font-medium text-green-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("community")}
        >
          Community Reports
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "api" && apiNews.map((article, index) => (
            <NewsCard key={`api-${index}`} article={article} />
          ))}
          
          {activeTab === "community" && userSubmittedNews.map((article) => (
            <NewsCard 
              key={`user-${article.id}`} 
              article={article} 
              isUserSubmitted={true} 
            />
          ))}
          
          {activeTab === "community" && userSubmittedNews.length === 0 && (
            <div className="col-span-full text-center p-8 bg-gray-100 dark:bg-gray-700 rounded">
              <p>No community reports available yet. Be the first to share news!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewsSection;