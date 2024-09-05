import './App.css';
import Home from './pages/home';
import Market from './components/Market/Market';
import { Dashboard } from './components/Dashboard/Dashboard';
import Budget from './components/Budget/Budget';
import StockDetails from './components/StockDetails/StockDetails';
import RegisterForm from './components/RegisterForm/RegisterForm';
import PortfolioContainer from './components/Portfolio/PortfolioContainer/PortfolioContainer'
import PortfolioStock from './components/Portfolio/Portfolio-Stock/PortfolioStock'
import Transaction from "./components/Portfolio/Portfolio-Transactions/PortfolioTransactions"
import BlogContainer from "./components/ESGBlog/BlogContainer/BlogContainer"
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet} from 'react-router-dom';
import Login from './components/Login/Login';
import PrivateRoute from './PrivateRoute';
import ViewProfile from './components/Navigation/ViewProfile/ViewProfile';
import Navbar from './components/Navigation/Navbar';

function App() {
  return (
    <div className="app-container">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home/>
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="/market" element={<Market />} />
            <Route path="/market/stock/:id" element={<StockDetails />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/portfolio" element={<PortfolioContainer />}>
              <Route path="stock/:id" element={<PortfolioStock />} />
              <Route path="transaction/:stockId/:id" element={<Transaction/>}/>
            </Route>
            <Route path="/learn" element={<BlogContainer/>}/>
          </Route>

          <Route path="/login" element={<Login />}></Route>
          <Route path="/registration" element={<RegisterForm />}></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
