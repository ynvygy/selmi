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

interface Company {
  description: string;
  documents: Document[];
  reviews: Review[];
}

interface CompanyProps {
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

interface OwnerList {
  address: string;
}

export const Company: React.FC<CompanyProps> = ({provider, moduleAddress, moduleName }) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [owners, setOwners] = useState<string[]>([]);
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [seller, setSeller] = useState(false);

  const fetchAllOwners = async () => {
    if (!account) return;

    try {
      const result: string[] = await provider.view({
        function: `${moduleAddress}::${moduleName}::get_owners_list`,
        type_arguments: [],
        arguments: [],
      });

      const ownersList = result.map((element) => element[0]);

      setOwners(ownersList);
      await fetchAllListings(ownersList);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchAllListings = async (ownersList: string[]) => {
    const allListings: Listing[] = [];

    try {
      for (const ownerAddress of ownersList) {
        const userListings: Listing[] = await provider.view({
          function: `${moduleAddress}::${moduleName}::get_user_listings`,
          type_arguments: [],
          arguments: [ownerAddress],
        });
        allListings.push(...userListings[0]);
      }

      setListings(allListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const createCompany = async() => {
    if (!account) return;
  }

  const fetchCompany = async () => {
    if (!account) return;

    try {
      const result: Company = await provider.view({
        function: `${moduleAddress}::${moduleName}::get_company`,
        type_arguments: [],
        arguments: [account.address],
      });

      setCompany(result[0]);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    setLoading(true);
    setError(null);
    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::create_company`,
         type_arguments: [],
         functionArguments: [description],
       }
     }

    try {
      const response = await signAndSubmitTransaction(transaction);

      await provider.waitForTransaction(transaction.hash);
      setDescription('');
      alert('Company created successfully!');
    } catch (err) {
      console.error('Error creating company:', err);
      setError('Failed to create company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    //fetchAllOwners();
    fetchCompany();
  }, [account]);

  return (
    <>
      <div className="flex h-screen">
        {company ? ( // Check if company is not null
          <div>{company.description}</div>
        ) : (
          <>
            <div>Make your company</div>
            <div className="form-container flex items-center justify-center ">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" disabled={loading} className="submit-button">
                  {loading ? 'Creating...' : 'Create Listing'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  )
}
