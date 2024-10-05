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
import { PinataSDK } from "pinata-web3";

interface ListingListProps {
  listings: {
    id: number;
    price: number;
    description: string;
    status: string;
    photos: string[];
    offers: Offer[];
    estimates: Estimation[];
    ai_estimates: AiEstimation[];
    legal_offers: CompanyOffer[];
    legal_operator: string;
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
  const [images, setImages] = useState<[]>([]);

  const [docDescription, setDocDescription] = useState<string>('');
  const [docLink, setDocLink] = useState<string>('');

  const { account, signAndSubmitTransaction } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [createListing, setCreateListing] = useState<boolean>(false);

  const projectId = import.meta.env.REACT_APP_PROJECT_ID;
  const projectSecret = import.meta.env.REACT_APP_PROJECT_SECRET;

  const pinata = new PinataSDK({
    pinataJwt: import.meta.env.REACT_APP_PINATA_JWT,
    pinataGateway: import.meta.env.REACT_APP_PINATA_GATEWAY,
  });

  const getCurrentTimestamp = (): number => {
    const currentDate = new Date();
    return Math.floor(currentDate.getTime() / 1000);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    setLoading(true);
    setError(null);
    console.log(description)
    console.log(price)
    console.log(images)
    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::create_listing`,
         type_arguments: [],
         functionArguments: [price, description, images, getCurrentTimestamp()],
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

  const handleUploadImage = async (event) => {
    event.preventDefault()
    //setImages((prevImages) => [...prevImages, "public/watch.jpeg"]);

    console.log(images);
    const file = event.target.files[0]
      if (typeof file !== 'undefined') {
      try {
        const uploading_file = new File([file], "test.png", { type: "image/png" });
        const upload = await pinata.upload.file(uploading_file);
        console.log(upload)
        setImages((prevImages) => [...prevImages, upload.IpfsHash]);
      } catch (error){
        console.log("ipfs image upload error: ", error)
      }
    }
  }

  const toggleListing = async (event) => {
    setCreateListing(!createListing)
    console.log(listings[0])
  }

  return (
    <div className="h-[20%] w-[60%]">
      <div className="listing-list pl-[50%] mb-[5%] mt-[5%]">
        {listings.map((listing, index) => (
          <ListingCard
            key={index}
            address={listing.ownerAddress}
            index={listing.index}
            price={listing.price}
            description={listing.description}
            photo={listing.photos[0]}
            //seller={seller}
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
            <div className="mb-3">
              <label>Upload Image:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => handleUploadImage(event)}
                className="form-control"
              />
            </div>
            {images.length > 0 ? (
              <div className="form-group">
                <p>Attached images ids:</p>
                <ul>
                  {images.map((image, index) => (
                    <li key={index}>
                      <p>{image.slice(0,25)}</p>
                    </li>
                  ))}
                </ul>
              </div>) : (<></>)
            }
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Creating...' : 'Create Listing'}
            </button>
            <button onClick={toggleListing} className="cancel-button">
              Cancel Listing
            </button>
          </form>
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
