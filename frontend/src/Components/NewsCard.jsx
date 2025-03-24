import React from "react";
import { formatDistance } from "date-fns";

const NewsCard = ({ article, isUserSubmitted = false }) => {
  // Handle date formatting
  const getFormattedDate = (dateValue) => {
    if (!dateValue) return "Unknown date";
    
    // Handle user-submitted date string
    if (typeof dateValue === 'string') {
      return new Date(dateValue).toLocaleDateString();
    }
    
    // Handle Firestore timestamp
    if (dateValue.toDate) {
      return formatDistance(dateValue.toDate(), new Date(), { addSuffix: true });
    }
    
    // Handle regular Date object
    if (dateValue instanceof Date) {
      return formatDistance(dateValue, new Date(), { addSuffix: true });
    }
    
    return "Unknown date";
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-102 hover:shadow-lg">
      {/* Image */}
      {(article.urlToImage || article.fileUrl) ? (
        <img
          src={article.urlToImage || article.fileUrl || "https://via.placeholder.com/300"}
          alt={article.title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300?text=No+Image";
          }}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <span className="text-gray-500 dark:text-gray-400">No image available</span>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-3">{article.description}</p>

        {/* Source (for API news) */}
        {article.source && article.source.name && (
          <p className="text-sm text-gray-500 mt-2">
            Source: {article.source.name}
          </p>
        )}

        {/* Location (for user-submitted news) */}
        {article.location && (
          <p className="text-sm text-gray-500 mt-2">
            Location: {article.location}
          </p>
        )}

        {/* Date */}
        {(article.date || article.publishedAt || article.createdAt) && (
          <p className="text-sm text-gray-500 mt-1">
            {isUserSubmitted ? "Reported" : "Published"}: {
              getFormattedDate(article.date || article.publishedAt || article.createdAt)
            }
          </p>
        )}

        {/* Read More Link (for API news) */}
        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline mt-4 inline-block"
          >
            Read more
          </a>
        )}
      </div>
    </div>
  );
};

export default NewsCard;