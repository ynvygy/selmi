import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal components
import { ListingList } from "@/components/ListingList";

interface BuyerProps {
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
  ownerAddress: string;
  index: number;
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

export const Buyer: React.FC<BuyerProps> = ({provider, moduleAddress, moduleName }) => {
  const { account } = useWallet();

  const [listings, setListings] = useState<Listing[]>([]);

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

  useEffect(() => {
    fetchAllOwners();
  }, [account]);

  return (
    <div className="flex h-screen background-buyer">
      {/* Main content (80% width) */}
      <ListingList listings={listings} provider={provider} moduleAddress={moduleAddress} moduleName={moduleName} seller={false} />
    </div>
  );
}
