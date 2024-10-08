import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal components
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
  timestamp: number;
}

interface Estimation {
  company: string;
  price: number;
  description: string;
  timestamp: number;
}

interface AiEstimation {
  ai_name: string;
  input: string;
  result: string;
  timestamp: number;
}

interface CompanyOffer {
  name: string;
  status: string;
  price: number;
  timestamp: number;
}

interface Review {
  description: string;
  rating: number;
  timestamp: number;
}

export const Company: React.FC<CompanyProps> = ({provider, moduleAddress, moduleName }) => {
  const { account } = useWallet();
  const [company, setCompany] = useState<Company | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [description, setDescription] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
      await fetchAllListings(ownersList);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchAllListings = async (ownersList: string[]) => {
    const allListings: Listing[] = [];

    try {
      for (const ownerAddress of ownersList) {
        const userListings = await provider.view({
          function: `${moduleAddress}::${moduleName}::get_user_listings`,
          type_arguments: [],
          arguments: [ownerAddress],
        });
        const listingsWithOwner = userListings[0].map((listing: Listing, index: number) => ({
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

  const fetchCompany = async () => {
    if (!account) return;

    try {
      const result = await provider.view({
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
      await provider.waitForTransaction(transaction.hash);
      setDescription('');
      alert('Company created successfully!');
    } catch (err) {
      alert('Company created successfully!');
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
            <ListingList listings={listings} provider={provider} moduleAddress={moduleAddress} moduleName={moduleName} seller={false} />
            <div className="h-[20%] w-[40%]">
              <div className="listing-list pl-[40%] mt-[5%] mr-[5%]">
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
