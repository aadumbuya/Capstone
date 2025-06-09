import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/slices/auth-slice';
import NotFound from './Components/common/NotFound';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/SIgnup';
import ForgotPassword from './Components/Auth/ForgotPassword';
import Role from "./Components/common/Role";    
import Dashboard from "./Dashboard/Pages/Dashboard";
import Layout from "./Dashboard/Layout/Layout";
import ProtectedRoute from './Components/ProtectedRoute';
import ProducerProfile from './Dashboard/Pages/ProducerProfile';
import SeedCheckout from "./Dashboard/Pages/SeedCheckout";
import PendingSeeds from "./Dashboard/Pages/PendingSeeds";
import InspectorProfile from './Dashboard/Pages/InspectorProfile';
import CertifiedSeeds from './Dashboard/Pages/CertifiedSeeds';
import ImporterProfile from './Dashboard/Pages/ImporterProfile';
import DealerProfile from './Dashboard/Pages/DealerProfile';
import SeedSubmision from './Dashboard/Pages/SeedSubmission';
import ProducerSeeds from './Dashboard/Pages/ProducerSeeds';

function App() {
  const checkAuthOnStartup = useAuthStore(state => state.checkAuthOnStartup);
  useEffect(() => {
    checkAuthOnStartup();
  }, [checkAuthOnStartup]);
  
  return (
    <BrowserRouter>
     <Toaster position="top-right" toastOptions={{ style: {
      background: '#333',
      color: '#fff',
    },
    success: {
      style: {
        background: 'green',
      },
    },
    error: {
      style: {
        background: 'red',
      },
    },}} />
      <Routes>     
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="producer-profile" element={<ProducerProfile />} />
              <Route path="dealer-profile" element={<DealerProfile />} />
              <Route path='certified-seeds' element={<CertifiedSeeds />} />
              <Route path='seeds' element={<ProducerSeeds />} />
              <Route path="importer-profile" element={<ImporterProfile />} />
              <Route path="inspector-profile" element={<InspectorProfile />} />
              <Route path='pending' element={<PendingSeeds />} /> 
              <Route path="checkout" element={<SeedCheckout />} />
              <Route path="submit" element={<SeedSubmision />} />
          </Route>
            <Route path="/role" element={<Role />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;