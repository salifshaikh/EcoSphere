import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, updateDoc, doc, getDoc, orderBy } from "firebase/firestore";
import { firestore, auth } from "../firebase/config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const [reportedNews, setReportedNews] = useState([]);
  const [approvedNews, setApprovedNews] = useState([]);
  const [rejectedNews, setRejectedNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  // Fetch news submissions based on their status
  useEffect(() => {
    if (!user) {
      setLoading(true);
      return;
    }

    // Function to format the data from Firestore
    const formatNewsData = (doc) => ({
      id: doc.id,
      ...doc.data(),
      // Convert timestamps to date strings for display
      createdAt: doc.data().createdAt ? 
        new Date(doc.data().createdAt.toDate()).toLocaleString() : 
        "Unknown date",
      approvedAt: doc.data().approvedAt ? 
        new Date(doc.data().approvedAt.toDate()).toLocaleString() : 
        undefined,
      rejectedAt: doc.data().rejectedAt ? 
        new Date(doc.data().rejectedAt.toDate()).toLocaleString() : 
        undefined
    });

    // Fetch pending news
    const pendingQuery = query(
      collection(firestore, "reportedNews"),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );
    
    const pendingUnsubscribe = onSnapshot(pendingQuery, (querySnapshot) => {
      const pendingNewsData = querySnapshot.docs.map(formatNewsData);
      setReportedNews(pendingNewsData);
      setLoading(false);
    });
    
    // Fetch approved news
    const approvedQuery = query(
      collection(firestore, "reportedNews"),
      where("status", "==", "approved"),
      orderBy("approvedAt", "desc")
    );
    
    const approvedUnsubscribe = onSnapshot(approvedQuery, (querySnapshot) => {
      const approvedNewsData = querySnapshot.docs.map(formatNewsData);
      setApprovedNews(approvedNewsData);
    });
    
    // Fetch rejected news
    const rejectedQuery = query(
      collection(firestore, "reportedNews"),
      where("status", "==", "rejected"),
      orderBy("rejectedAt", "desc")
    );
    
    const rejectedUnsubscribe = onSnapshot(rejectedQuery, (querySnapshot) => {
      const rejectedNewsData = querySnapshot.docs.map(formatNewsData);
      setRejectedNews(rejectedNewsData);
    });
    
    // Cleanup all listeners
    return () => {
      pendingUnsubscribe();
      approvedUnsubscribe();
      rejectedUnsubscribe();
    };
  }, [user]);

  // Approve a news submission
  const handleApprove = async (id) => {
    try {
      const newsRef = doc(firestore, "reportedNews", id);
      await updateDoc(newsRef, { 
        status: "approved",
        approvedAt: new Date(),
        approvedBy: user.uid
      });
      // Success message
      alert("News approved successfully");
    } catch (error) {
      console.error("Error approving news:", error);
      alert("Failed to approve news");
    }
  };

  // Reject a news submission
  const handleReject = async (id) => {
    try {
      const newsRef = doc(firestore, "reportedNews", id);
      await updateDoc(newsRef, { 
        status: "rejected",
        rejectedAt: new Date(),
        rejectedBy: user.uid
      });
      // Success message
      alert("News rejected");
    } catch (error) {
      console.error("Error rejecting news:", error);
      alert("Failed to reject news");
    }
  };

  // Revert an approved or rejected news item back to pending
  const handleRevert = async (id) => {
    try {
      const newsRef = doc(firestore, "reportedNews", id);
      await updateDoc(newsRef, { 
        status: "pending",
        // Remove the approval/rejection fields
        approvedAt: null,
        approvedBy: null,
        rejectedAt: null,
        rejectedBy: null
      });
      // Success message
      alert("News reverted to pending status");
    } catch (error) {
      console.error("Error reverting news:", error);
      alert("Failed to revert news status");
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading...</div>;
  }

  // Determine which data to show based on active tab
  let displayData = [];
  switch (activeTab) {
    case "pending":
      displayData = reportedNews;
      break;
    case "approved":
      displayData = approvedNews;
      break;
    case "rejected":
      displayData = rejectedNews;
      break;
    default:
      displayData = reportedNews;
  }

  return (
    <div className="space-y-4">
      {/* Tab navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "pending"
              ? "border-b-2 border-blue-500 font-medium text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("pending")}
        >
          Pending ({reportedNews.length})
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "approved"
              ? "border-b-2 border-green-500 font-medium text-green-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("approved")}
        >
          Approved ({approvedNews.length})
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "rejected"
              ? "border-b-2 border-red-500 font-medium text-red-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected ({rejectedNews.length})
        </button>
      </div>
      
      {/* Display count and headlines */}
      <h2 className="text-2xl font-bold mb-4">
        {activeTab === "pending" && "Pending News Submissions"}
        {activeTab === "approved" && "Approved News"}
        {activeTab === "rejected" && "Rejected News"}
      </h2>
      
      {/* Display appropriate message if no items */}
      {displayData.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
          {activeTab === "pending" && "No pending news submissions"}
          {activeTab === "approved" && "No approved news"}
          {activeTab === "rejected" && "No rejected news"}
        </div>
      ) : (
        // Display news items
        displayData.map((news) => (
          <div key={news.id} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h3 className="text-xl font-semibold">{news.title}</h3>
            <p className="mb-2">{news.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              <p>Location: {news.location}</p>
              <p>Date: {news.date}</p>
              <p>Submitted: {news.createdAt}</p>
              <p>User ID: {news.userId}</p>
              
              {news.approvedAt && (
                <p className="text-green-500">Approved: {news.approvedAt}</p>
              )}
              
              {news.rejectedAt && (
                <p className="text-red-500">Rejected: {news.rejectedAt}</p>
              )}
            </div>
            {news.fileUrl && (
              <div className="mb-3">
                <img 
                  src={news.fileUrl} 
                  alt="Attachment" 
                  className="w-full max-w-md h-auto object-cover rounded" 
                />
              </div>
            )}
            <div className="flex space-x-2 mt-2">
              {activeTab === "pending" && (
                <>
                  <button
                    onClick={() => handleApprove(news.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(news.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Reject
                  </button>
                </>
              )}
              
              {(activeTab === "approved" || activeTab === "rejected") && (
                <button
                  onClick={() => handleRevert(news.id)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                >
                  Revert to Pending
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPanel;