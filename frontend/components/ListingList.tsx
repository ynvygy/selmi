import { useEffect, useState } from "react";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
// Internal components
import { toast } from "@/components/ui/use-toast";
import { aptosClient } from "@/utils/aptosClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getAccountAPTBalance } from "@/view-functions/getAccountBalance";
import { transferAPT } from "@/entry-functions/transferAPT";
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { ListingCard } from "@/components/ListingCard"
import { Buffer } from 'buffer';
import { create } from 'ipfs-http-client'

interface ListingListProps {
  listings: {
    id: number;
    description: string
  }[];
  provider: any;
  moduleAddress: string;
  moduleName: string;
  seller: boolean
}

export const ListingList: React.FC<ListingListPropsProps> = ({ listings, provider, moduleAddress, moduleName, seller }) => {
  const navigate = useNavigate();

  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [documents, setDocuments] = useState<[]>([]);
  const [images, setImages] = useState<[]>([]);
  const { account, signAndSubmitTransaction } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [createListing, setCreateListing] = useState<boolean>(false);

  const projectId = import.meta.env.REACT_APP_PROJECT_ID;
  const projectSecret = import.meta.env.REACT_APP_PROJECT_SECRET;
  const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
  const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    apiPath: '/api/v0',
    headers: {
      authorization: auth,
    }
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    setLoading(true);
    setError(null);
    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::create_listing`,
         type_arguments: [],
         functionArguments: [price, description],
       }
     }

    try {
      const response = await signAndSubmitTransaction(transaction);

      await provider.waitForTransaction(transaction.hash);
      setPrice(0);
      setDescription('');
      alert('Listing created successfully!');
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDocument = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        console.log(result)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }

  const handleUploadImage = async (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file)
        console.log(result)
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }

  const toggleListing = async (event) => {
    setCreateListing(!createListing)
  }

  return (
    <div className="h-[20%] w-[60%]">
      <div className="listing-list pl-[50%] mt-[10%] mb-[10%]">
        {listings.map((listing, index) => (
          <ListingCard
            key={index}
            id={index}
            price={listing.price}
            description={listing.description}
            seller={seller}
          />
        ))}
      </div>

      {(seller && createListing) ?
        (<div className="ml-[65%]">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="price">Price:</label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>
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
            <button onClick={toggleListing} className="cancel-button">
              Cancel Listing
            </button>
          </form>
          <div className="mb-3">
            <label>Upload Document:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleUploadDocument(event)}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label>Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => handleUploadImage(event)}
              className="form-control"
            />
          </div>
        </div>) : (seller && !createListing) ? (
          <div className="w-[20%] ml-[65%]">
            <button onClick={toggleListing} className="submit-button">
              Add new listing
            </button>
          </div>) : (<></>)
      }
    </div>
  );
}
