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

const MODULE_ADDRESS = "0x3f8bac3240eeaa36474bc057392ead9b5ef97e095d562a526b75d87dfd102063";
const MODULE_NAME = "selmi";

const provider = new Provider(Network.DEVNET);

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen">
      {/* Top Div for Seller */}
      <div
        className="h-[20%] w-full bg-red-500 flex items-center justify-center cursor-pointer"
        onClick={() => navigate('/seller')}
      >
        <h1 className="text-white text-xl font-bold">Sellers</h1>
      </div>

      {/* Middle Div for Buyer */}
      <div
        className="h-[20%] w-full bg-green-500 flex items-center justify-center cursor-pointer"
        onClick={() => navigate('/buyer')}
      >
        <h1 className="text-white text-xl font-bold">Buyers</h1>
      </div>

      {/* Bottom Div for Company */}
      <div
        className="h-[20%] w-full bg-blue-500 flex items-center justify-center cursor-pointer"
        onClick={() => navigate('/company')}
      >
        <h1 className="text-white text-xl font-bold">Companies</h1>
      </div>
    </div>
  );
};

function App() {
  const { account, signAndSubmitTransaction } = useWallet();

  interface Company {
    address: string;
  }

  interface MyCompany {
    description: string;
    documents: Document[];
    reviews: Review[];
  }

  const { connected } = useWallet();
  const [companies, setCompanies] = useState<Company[]>([]);

  const fetchCompanies = async () => {
    if (!account) return;

    try {
      const result: string[] = await provider.view({
        function: `${MODULE_ADDRESS}::${MODULE_NAME}::get_companies_list`,
        type_arguments: [],
        arguments: [],
      });

      console.log(result);
      setCompanies(result);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  return (
    <>
      <Header />
      <Router>
        <Routes>
          {/* Route for the main landing page */}
          <Route path="/" element={<HomePage />} />

          {/* Routes for each individual component */}
          <Route path="/seller" element={<Seller />} />
          <Route path="/buyer" element={<Buyer />} />
          <Route path="/company" element={<Company provider={provider} moduleAddress={MODULE_ADDRESS} moduleName={MODULE_NAME}/>} />
        </Routes>
      </Router>
      <div className="flex items-center justify-center flex-col">
        {connected ? (
          <Card>
            <CardContent className="flex flex-col gap-10 pt-6">
              <WalletDetails />
              <NetworkInfo />
              <AccountInfo />
              <TransferAPT />
              <MessageBoard />
            </CardContent>

            <div className="flex justify-center mt-16">
              <button
                className="px-6 py-3 text-lg font-semibold rounded-lg"
                onClick={fetchCompanies}
                style={{
                  background: "none",
                  border: "2px solid transparent",
                  borderImage: "linear-gradient(to right, #3b82f6, #22c55e) 1",
                  boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                }}
              >
                Fetch Companies
              </button>
            </div>
          </Card>
        ) : (
          <CardHeader>
            <CardTitle>To get started Connect a wallet</CardTitle>
          </CardHeader>
        )}
      </div>
    </>
  );
}

export default App;
