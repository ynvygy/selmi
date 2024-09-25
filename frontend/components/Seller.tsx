import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// Internal components
import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAccountAPTBalance } from "@/view-functions/getAccountBalance";
import { transferAPT } from "@/entry-functions/transferAPT";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { ListingList } from "@/components/ListingList";

interface SellerProps {
  provider: any;
  moduleAddress: string;
  moduleName: string;
}

interface Listing {
  price: number;
  description: string;
  status: string;
  documents: Document[];
  photos: string[];
  offers: Offer[];
  estimates: Estimation[];
  ai_estimates: AiEstimation[];
  legal_offers: CompanyOffer[];
  legal_operator: string;
}

interface Document {
  description: string;
  link: string;
}

interface Offer {
  description: string;
  status: string;
  price: number;
}

interface Estimation {
  company: string;
  price: number;
  description: string;
  attached_documents: Document[];
}

interface AiEstimation {
  ai_name: string;
  input: string;
  result: string;
}

interface CompanyOffer {
  name: string;
  status: string;
  price: number;
}

export const Seller: React.FC<SellerProps> = ({provider, moduleAddress, moduleName }) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const navigate = useNavigate();

  const [listings, setListings] = useState<Listing[]>([]);
  const [seller, setSeller] = useState(true);

  const fetchListings = async () => {
    if (!account) return;

    try {
      const result: Listing[] = await provider.view({
        function: `${moduleAddress}::${moduleName}::get_user_listings`,
        type_arguments: [],
        arguments: [account.address],
      });

      console.log(result);
      setListings(result[0]);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [account]);

  return (
    <div className="flex h-screen">
      {/* Main content (80% width) */}
      <ListingList listings={listings} provider={provider} moduleAddress={moduleAddress} moduleName={moduleName} seller={seller} />
    </div>
  );
}
