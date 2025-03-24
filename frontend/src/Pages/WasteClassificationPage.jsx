// src/Pages/WasteClassificationPage.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Client } from "@gradio/client";

const WasteClassificationPage = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [animateResult, setAnimateResult] = useState(false);
  const navigate = useNavigate();

  // Reset animation state when result changes
  useEffect(() => {
    if (result) {
      setAnimateResult(true);
    }
  }, [result]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setResult(null); // Reset result when a new image is uploaded
      setError(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setImage(URL.createObjectURL(file));
        setResult(null);
        setError(null);
      } else {
        setError("Please upload an image file.");
      }
    }
  };

  // The fix should be applied to the classifyImage function in your WasteClassificationPage.jsx

  const classifyImage = async () => {
    if (!image) {
      setError("Please upload an image first.");
      return;
    }
  
    setLoading(true);
    setError(null);
  
    try {
      // Convert the image URL to a Blob
      const response = await fetch(image);
      const blob = await response.blob();
  
      // Call the Hugging Face API
      const client = await Client.connect("baota369/exe_garbage_classify_space");
      const result = await client.predict("/predict", { 
        image: blob 
      });
  
      console.log("Raw API response:", result);
  
      // Extract the classification result
      if (result && result.data && Array.isArray(result.data) && result.data.length > 0) {
        const classificationData = result.data[0];
        
        // Extract the main label and confidence scores
        if (classificationData.label && classificationData.confidences) {
          const mainLabel = classificationData.label;
          const confidences = classificationData.confidences;
          
          // Find the confidence score for the main label
          const mainConfidence = confidences.find(item => item.label === mainLabel)?.confidence || 0;
          
          // Format the result for display - convert confidence to percentage
          const percentage = Math.round(mainConfidence * 100);
          const formattedResult = `${mainLabel} (${percentage}%)`;
          setResult(formattedResult);
        } else {
          setError("Unexpected response format.");
        }
      } else {
        setError("Invalid API response format.");
      }
    } catch (err) {
      console.error("Error classifying image:", err);
      setError("Failed to classify the image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getResultColor = () => {
    if (!result) return "";
  
    // Extract the label from the formatted result
    const label = result.split(" ")[0].toLowerCase();
  
    // Customize colors based on waste classification results
    if (label.includes("recyclable") || label.includes("recycle")) {
      return "from-blue-500 to-green-500";
    } else if (label.includes("organic")) {
      return "from-green-600 to-green-400";
    } else if (label.includes("hazardous")) {
      return "from-red-600 to-orange-500";
    } else {
      return "from-gray-600 to-gray-400";
    }
  };
  
  const getWasteIcon = () => {
    if (!result) return null;
  
    // Extract the label from the formatted result
    const label = result.split(" ")[0].toLowerCase();
  
    if (label.includes("recyclable") || label.includes("recycle")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    } else if (label.includes("organic")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    } else if (label.includes("hazardous")) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    } else {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      );
    }
  };
  
  const getTips = () => {
    if (!result) return null;
  
    // Extract the label from the formatted result
    const label = result.split(" ")[0].toLowerCase();
  
    if (label.includes("recyclable") || label.includes("recycle")) {
      return "Make sure to clean it before recycling. Remove any non-recyclable parts.";
    } else if (label.includes("organic")) {
      return "Consider composting this waste to create nutrient-rich soil.";
    } else if (label.includes("hazardous")) {
      return "This requires special disposal. Contact your local waste management facility.";
    } else {
      return "Follow your local waste management guidelines for proper disposal.";
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0a0b1d] via-[#101236] to-[#131438] text-white p-6">
      {/* Animated background elements */}
      <br></br>            <br></br>

      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-2/3 left-1/2 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-[#1a1b3a]/80 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-lg text-center border border-[#2a2b5a]"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >

          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">Waste Classification</h1>
          <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-green-500 mx-auto mb-4"></div>
          <p className="text-gray-300 mb-8">
            Upload an image of waste to identify whether it's recyclable, organic, or other type of waste.
          </p>
        </motion.div>

        <div 
          className={`mb-8 border-2 border-dashed rounded-xl p-8 transition-all ${dragActive ? 'border-green-400 bg-green-400/10' : 'border-gray-600 hover:border-blue-400'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          
          {!image ? (
            <div className="flex flex-col items-center justify-center text-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </motion.div>
              <label
                htmlFor="image-upload"
                className="cursor-pointer bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all mb-4"
              >
                Choose an Image
              </label>
              <p className="text-gray-400 text-sm">or drag and drop an image here</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <img
                src={image}
                alt="Uploaded Waste"
                className="w-full h-64 object-contain rounded-lg"
              />
              <div className="absolute top-2 right-2 flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setImage(null)}
                  className="bg-red-500/80 hover:bg-red-500 p-2 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer bg-blue-500/80 hover:bg-blue-500 p-2 rounded-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </label>
              </div>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-red-500/20 p-4 rounded-lg mb-6 border border-red-500/30"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-300">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && animateResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, type: "spring" }}
              className={`bg-gradient-to-r ${getResultColor()} p-6 rounded-lg mb-6 shadow-lg`}
            >
              <div className="flex items-center justify-center mb-2">
                {getWasteIcon()}
                <h3 className="text-xl font-bold ml-2">Classification Result</h3>
              </div>
              <p className="text-white text-2xl font-semibold mb-2">{result}</p>
              <p className="text-white/80 text-sm">{getTips()}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={classifyImage}
          disabled={!image || loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`relative overflow-hidden bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-4 rounded-lg font-medium shadow-lg transition-all w-full ${!image && 'opacity-70 cursor-not-allowed'}`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Waste...
            </div>
          ) : (
            <>
              <span>Classify Waste</span>
              <span className="absolute right-6 top-1/2 transform -translate-y-1/2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </>
          )}
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8 text-center relative z-10"
      >
        <p className="text-gray-400 mb-4">Learn how proper waste separation helps the environment</p>
        <div className="flex flex-wrap justify-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#1a1b3a]/60 p-3 rounded-lg flex items-center"
          >
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-sm">Waste Guide</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#1a1b3a]/60 p-3 rounded-lg flex items-center"
          >
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="text-sm">Learn More</span>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-[#1a1b3a]/60 p-3 rounded-lg flex items-center"
          >
            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <span className="text-sm">Statistics</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.button
        onClick={() => navigate("/")}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 bg-[#2a2b4a]/80 hover:bg-[#2a2b5a] text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center relative z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </motion.button>
    </div>
  );
};

export default WasteClassificationPage;