// src/Components/EmergencyButton.jsx
import { useNavigate } from "react-router-dom";

const EmergencyButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/waste-classification")}
      className="bg-gradient-to-r from-green-500 to-green-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg hover:scale-105 transition duration-300"
    >
      <span className="mr-2"></span> Waste Classify
    </button>
  );
};

export default EmergencyButton;