import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/config';
import ChatBot from "../Components/Chatbot";
import EmergencyButton from "../Components/EmergencyButton";
import Spline from "@splinetool/react-spline"

const Home = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [donationAmount, setDonationAmount] = useState('');

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const makePayment = async () => {
    const res = await initializeRazorpay();

    if (!res) {
      alert("Razorpay SDK Failed to load");
      return;
    }

    const amount = parseFloat(donationAmount);
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid donation amount");
      return;
    }

    const options = {
      key: "rzp_test_RtyUUL2QwvFazU",
      amount: amount * 100, // Razorpay amount in paise (100 = ₹1)
      currency: "INR",
      name: "EcoSphere",
      description: "Donation for a Sustainable Future",
      handler: function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Donor Name",
        email: "donor@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "EcoSphere Organization",
      },
      theme: {
        color: "#22c55e",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-green-900">
      {/* Hero Section */}
      <div className="relative flex flex-col items-center justify-center text-center min-h-screen overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          src="https://videos.pexels.com/video-files/855505/855505-hd_1920_1080_25fps.mp4"
        />
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 px-4 text-white"
        >
          <h1 className="text-5xl font-extrabold">
            Every Action Matters - <span className="text-green-400"> Build a Greener Future with Every Choice You Make.</span>
          </h1>
          <br></br>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-10 text-base sm:text-lg md:text-xl text-black dark:text-white drop-shadow-md"
          >
            Advancing clean energy solutions and waste reduction strategies to build a greener, more sustainable world for future generations.
          </motion.p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <EmergencyButton className="bg-gradient-to-r from-green-900 to-green-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition duration-300" />

            <button
              onClick={() => navigate('/generate-images')}
              className="bg-gradient-to-r from-green-900 to-green-700 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition duration-300"
            >
                Submit News
            </button>
            <button
              onClick={() => navigate('/ambulance-tracker')}
              className="bg-gradient-to-r from-green-700 to-green-400 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition duration-300"
            >
              Community
            </button>
          </div>
        </motion.div>
        <br></br>
        <br></br>
        <br></br>

        {/* Donation Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-10"
          style={{ position: "relative", zIndex: 10 }} // Ensure the donation section is above other elements
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <div className="relative w-full sm:w-2/3">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full rounded-lg border pl-8 pr-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <motion.button
              onClick={makePayment}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto rounded-lg bg-green-600 px-8 py-1 text-base font-semibold text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-green-700"
            >
              Donate ₹{donationAmount || '0'}
            </motion.button>
          </div>
          <p className="mt-3 text-sm italic text-white">
            "Your contribution fuels a cleaner tomorrow."
          </p>
        </motion.div>
      </div>
      {/* About Us Section */}
      <section className="py-16 md:py-20 lg:py-28">
      <div className="container">
        <div className="-mx-4 flex flex-wrap items-center">
          <div className="w-full px-4 lg:w-1/2">
            <div
              className="relative mx-auto mb-12 aspect-[25/24] max-w-[500px] text-center lg:m-0"
              data-wow-delay=".15s"
            >
              <Spline
        scene="https://prod.spline.design/c4yfsIk0FisT6oY1/scene.splinecode" 
      />
            </div>
          </div>
          <div className="w-full px-4 lg:w-1/2">
            <div className="max-w-[470px]">
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-green-300 sm:text-2xl lg:text-xl xl:text-2xl">
                A Community for a Greener Future
                </h3>
                <p className="text-base font-medium leading-relaxed text-white sm:text-lg sm:leading-relaxed">
                We are a collective of individuals, organizations, and innovators dedicated to making a positive environmental impact. Our platform fosters collaboration, awareness, and action toward a more sustainable world.                </p>
              </div>
              <div className="mb-9">
                <h3 className="mb-4 text-xl font-bold text-green-300 sm:text-2xl lg:text-xl xl:text-2xl">
                Empowering Change Through Innovation
                </h3>
                <p className="text-base font-medium leading-relaxed text-white sm:text-lg sm:leading-relaxed">
                From renewable energy solutions to eco-conscious lifestyle choices, we provide resources, tools, and opportunities for individuals and businesses to contribute to a cleaner planet.                </p>
              </div>
              <div className="mb-1">
                <h3 className="mb-4 text-xl font-bold text-green-300 sm:text-2xl lg:text-xl xl:text-2xl">
                Sustainability for Everyone                </h3>
                <p className="text-base font-medium leading-relaxed text-white sm:text-lg sm:leading-relaxed">
                Whether you’re an environmental enthusiast, a researcher, or an eco-conscious company, our platform is designed to support and amplify your efforts in building a greener, healthier future.                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
      {/* Razorpay script is loaded dynamically in the initializeRazorpay function */}

      {/* Features Section */}
      <section className="py-20 bg-green-900 text-white text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }}
          className="text-4xl font-extrabold"
        >
          Our Features
        </motion.h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {[
            {
              title: "📖 First Aid Guides",
              description: "Step-by-step medical emergency instructions to help you act quickly.",
              img: "/images/first-aid.png"
            },
            {
              title: "📅 Appointment Booking",
              description: "Instantly connect with nearby healthcare professionals and book appointments.",
              img: "/images/appointment.png"
            },
            {
              title: "👥 Community Support",
              description: "Join discussions, share experiences, and get medical advice from professionals.",
              img: "/images/community.png"
            },
            {
              title: "🛠 AI Symptom Checker",
              description: "Enter your symptoms and get AI-based preliminary diagnosis recommendations.",
              img: "/images/ai-symptom.png"
            },
            {
              title: "🚑 Emergency Call Assistance",
              description: "Connect instantly with local emergency responders in a crisis.",
              img: "/images/emergency-call.png"
            },
            {
              title: "📡 Live Health Monitoring",
              description: "Track your vitals and receive alerts for potential health risks.",
              img: "/images/live-health.png"
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-6 bg-green-950 rounded-lg shadow-lg text-center transition-all"
            >
              <img src={feature.img} alt={feature.title} className="w-full h-56 object-cover rounded-lg mb-4 transform transition duration-700 hover:scale-105" />
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="mt-2 text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
      
      <ChatBot />
    </div>
  );
};

export default Home;