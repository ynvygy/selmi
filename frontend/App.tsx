import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState, useEffect } from "react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { Provider, Network } from "aptos";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/Header";
import { WalletDetails } from "@/components/WalletDetails";
import { NetworkInfo } from "@/components/NetworkInfo";
import { AccountInfo } from "@/components/AccountInfo";
import { TransferAPT } from "@/components/TransferAPT";
import { MessageBoard } from "@/components/MessageBoard";
import { Seller } from "@/components/Seller";
import { Buyer } from "@/components/Buyer";
import { Company } from "@/components/Company";
import { Listing } from "@/components/Listing";

const MODULE_ADDRESS = import.meta.env.REACT_APP_MODULE_ADDRESS;
const MODULE_NAME = import.meta.env.REACT_APP_MODULE_NAME;

const provider = new Provider(Network.DEVNET);

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen background">
      <div
        className="h-[20%] w-full bg-blue-500 flex items-center justify-center cursor-pointer bg-opacity-50 company"
        onClick={() => navigate('/company')}
      >
        <h1 className="text-white text-xl font-bold">Companies</h1>
      </div>

      <div
        className="h-[20%] w-full bg-red-500 flex items-center justify-center cursor-pointer bg-opacity-40 seller"
        onClick={() => navigate('/seller')}
      >
        <h1 className="text-white text-xl font-bold">Sellers</h1>
      </div>

      <div
        className="h-[20%] w-full bg-green-500 flex items-center justify-center cursor-pointer bg-opacity-50 buyer"
        onClick={() => navigate('/buyer')}
      >
        <h1 className="text-white text-xl font-bold">Buyers</h1>
      </div>

    </div>
  );
};

function App() {
  const { account, signAndSubmitTransaction } = useWallet();

  interface MyCompany {
    description: string;
    reviews: Review[];
  }

  const { connected } = useWallet();

  return (
    <>
      <Header />
      <Router>
        <Routes>
          {/* Route for the main landing page */}
          <Route path="/" element={<HomePage />} />

          {/* Routes for each individual component */}
          <Route path="/seller" element={<Seller provider={provider} moduleAddress={MODULE_ADDRESS} moduleName={MODULE_NAME}/>} />
          <Route path="/buyer" element={<Buyer provider={provider} moduleAddress={MODULE_ADDRESS} moduleName={MODULE_NAME}/>} />
          <Route path="/company" element={<Company provider={provider} moduleAddress={MODULE_ADDRESS} moduleName={MODULE_NAME}/>} />
          <Route path="/listings/:address/:index" element={<Listing />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
