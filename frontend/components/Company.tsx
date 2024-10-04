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
import { CompanyCard } from '@/components/CompanyCard';
import { ListingList } from '@/components/ListingList';

interface Company {
  name: string;
  description: string;
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
  photos: string[];
  offers: Offer[];
  estimates: Estimation[];
  ai_estimates: AiEstimation[];
  legal_offers: CompanyOffer[];
  legal_operator: string;
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
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [seller, setSeller] = useState(false);

  const getCurrentTimestamp = (): number => {
    const currentDate = new Date();
    return Math.floor(currentDate.getTime() / 1000);
  };

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
        const listingsWithOwner = userListings[0].map((listing, index) => ({
          ...listing,
          ownerAddress,
          index,
        }));

        allListings.push(...listingsWithOwner);
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
      console.log(result)
      if (result.length > 0 && result[0].vec.length > 0) {
        const companyData = result[0].vec[0];
        setCompany(companyData);
      } else {
        setCompany(null);
      }
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
         functionArguments: [name, description, getCurrentTimestamp()],
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
    fetchAllOwners();
    fetchCompany();
  }, [account]);

  return (
    <>
      <div className="flex h-screen background-company">
        {company ? (
          <>
            <ListingList listings={listings} provider={provider} moduleAddress={moduleAddress} moduleName={moduleName} seller={seller} />
            <div className="h-[20%] w-[60%]">
              <div className="listing-list pl-[50%] mt-[5%] mr-[5%]">
                <div className="listing-card" style={{ cursor: 'pointer' }}>
                  <CompanyCard company={company} />
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
          <div className="flex flex-col items-center mt-10 ml-[37%]">
            <h2 className="text-3xl font-bold mb-4">Make Your Company</h2>
            <div className="w-full max-w-md">
              <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                  <label htmlFor="name" className="block text-lg font-medium mb-2">
                    Name:
                  </label>
                  <input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="description" className="block text-lg font-medium mb-2">
                    Description:
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loading ? 'Creating...' : 'Create Company'}
                </button>
              </form>
            </div>
          </div>
          </>
        )}
      </div>
    </>
  )
}
