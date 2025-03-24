import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Typography, 
  Container, 
  Grid, 
  TextField, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  Slider, 
  Select, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Tooltip, 
  Divider,
  IconButton,
  Chip
} from '@mui/material';
import NatureIcon from '@mui/icons-material/Nature';

import InfoIcon from '@mui/icons-material/Info';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FlightIcon from '@mui/icons-material/Flight';
import HomeIcon from '@mui/icons-material/Home';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import WaterIcon from '@mui/icons-material/Water';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import RecyclingIcon from '@mui/icons-material/Recycling';
import ElectricCarIcon from '@mui/icons-material/ElectricCar';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import WindPowerIcon from '@mui/icons-material/WindPower';
import Videos from "../Components/Videos";

const CarbonFootprintCalculator = () => {
  // Home
  const [electricity, setElectricity] = useState(0);
  const [renewablePercent, setRenewablePercent] = useState(0);
  const [gas, setGas] = useState(0);
  const [waterUsage, setWaterUsage] = useState(0);
  const [householdSize, setHouseholdSize] = useState(1);
  const [homeType, setHomeType] = useState('apartment');
  
  // Transportation
  const [carMileage, setCarMileage] = useState(0);
  const [carType, setCarType] = useState('gasoline');
  const [publicTransport, setPublicTransport] = useState(0);
  const [flights, setFlights] = useState(0);
  const [flightType, setFlightType] = useState('domestic');
  
  // Lifestyle
  const [dietType, setDietType] = useState('omnivore');
  const [foodWaste, setFoodWaste] = useState(0);
  const [shopping, setShopping] = useState(0);
  const [recyclingHabits, setRecyclingHabits] = useState(50);
  
  // Results
  const [result, setResult] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [breakdown, setBreakdown] = useState({});
  const [currentSection, setCurrentSection] = useState('home');
  const [showTips, setShowTips] = useState(false);
  const [comparisonData, setComparisonData] = useState(null);

  const sections = ['home', 'transport', 'lifestyle', 'results'];
  
  // Emissions factors
  const emissionFactors = {
    electricity: 0.85,
    renewableDiscount: 0.01,
    gas: 5.3,
    water: 0.17,
    
    car: {
      gasoline: 0.4,
      diesel: 0.45,
      hybrid: 0.2,
      electric: 0.1,
    },
    
    publicTransport: 0.15,
    
    flights: {
      domestic: 90,
      shortHaul: 150,
      longHaul: 290,
    },
    
    diet: {
      vegan: 0.5,
      vegetarian: 0.8,
      pescatarian: 1.2,
      omnivore: 1.5,
      highMeat: 2.0,
    },
    
    foodWaste: 0.5,
    shopping: 0.3,
    recyclingDiscount: 0.005,
  };

  // Calculate carbon footprint breakdown
  const calculateBreakdown = () => {
    // Home emissions
    const electricityEmissions = electricity * emissionFactors.electricity * (1 - (renewablePercent * emissionFactors.renewableDiscount));
    const gasEmissions = gas * emissionFactors.gas;
    const waterEmissions = waterUsage * emissionFactors.water;
    const homeEmissions = (electricityEmissions + gasEmissions + waterEmissions) / householdSize;
    
    // Transportation emissions
    const carEmissions = carMileage * emissionFactors.car[carType];
    const publicTransportEmissions = publicTransport * emissionFactors.publicTransport;
    const flightEmissions = flights * emissionFactors.flights[flightType];
    const transportEmissions = carEmissions + publicTransportEmissions + flightEmissions;
    
    // Lifestyle emissions
    const dietEmissions = 1000 * emissionFactors.diet[dietType]; // Base annual diet emissions
    const foodWasteEmissions = foodWaste * emissionFactors.foodWaste * 52; // Weekly waste to annual
    const shoppingEmissions = shopping * emissionFactors.shopping * 12; // Monthly to annual
    const recyclingReduction = recyclingHabits * emissionFactors.recyclingDiscount * 52; // Weekly to annual
    const lifestyleEmissions = dietEmissions + foodWasteEmissions + shoppingEmissions - recyclingReduction;
    
    // Total and breakdown
    const totalEmissions = homeEmissions + transportEmissions + lifestyleEmissions;
    
    return {
      home: homeEmissions,
      transport: transportEmissions,
      lifestyle: lifestyleEmissions,
      total: totalEmissions
    };
  };

  // Generate suggestions based on footprint
  const generateSuggestions = (breakdown) => {
    const suggestions = [];
    
    // Home suggestions
    if (renewablePercent < 50) {
      suggestions.push('Consider switching to a renewable energy provider or installing solar panels.');
    }
    if (electricity > 300) {
      suggestions.push('Reduce electricity usage by using energy-efficient appliances and LED lighting.');
    }
    if (gas > 30) {
      suggestions.push('Improve home insulation to reduce heating costs and carbon emissions.');
    }
    if (waterUsage > 3000) {
      suggestions.push('Install water-efficient fixtures to reduce water consumption.');
    }
    
    // Transport suggestions
    if (carType === 'gasoline' || carType === 'diesel') {
      suggestions.push('Consider switching to a hybrid or electric vehicle for your next car purchase.');
    }
    if (carMileage > 1000) {
      suggestions.push('Try carpooling, combining trips, or using public transportation to reduce driving.');
    }
    if (flights > 3) {
      suggestions.push('Consider alternatives to flying such as trains for shorter trips or virtual meetings.');
    }
    
    // Lifestyle suggestions
    if (dietType === 'highMeat' || dietType === 'omnivore') {
      suggestions.push('Reducing meat consumption, especially red meat, can significantly lower your carbon footprint.');
    }
    if (foodWaste > 2) {
      suggestions.push('Plan meals and store food properly to reduce food waste.');
    }
    if (shopping > 300) {
      suggestions.push('Consider buying second-hand items and choosing products with less packaging.');
    }
    if (recyclingHabits < 70) {
      suggestions.push('Increase recycling and composting to divert waste from landfills.');
    }
    
    return suggestions;
  };

  // Calculate comparison data for average person in different countries
  const calculateComparison = (footprint) => {
    return {
      world: 5000,
      usa: 16500,
      eu: 8000,
      china: 7500,
      india: 2000,
      sustainable: 2000,
      user: footprint
    };
  };

  // Main calculation function
  const calculateFootprint = () => {
    const calculatedBreakdown = calculateBreakdown();
    setBreakdown(calculatedBreakdown);
    setResult(calculatedBreakdown.total.toFixed(2));
    setSuggestions(generateSuggestions(calculatedBreakdown));
    setComparisonData(calculateComparison(calculatedBreakdown.total));
    setCurrentSection('results');
  };

  const resetCalculator = () => {
    // Reset home values
    setElectricity(0);
    setRenewablePercent(0);
    setGas(0);
    setWaterUsage(0);
    setHouseholdSize(1);
    setHomeType('apartment');
    
    // Reset transport values
    setCarMileage(0);
    setCarType('gasoline');
    setPublicTransport(0);
    setFlights(0);
    setFlightType('domestic');
    
    // Reset lifestyle values
    setDietType('omnivore');
    setFoodWaste(0);
    setShopping(0);
    setRecyclingHabits(50);
    
    // Reset results
    setResult(null);
    setSuggestions([]);
    setBreakdown({});
    setCurrentSection('home');
    setComparisonData(null);
  };

  // Component animations
  const sectionVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  };

  const renderPercentSlider = (value, setValue, label, tooltip) => (
    <Box mb={2}>
      <Box display="flex" alignItems="center" mb={1}>
        <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.9)', marginRight: '8px' }}>
          {label}
        </Typography>
        <Tooltip title={tooltip}>
          <InfoIcon fontSize="small" style={{ color: 'rgba(255,255,255,0.7)' }} />
        </Tooltip>
      </Box>
      <Box display="flex" alignItems="center">
        <Slider
          value={value}
          onChange={(e, newValue) => setValue(newValue)}
          step={1}
          min={0}
          max={100}
          valueLabelDisplay="auto"
          style={{ color: '#22c55e' }}
        />
        <Typography variant="body2" style={{ minWidth: '40px', textAlign: 'right', color: 'white' }}>
          {value}%
        </Typography>
      </Box>
    </Box>
  );

  const renderHomeSection = () => (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Box mb={3}>
        <Typography variant="h5" style={{ color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
          <HomeIcon style={{ marginRight: '10px' }} /> Home Energy Usage
        </Typography>
        <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
          Enter information about your household energy consumption
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Monthly Electricity Usage (kWh)"
            type="number"
            value={electricity}
            onChange={(e) => setElectricity(parseFloat(e.target.value) || 0)}
            variant="outlined"
            style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.8)' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Monthly Gas Usage (therms)"
            type="number"
            value={gas}
            onChange={(e) => setGas(parseFloat(e.target.value) || 0)}
            variant="outlined"
            style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.8)' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Monthly Water Usage (gallons)"
            type="number"
            value={waterUsage}
            onChange={(e) => setWaterUsage(parseFloat(e.target.value) || 0)}
            variant="outlined"
            style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.8)' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Household Size (people)"
            type="number"
            value={householdSize}
            onChange={(e) => setHouseholdSize(Math.max(1, parseInt(e.target.value) || 1))}
            variant="outlined"
            style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.8)' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}>
            <InputLabel style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Home Type</InputLabel>
            <Select
              value={homeType}
              onChange={(e) => setHomeType(e.target.value)}
              style={{ color: 'white' }}
            >
              <MenuItem value="apartment">Apartment</MenuItem>
              <MenuItem value="house">House</MenuItem>
              <MenuItem value="townhouse">Townhouse</MenuItem>
              <MenuItem value="condo">Condominium</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          {renderPercentSlider(
            renewablePercent, 
            setRenewablePercent, 
            "Percentage of Renewable Energy", 
            "The percentage of your electricity that comes from renewable sources"
          )}
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          variant="text"
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '600',
          }}
          disabled
        >
          Previous
        </Button>
        <Button
          variant="contained"
          onClick={() => setCurrentSection('transport')}
          style={{
            background: '#22c55e',
            color: '#ffffff',
            fontWeight: '600',
            padding: '10px 20px',
            borderRadius: '10px',
          }}
        >
          Next: Transportation
        </Button>
      </Box>
    </motion.div>
  );

  const renderTransportSection = () => (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Box mb={3}>
        <Typography variant="h5" style={{ color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
          <DirectionsCarIcon style={{ marginRight: '10px' }} /> Transportation
        </Typography>
        <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
          Enter information about your transportation methods
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Monthly Car Mileage (miles)"
            type="number"
            value={carMileage}
            onChange={(e) => setCarMileage(parseFloat(e.target.value) || 0)}
            variant="outlined"
            style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.8)' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}>
            <InputLabel style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Car Type</InputLabel>
            <Select
              value={carType}
              onChange={(e) => setCarType(e.target.value)}
              style={{ color: 'white' }}
            >
              <MenuItem value="gasoline">Gasoline</MenuItem>
              <MenuItem value="diesel">Diesel</MenuItem>
              <MenuItem value="hybrid">Hybrid</MenuItem>
              <MenuItem value="electric">Electric</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Monthly Public Transport (miles)"
            type="number"
            value={publicTransport}
            onChange={(e) => setPublicTransport(parseFloat(e.target.value) || 0)}
            variant="outlined"
            style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.8)' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Number of Flights (per year)"
            type="number"
            value={flights}
            onChange={(e) => setFlights(parseFloat(e.target.value) || 0)}
            variant="outlined"
            style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.8)' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}>
            <InputLabel style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Flight Type</InputLabel>
            <Select
              value={flightType}
              onChange={(e) => setFlightType(e.target.value)}
              style={{ color: 'white' }}
            >
              <MenuItem value="domestic">Domestic ( &gt;3 hours)</MenuItem>
              <MenuItem value="shortHaul">Short-haul (3-6 hours)</MenuItem>
              <MenuItem value="longHaul">Long-haul ( &gt;6 hours)</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          variant="text"
          onClick={() => setCurrentSection('home')}
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '600',
          }}
        >
          Previous: Home
        </Button>
        <Button
          variant="contained"
          onClick={() => setCurrentSection('lifestyle')}
          style={{
            background: '#22c55e',
            color: '#ffffff',
            fontWeight: '600',
            padding: '10px 20px',
            borderRadius: '10px',
          }}
        >
          Next: Lifestyle
        </Button>
      </Box>
    </motion.div>
  );

  const renderLifestyleSection = () => (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Box mb={3}>
        <Typography variant="h5" style={{ color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
          <RestaurantIcon style={{ marginRight: '10px' }} /> Lifestyle
        </Typography>
        <Typography variant="body2" style={{ color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
          Enter information about your diet and consumption habits
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}>
            <InputLabel style={{ color: 'rgba(255, 255, 255, 0.8)' }}>Diet Type</InputLabel>
            <Select
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              style={{ color: 'white' }}
            >
              <MenuItem value="vegan">Vegan</MenuItem>
              <MenuItem value="vegetarian">Vegetarian</MenuItem>
              <MenuItem value="pescatarian">Pescatarian</MenuItem>
              <MenuItem value="omnivore">Omnivore (Average meat)</MenuItem>
              <MenuItem value="highMeat">High Meat Consumption</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Food Waste (pounds per week)"
            type="number"
            value={foodWaste}
            onChange={(e) => setFoodWaste(parseFloat(e.target.value) || 0)}
            variant="outlined"
            style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.8)' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Monthly Shopping Expenditure ($)"
            type="number"
            value={shopping}
            onChange={(e) => setShopping(parseFloat(e.target.value) || 0)}
            variant="outlined"
            style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '10px' }}
            InputProps={{ style: { color: 'white' } }}
            InputLabelProps={{ style: { color: 'rgba(255, 255, 255, 0.8)' } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          {renderPercentSlider(
            recyclingHabits, 
            setRecyclingHabits, 
            "Recycling Habits", 
            "Percentage of recyclable waste that you actually recycle"
          )}
        </Grid>
      </Grid>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button
          variant="text"
          onClick={() => setCurrentSection('transport')}
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '600',
          }}
        >
          Previous: Transportation
        </Button>
        <Button
          variant="contained"
          onClick={calculateFootprint}
          style={{
            background: '#22c55e',
            color: '#ffffff',
            fontWeight: '600',
            padding: '10px 20px',
            borderRadius: '10px',
          }}
        >
          Calculate Footprint
        </Button>
      </Box>
    </motion.div>
  );

  // Render bar chart component for footprint comparison
  const ComparisonChart = ({ data }) => {
    if (!data) return null;
    
    const maxValue = Math.max(...Object.values(data));
    
    return (
      <Box mt={3}>
        
        <Typography variant="h6" style={{ color: 'white', marginBottom: '10px' }}>
          <CompareArrowsIcon style={{ marginRight: '10px', verticalAlign: 'text-bottom' }} />
          Comparison with Global Averages
        </Typography>
        
        {Object.entries(data).map(([key, value]) => (
          <Box key={key} mb={1.5}>
            <Box display="flex" alignItems="center" mb={0.5}>
              <Typography 
                variant="body2" 
                style={{ 
                  color: 'white', 
                  width: '120px',
                  fontWeight: key === 'user' ? '700' : '400'
                }}
              >
                {key === 'user' ? 'Your Footprint' : 
                  key === 'usa' ? 'USA Average' : 
                  key === 'eu' ? 'EU Average' : 
                  key === 'china' ? 'China Average' :
                  key === 'india' ? 'India Average' :
                  key === 'sustainable' ? 'Sustainable Target' :
                  'World Average'}
              </Typography>
              <Box 
                display="flex" 
                alignItems="center"
                style={{ 
                  flex: 1,
                  height: key === 'user' ? '26px' : '20px'
                }}
              >
                <Box 
                  style={{ 
                    width: `${(value / maxValue) * 100}%`, 
                    maxWidth: '100%',
                    height: '100%',
                    backgroundColor: key === 'user' ? '#22c55e' : 
                                    key === 'sustainable' ? '#3d9970' : 
                                    '#64748b',
                    borderRadius: '4px',
                    position: 'relative',
                    transition: 'width 1s ease-out'
                  }}
                >
                  <Typography 
                    variant="caption" 
                    style={{ 
                      position: 'absolute', 
                      right: '8px', 
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'white',
                      fontWeight: key === 'user' ? '700' : '400'
                    }}
                  >
                    {value.toFixed(0)} kg
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  const renderResultsSection = () => (
    <motion.div
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Box mb={3}>
        <Typography variant="h5" style={{ color: 'white', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
          <NatureIcon style={{ marginRight: '10px' }} /> Your Carbon Footprint Results
        </Typography>
      </Box>

      <Card style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '15px', marginBottom: '20px' }}>
        <CardContent>
          <Box textAlign="center" py={2}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography variant="h4" style={{ color: 'white', fontWeight: '700' }}>
                {result} kg CO₂e/year
              </Typography>
              <Typography variant="body1" style={{ color: 'rgba(255, 255, 255, 0.8)', marginTop: '8px' }}>
                {result < 5000 ? 
                  'Your carbon footprint is lower than average. Great job!' : 
                  result < 10000 ? 
                  'Your carbon footprint is around average. There\'s room for improvement.' :
                  'Your carbon footprint is higher than average. Consider making changes.'}
              </Typography>
            </motion.div>
          </Box>
          
          <Divider style={{ background: 'rgba(255, 255, 255, 0.2)', margin: '10px 0 20px' }} />
          
          <Box>
            <Typography variant="h6" style={{ color: 'white', marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
              <PieChartIcon /> Breakdown by Category
            </Typography>
            
            <Grid container spacing={2}>
              {breakdown.home && (
                <Grid item xs={12} sm={4}>
                  <Box 
                    p={2} 
                    textAlign="center"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.1)', 
                      borderRadius: '10px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <HomeIcon style={{ color: '#22c55e', fontSize: '2rem', marginBottom: '8px' }} />
                    <Typography variant="body1" style={{ color: 'white', fontWeight: '600' }}>
                      Home
                    </Typography>
                    <Typography variant="h6" style={{ color: 'white' }}>
                      {breakdown.home.toFixed(1)} kg
                    </Typography>
                    <Typography variant="body2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {((breakdown.home / breakdown.total) * 100).toFixed(1)}% of total
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {breakdown.transport && (
                <Grid item xs={12} sm={4}>
                  <Box 
                    p={2} 
                    textAlign="center"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.1)', 
                      borderRadius: '10px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <DirectionsCarIcon style={{ color: '#22c55e', fontSize: '2rem', marginBottom: '8px' }} />
                    <Typography variant="body1" style={{ color: 'white', fontWeight: '600' }}>
                      Transport
                    </Typography>
                    <Typography variant="h6" style={{ color: 'white' }}>
                      {breakdown.transport.toFixed(1)} kg
                    </Typography>
                    <Typography variant="body2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {((breakdown.transport / breakdown.total) * 100).toFixed(1)}% of total
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {breakdown.lifestyle && (
                <Grid item xs={12} sm={4}>
                  <Box 
                    p={2} 
                    textAlign="center"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.1)', 
                      borderRadius: '10px',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}
                  >
                    <RestaurantIcon style={{ color: '#22c55e', fontSize: '2rem', marginBottom: '8px' }} />
                    <Typography variant="body1" style={{ color: 'white', fontWeight: '600' }}>
                      Lifestyle
                    </Typography>
                    <Typography variant="h6" style={{ color: 'white' }}>
                      {breakdown.lifestyle.toFixed(1)} kg
                    </Typography>
                    <Typography variant="body2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      {((breakdown.lifestyle / breakdown.total) * 100).toFixed(1)}% of total
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
            
            <ComparisonChart data={comparisonData} />
          </Box>
        </CardContent>
      </Card>
      
      <Card style={{ background: 'rgba(255, 255, 255, 0.15)', borderRadius: '15px', marginBottom: '20px' }}>
        <CardContent>
          <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" style={{ color: 'white', display: 'flex', alignItems: 'center' }}>
              <WindPowerIcon style={{ marginRight: '10px' }} />
              Recommendations to Reduce Your Footprint
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setShowTips(!showTips)}
              style={{ 
                borderColor: 'rgba(255, 255, 255, 0.5)', 
                color: 'white',
                textTransform: 'none'
              }}
            >
              {showTips ? "Show Less" : "Show All"}
            </Button>
          </Box>
          
          <AnimatePresence>
            {suggestions.slice(0, showTips ? suggestions.length : 3).map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Box 
                  display="flex" 
                  alignItems="flex-start" 
                  p={1.5} 
                  mb={1.5}
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.1)', 
                    borderRadius: '8px' 
                  }}
                >
                  <NatureIcon style={{ color: '#22c55e', marginRight: '10px', marginTop: '2px' }} />
                  <Typography variant="body2" style={{ color: 'white' }}>
                    {suggestion}
                  </Typography>
                </Box>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Box display="flex" justifyContent="space-between" mt={4}>
        <Button
          variant="text"
          onClick={() => setCurrentSection('lifestyle')}
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: '600',
          }}
        >
          Back to Lifestyle
        </Button>
        <Button
          variant="contained"
          onClick={resetCalculator}
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            fontWeight: '600',
            padding: '10px 20px',
            borderRadius: '10px',
          }}
        >
          Start Over
        </Button>
      </Box>
    </motion.div>
  );

  // Icons for the progress indicator
  const PieChartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px' }}>
      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4V12L16.24 16.24C14.96 18.54 12.64 20 12 20Z" fill="#22c55e"/>
    </svg>
  );

  // Navigation indicator component
  const NavigationIndicator = () => (
    <Box display="flex" justifyContent="center" mb={4}>
      {sections.map((section, index) => (
        <Box 
          key={section}
          display="flex" 
          alignItems="center"
          onClick={() => {
            if (section !== 'results' || result !== null) {
              setCurrentSection(section);
            }
          }}
          style={{ cursor: section === 'results' && result === null ? 'not-allowed' : 'pointer' }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: currentSection === section ? '#22c55e' : 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              transition: 'all 0.3s ease',
            }}
          >
            {section === 'home' && <HomeIcon />}
            {section === 'transport' && <DirectionsCarIcon />}
            {section === 'lifestyle' && <RestaurantIcon />}
            {section === 'results' && <NatureIcon />}
          </Box>
          
          {index < sections.length - 1 && (
            <Box 
              style={{ 
                height: '2px', 
                width: '40px', 
                background: currentSection === sections[index + 1] || 
                          sections.indexOf(currentSection) > index ? 
                          '#22c55e' : 
                          'rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
              }} 
            />
          )}
        </Box>
      ))}
    </Box>
  );
  //<div className="min-h-screen bg-gradient-to-b from-emerald-900 via-blue-900 to-emerald-900 py-20 px-4 sm:px-6 lg:px-8">


  return (
    <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8 }}
  style={{
    background: `linear-gradient(to bottom, #064e3b, #1e40af, #064e3b)`, // Matches 'from-emerald-900 via-blue-900 to-emerald-900'
    color: '#ffffff',
    padding: '5rem 1rem', // Adjusted padding to match 'py-20 px-4'
    minHeight: '100vh',
    fontFamily: `'Poppins', sans-serif`,
    position: 'relative',
    overflow: 'hidden',
  }}
>

      <br></br>
      {/* Decorative elements */}
      <Box
        style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0) 70%)',
          zIndex: 0,
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0) 70%)',
          zIndex: 0,
        }}
      />
      
      
      <Container maxWidth="md" style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h3" 
            gutterBottom 
            align="center" 
            style={{ 
              fontWeight: '700', 
              fontFamily: `'Merriweather', serif`, 
              color: 'white',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
          >
            Carbon Footprint Calculator
          </Typography>
          <Typography 
            variant="body1" 
            align="center" 
            style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: '2rem',
              maxWidth: '700px',
              margin: '0 auto 2rem auto',
            }}
          >
            Calculate your carbon footprint and discover personalized suggestions to reduce your environmental impact and live more sustainably.
          </Typography>
        </motion.div>

        <NavigationIndicator />

        <Card style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '20px', 
          padding: '2rem',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        }}>
          <CardContent>
            <AnimatePresence mode="wait">
              {currentSection === 'home' && renderHomeSection()}
              {currentSection === 'transport' && renderTransportSection()}
              {currentSection === 'lifestyle' && renderLifestyleSection()}
              {currentSection === 'results' && renderResultsSection()}
            </AnimatePresence>
          </CardContent>
        </Card>
        
        <Box mt={4} textAlign="center">
          <Typography variant="body2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            This calculator provides estimates based on average emission factors. For more precise calculations, consult with an environmental specialist.
          </Typography>
        </Box>
      </Container>

      {/* Add the Videos component below the calculator */}
      <Videos />
    </motion.div>
  );
};

export default CarbonFootprintCalculator;