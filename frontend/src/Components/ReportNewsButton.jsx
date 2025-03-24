import { useState } from "react";
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, storage } from "../firebase/config";

const ReportNewsButton = ({ userId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [file, setFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // First create a reference for the news document
      const newsRef = doc(collection(firestore, "reportedNews"));
      
      // Handle file upload if there is a file
      let fileUrl = null;
      if (file) {
        const storageRef = ref(storage, `news-images/${newsRef.id}_${file.name}`);
        const uploadResult = await uploadBytes(storageRef, file);
        fileUrl = await getDownloadURL(uploadResult.ref);
      }
      
      // Create the news document with all the data
      await setDoc(newsRef, {
        title,
        description,
        location,
        date,
        fileUrl, // Now this will be a proper Firebase Storage URL
        userId,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setLocation("");
      setDate("");
      setFile(null);
      
      // Show success message
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsModalOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting news:", error);
      alert("Failed to submit news. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors"
      >
        Report News
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Report News</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                rows="4"
              />
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium">
                  Upload Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
              {submitted && (
                <p className="text-green-500 text-center">News submitted for review!</p>
              )}
            </form>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 text-gray-500 hover:text-gray-700 w-full py-2 text-center"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportNewsButton;