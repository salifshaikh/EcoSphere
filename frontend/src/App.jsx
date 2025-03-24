import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import ColorModeProvider from "./utils/ColorModeProvider";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Home from "./Pages/Home";
import Blog from "./Pages/Blog";
import WasteClassificationPage from "./Pages/WasteClassificationPage";
import CarbonFootprintCalculator from "./Pages/CarbonFootprintCalculator";
import NewsPage from "./Pages/NewsPage";
import AdminPage from "./Pages/AdminPage";

console.log('App component rendering');

const App = () => {
  return (
    <ColorModeProvider>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
          color: "text.primary",
          transition: "background-color 0.3s, color 0.3s",
        }}
      >
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/news" element={<NewsPage />} />

            <Route path="/admin" element={<AdminPage />} />

            <Route path="/blog" element={<Blog />} />
            
            <Route path="/carbon-calculate" element={<CarbonFootprintCalculator />} />
            <Route path="/waste-classification" element={<WasteClassificationPage />} />
            
            
          </Routes>
          <Footer />
        </BrowserRouter>
      </Box>
    </ColorModeProvider>
  );
};

export default App;