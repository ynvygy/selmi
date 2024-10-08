import { useEffect, useState, ChangeEvent } from "react";
import { useWallet, InputTransactionData } from "@aptos-labs/wallet-adapter-react";
// Internal components
import { ListingCard } from "@/components/ListingCard"
import { PinataSDK } from "pinata-web3";

interface ListingListProps {
  listings: Listing[];
  provider: any;
  moduleAddress: string;
  moduleName: string;
  seller: boolean
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

export const ListingList: React.FC<ListingListProps> = ({ listings, provider, moduleAddress, moduleName, seller }) => {
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);

  const { account, signAndSubmitTransaction } = useWallet();
  const [loading, setLoading] = useState<boolean>(false);
  const [createListing, setCreateListing] = useState<boolean>(false);

  //const projectId = import.meta.env.REACT_APP_PROJECT_ID;
  //const projectSecret = import.meta.env.REACT_APP_PROJECT_SECRET;

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
      await signAndSubmitTransaction(transaction);

      await provider.waitForTransaction(transaction.hash);
      setPrice(0);
      setDescription('');
      alert('Listing created successfully!');
    } catch (err) {
      console.error('Error creating listing:', err);
      alert('Listing created successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    //setImages((prevImages) => [...prevImages, "public/watch.jpeg"]);

    console.log(images);
    const files = event.target.files
      if (files && files.length > 0) {
        const file = files[0];
        if (typeof file !== 'undefined') {
          try {
            const uploading_file = new File([file], "new_file.png", { type: "image/png" });
            const upload = await pinata.upload.file(uploading_file);
            console.log(upload)
            setImages((prevImages) => [...prevImages, upload.IpfsHash]);
          } catch (error){
            console.log("ipfs image upload error: ", error)
          }
        }
      }
  }

  const toggleListing = async () => {
    setCreateListing(!createListing)
    console.log(listings[0])
  }

  useEffect(() => {
    console.log('Listings updated:', listings);
  }, [listings]);

  return (
    <div className="h-[20%] w-[60%]">
      <div className="listing-list pl-[50%] mb-[5%] mt-[5%]">
        {listings.map((listing, index: number) => (
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
