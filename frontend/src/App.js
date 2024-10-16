import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import FooterSection from "./components/Footer";

import Home from "./pages/home";
import Recipes from "./pages/recipes";
import Settings from "./pages/settings";
import RecipeDetail from "./pages/RecipeDetail"; // Import the RecipeDetail component

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} /> {/* Updated route */}
        </Routes>
      </div>
      <FooterSection />
    </Router>
  );
}

export default App;
