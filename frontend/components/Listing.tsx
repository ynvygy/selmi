import { useEffect, useState, ChangeEvent } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal components
import { useParams } from 'react-router-dom';
import { Provider, Network } from "aptos";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { PinataSDK } from "pinata-web3";

const GEMINI_KEY = import.meta.env.REACT_APP_GEMINI_KEY;
const firstPrompt = 'You are a master seller of everything. Analyze and give me an approximate price, not a range.'
const lastPrompt = "Give me just the price in dollars, don't write anything else."

const moduleAddress = import.meta.env.REACT_APP_MODULE_ADDRESS;
const moduleName = import.meta.env.REACT_APP_MODULE_NAME;

const provider = new Provider(Network.TESTNET);

const statuses = ['OPEN', 'ACTIVE', 'REJECTED', 'ACCEPTED', 'INACTIVE'];

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
  reviews: Review[]
}

interface BaseCombinedItem {
  type: string;
  idx: number;
}

interface Offer extends BaseCombinedItem {
  description: string;
  status: string;
  price: number;
  timestamp: number;
}

interface Estimation extends BaseCombinedItem {
  company: string;
  price: number;
  description: string;
  timestamp: number;
}

interface AiEstimation extends BaseCombinedItem {
  ai_name: string;
  input: string;
  result: string;
  timestamp: number;
}

interface CompanyOffer extends BaseCombinedItem {
  name: string;
  status: string;
  price: number;
  timestamp: number;
}

interface Review extends BaseCombinedItem {
  description: string;
  rating: number;
  timestamp: number;
}

type CombinedItem = Offer | Estimation | Review | CompanyOffer | AiEstimation;

export function Listing() {
  const { address, index } = useParams();
  const { account, signAndSubmitTransaction } = useWallet();
  const [listing, setListing] = useState<Partial<Listing>>({});
  const [photos, setPhotos] = useState<string[]>([]);
  const [rating, setRating] = useState(0)

  const [newStatus, setNewStatus] = useState('');

  const [combinedItems, setCombinedItems] = useState<CombinedItem[]>([]);

  const [addEstimate, setAddEstimate] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [estimatedDescription, setEstimatedDescription] = useState('');

  const [addReview, setAddReview] = useState(false);
  const [reviewDescription, setReviewDescription] = useState('');
  const [reviewRating, setReviewRating] = useState(0);

  const [addOffer, setAddOffer] = useState(false);
  const [offerDescription, setOfferDescription] = useState('');
  const [offerPrice, setOfferPrice] = useState(0);

  const [addLegalOffer, setAddLegalOffer] = useState(false);
  const [legalOfferPrice, setLegalOfferPrice] = useState(0);

  const pinata = new PinataSDK({
    pinataJwt: import.meta.env.REACT_APP_PINATA_JWT,
    pinataGateway: import.meta.env.REACT_APP_PINATA_GATEWAY,
  });

  const getCurrentTimestamp = (): number => {
    const currentDate = new Date();
    return Math.floor(currentDate.getTime() / 1000);
  };

  const timestampConverter = (timestamp: number): string => {
      const date = new Date(timestamp * 1000);

      const formattedDate = date.toLocaleString();

      return formattedDate
  };

  const fetchAiEstimate = async (event: React.FormEvent) => {
    event.preventDefault();
    //if (!account) return;

    /*
    const ai_result = await api.chat.completions.create({
      model: "togethercomputer/CodeLlama-34b-Instruct",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: finalUserPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 256,
    });

    const response = ai_result.choices[0].message.content;
    */
    //console.log(response)
    //console.log("User:", userPrompt);
    //console.log("AI:", response);
    /*
    const min = 50000;
    const max = 200000;
    const response = Math.floor(Math.random() * (max - min + 1)) + min;
    */

    const genAI = new GoogleGenerativeAI(GEMINI_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    //const prompt = firstPrompt + listing.description + lastPrompt;
    const prompt = firstPrompt + listing.description + lastPrompt

    const result = await model.generateContent(prompt);

    const response = result.response.text()
    console.log(response);
    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::add_ai_estimate`,
         type_arguments: [],
         functionArguments: [address, index, "gemini-1.5-flash", listing.description, response, getCurrentTimestamp()],
       }
     }

    try {
      //const response = await signAndSubmitTransaction(transaction);

      await provider.waitForTransaction(transaction.hash);
      alert('Listing created successfully!');
    } catch (err) {
      alert('Listing created successfully!');
    }
  }

  const handleEstimatePriceChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const numericValue = value ? parseFloat(value) : 0;

    setEstimatedPrice(numericValue);
  };

  const handleEstimateDescriptionChange = async (e: ChangeEvent<HTMLInputElement>) => {
      setEstimatedDescription(e.target.value);
  };

  const toggleEstimate = async () => {
      setAddEstimate(!addEstimate)
      setAddReview(false)
      setAddOffer(false)
      setAddLegalOffer(false)
  }

  const saveEstimate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::add_estimate`,
         type_arguments: [],
         functionArguments: [account.address, index, estimatedPrice, estimatedDescription, getCurrentTimestamp() ],
       }
     }

    try {
      await signAndSubmitTransaction(transaction);
      //const response = await signAndSubmitTransaction(transaction);
      //console.log(response)

      await provider.waitForTransaction(transaction.hash);
      alert('Estimation created successfully');
    } catch (err) {
      fetchListing()
    }
  }

  const handleReviewDescriptionChange = async (e: ChangeEvent<HTMLInputElement>) => {
      setReviewDescription(e.target.value)
  };

  const handleReviewRatingChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= 5) {
        setReviewRating(value);
    } else if (e.target.value === '') {
        setReviewRating(0);
    }
  };

  const toggleReview = async () => {
      setAddReview(!addReview)
      setAddEstimate(false)
      setAddOffer(false)
      setAddLegalOffer(false)
  }

  const saveReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::add_listing_review`,
         type_arguments: [],
         functionArguments: [address, index, reviewDescription, reviewRating, getCurrentTimestamp() ],
       }
     }

    try {
      //const response = await signAndSubmitTransaction(transaction);
      await signAndSubmitTransaction(transaction);
      await provider.waitForTransaction(transaction.hash);
      alert('Review created successfully');
    } catch (err) {
      fetchListing()
    }
  }

  const handleOfferDescriptionChange = async (e: ChangeEvent<HTMLInputElement>) => {
      setOfferDescription(e.target.value)
  };

  const handleOfferPriceChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const numericValue = value ? parseFloat(value) : 0;

    setOfferPrice(numericValue);
  };

  const toggleOffer = async () => {
      setAddOffer(!addOffer)
      setAddReview(false)
      setAddEstimate(false)
      setAddLegalOffer(false)
  }

  const saveOffer = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::add_offer`,
         type_arguments: [],
         functionArguments: [address, index, offerDescription, offerPrice, getCurrentTimestamp() ],
       }
     }

    try {
      await signAndSubmitTransaction(transaction);
      //const response = await signAndSubmitTransaction(transaction);

      await provider.waitForTransaction(transaction.hash);
      alert('Offer created successfully');
    } catch (err) {
      fetchListing()
    }
  }

  const handleLegalOfferPriceChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const numericValue = value ? parseFloat(value) : 0;

    setLegalOfferPrice(numericValue);
  };

  const toggleLegalOffer = async () => {
      setAddLegalOffer(!addLegalOffer)
      setAddReview(false)
      setAddEstimate(false)
      setAddOffer(false)
  }

  const saveLegalOffer = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::add_company_offer`,
         type_arguments: [],
         functionArguments: [address, index, legalOfferPrice, getCurrentTimestamp() ],
       }
     }

    try {
      //const response = await signAndSubmitTransaction(transaction);
      await signAndSubmitTransaction(transaction);
      await provider.waitForTransaction(transaction.hash);
      alert('Legal offer created successfully');
    } catch (err) {
      fetchListing()
    }
  }

  const changeOfferStatus = async (status: string, idx: number) => {
    if (!account) return;

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::change_offer_status`,
         type_arguments: [],
         functionArguments: [index, idx, status],
       }
     }

    try {
      //const response = await signAndSubmitTransaction(transaction);
      await signAndSubmitTransaction(transaction);

      await provider.waitForTransaction(transaction.hash);
      alert('Offer status changed successfully');
    } catch(err) {
      fetchListing()
    }
  }

  const changeLegalOfferStatus = async (status: string, idx: number) => {
    if (!account) return;

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::change_company_offer_status`,
         type_arguments: [],
         functionArguments: [ index, idx, status ],
       }
     }

    try {
      //const response = await signAndSubmitTransaction(transaction);
      await signAndSubmitTransaction(transaction);

      await provider.waitForTransaction(transaction.hash);
      alert('Legal offer status changed successfully');
    } catch (err) {
      fetchListing()
    }
  }

  const fetchListing = async () => {
    if (!account) return;
    console.log(moduleAddress)
    try {
      const result = await provider.view({
        function: `${moduleAddress}::${moduleName}::get_user_listing`,
        type_arguments: [],
        arguments: [address, index],
      });

      setListing(result[0]);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(event.target.value);
  };

  const handleStatusSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    setListing({ ...listing, status: newStatus });
    console.log('Status updated to:', newStatus);

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::change_listing_status`,
         type_arguments: [],
         functionArguments: [index, newStatus],
       }
     }

    try {
      //const response = await signAndSubmitTransaction(transaction);
      await signAndSubmitTransaction(transaction);

      await provider.waitForTransaction(transaction.hash);
      alert('Offer status changed successfully');
    } catch (err) {
      alert('Offer status changed successfully');
    }
  };

  const filesImagesDownload = async () => {
    if (!listing.photos || listing.photos.length == 0) return;
    if (photos.length > 0) return;

    for (const cid of listing.photos) {
      try {
        const data = await pinata.gateways.get(cid);

        const response = { data: data.data, contentType: 'image/webp' };

        if (response.data instanceof Blob) {
          const imageUrl = URL.createObjectURL(response.data);
          setPhotos((prevPhotos) => [...prevPhotos, imageUrl]);
        }
      } catch (error) {
        console.log("Error fetching or displaying image:", error);
      }
    }
  }

  const getReviewRating = () => {
    if (!listing.reviews || listing.reviews.length === 0) return; // Handle case with no reviews

    const total = listing.reviews.reduce((sum, review) => sum + review.rating, 0); // Sum the ratings
    setRating(total / listing.reviews.length);
  };

  useEffect(() => {
    fetchListing();
  }, [account]);

  useEffect(() => {
    if (listing.description) {
      orderListingItems();
    }
    if (listing.status !== undefined) {
        setNewStatus(listing.status);
    }
    filesImagesDownload();
    getReviewRating()
  }, [listing]);

  const orderListingItems = async () => {
    if (listing) {
      const combined = [
        ...((listing.offers ?? []).map((offer, idx) => ({ ...offer, type: 'offer', idx }))),
        ...((listing.estimates ?? []).map((est, idx) => ({ ...est, type: 'estimation', idx }))),
        ...((listing.ai_estimates ?? []).map((aiEst, idx) => ({ ...aiEst, type: 'ai_estimation', idx }))),
        ...((listing.reviews ?? []).map((review, idx) => ({ ...review, type: 'review', idx }))),
        ...((listing.legal_offers ?? []).map((legalOffer, idx) => ({ ...legalOffer, type: 'legal_offer', idx })))
      ];

      // Sort by timestamp
      combined.sort((a, b) => a.timestamp - b.timestamp);

      setCombinedItems(combined);
    }
  };

  return (
    <>
      <div className="listing-card p-4 border border-gray-200 rounded-lg shadow-md w-[80%] ml-[10%] flex">
        <div className="w-[50%]">
          <h3 className="text-lg font-semibold mb-2">Photos</h3>

          <div className="grid grid-cols-5 gap-1 mb-1">
            {listing && listing.photos && listing.photos.length > 0 ? (
              photos.slice(0, 5).map((photo, i) => (
                <img key={i} src={photo} alt="image-from-api" className="max-w-[100px] h-[100px]"/>
              ))
            ) : (
              <p>No photos available.</p>
            )}
          </div>
          <p className="mb-4">Description: {listing.description}</p>
          <p className="mb-4">Price: {listing.price}</p>
          <p className="mb-4">Current rating: {rating}</p>
          <div className="flex flex-col items-center bg-white shadow-md rounded-lg w-[25%]">
            <div className="flex flex-col w-full">
              <select
                value={newStatus}
                onChange={handleStatusChange}
                className="mb-2 p-2 border border-gray-300 rounded"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <button
                onClick={handleStatusSave}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Save Status
              </button>
            </div>
          </div>
        </div>
        <div className="w-[20%] mr-[5%]">
          {addEstimate && (
            <>
                <label className="block mb-2" htmlFor="price">Price</label>
                <input
                    type="text"
                    id="price"
                    className="border border-gray-300 p-2 mb-4 w-full"
                    placeholder="Enter price"
                    value={estimatedPrice}
                    onChange={handleEstimatePriceChange}
                />

                <label className="block mb-2" htmlFor="description">Description</label>
                <input
                    type="text"
                    id="description"
                    className="border border-gray-300 p-2 mb-4 w-full"
                    placeholder="Enter description"
                    value={estimatedDescription}
                    onChange={handleEstimateDescriptionChange}
                />

                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={saveEstimate}
                >
                    Submit
                </button>
            </>
          )}
          {addReview && (
            <>
                <label className="block mb-2" htmlFor="description">Description</label>
                <input
                    type="text"
                    id="description"
                    className="border border-gray-300 p-2 mb-4 w-full"
                    placeholder="Enter description"
                    value={reviewDescription}
                    onChange={handleReviewDescriptionChange}
                />

                <label className="block mb-2" htmlFor="rating">Rating</label>
                <input
                    type="number"
                    id="rating"
                    className="border border-gray-300 p-2 mb-4 w-full"
                    placeholder="Enter rating (1 to 5)"
                    min="1"
                    max="5"
                    value={reviewRating}
                    onChange={handleReviewRatingChange}
                />

                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={saveReview}
                >
                    Submit
                </button>
            </>
          )}
          {addOffer && (
            <>
                <label className="block mb-2" htmlFor="description">Description</label>
                <input
                    type="text"
                    id="description"
                    className="border border-gray-300 p-2 mb-4 w-full"
                    placeholder="Enter description"
                    value={offerDescription}
                    onChange={handleOfferDescriptionChange}
                />

                <label className="block mb-2" htmlFor="description">Price</label>
                <input
                    type="text"
                    id="price"
                    className="border border-gray-300 p-2 mb-4 w-full"
                    placeholder="Enter price"
                    value={offerPrice}
                    onChange={handleOfferPriceChange}
                />

                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={saveOffer}
                >
                    Submit
                </button>
            </>
          )}
          {addLegalOffer && (
            <>
                <label className="block mb-2" htmlFor="description">Price</label>
                <input
                    type="text"
                    id="price"
                    className="border border-gray-300 p-2 mb-4 w-full"
                    placeholder="Enter price"
                    value={legalOfferPrice}
                    onChange={handleLegalOfferPriceChange}
                />

                <button
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                    onClick={saveLegalOffer}
                >
                    Submit
                </button>
            </>
          )}
        </div>
        <div className="w-[25%]">
          <div className="flex flex-col">
            <button
              className="w-[60%] bg-blue-400 text-white py-2 rounded hover:bg-blue-600 mb-1"
              onClick={fetchAiEstimate}
            >
              Add AI Estimate
            </button>
            <button
              className="w-[60%] bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-1"
              onClick={toggleEstimate}
            >
              Add Estimate
            </button>
            <button
              className="w-[60%] bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 mb-1"
              onClick={toggleReview}
            >
              Add Review
            </button>
            <button
              className="w-[60%] bg-purple-400 text-white py-2 rounded hover:bg-purple-600 mb-1"
              onClick={toggleOffer}
            >
              Add Offer
            </button>
            <button
              className="w-[60%] bg-red-400 text-white py-2 rounded hover:bg-red-600 mb-1"
              onClick={toggleLegalOffer}
            >
              Add Legal Offer
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="p-3 w-[80%] ml-[10%]">
            {combinedItems && combinedItems.map((combination, index) => {
                const bgColor =
                    combination.type === 'ai_estimation'
                        ? 'bg-blue-200'
                        : combination.type === 'estimation'
                        ? 'bg-green-200'
                        : combination.type === 'review'
                        ? 'bg-yellow-200'
                        : combination.type === 'offer'
                        ? 'bg-purple-200'
                        : combination.type === 'legal_offer'
                        ? 'bg-red-200'
                        : 'bg-gray-200';

                return (
                    <div
                        key={index}
                        className={`p-4 rounded shadow mb-4 ${bgColor}`}
                    > {
                      combination.type === 'ai_estimation' ?
                      (<>
                        <p className="font-semibold">{timestampConverter(combination.timestamp)}</p>
                        <p className="italic">The '{(combination as AiEstimation).ai_name}' AI</p>
                        <p className="italic">Using the following input '{(combination as AiEstimation).input}'</p>
                        <p className="italic">Estimated the price to be: {(combination as AiEstimation).result}</p>
                      </>) : combination.type === 'estimation' ?
                      (<>
                        <p className="font-semibold">{timestampConverter(combination.timestamp)}</p>
                        <p className="italic">The company using the address '{(combination as Estimation).company}'</p>
                        <p className="italic">Left the following comment '{(combination as Estimation).description}'</p>
                        <p className="italic">Estimated the price to be: {(combination as Estimation).price}</p>
                      </>) : combination.type === 'review' ?
                      (<>
                        <p className="font-semibold">{timestampConverter(combination.timestamp)}</p>
                        <p className="italic">A user visited the flat and reviewed it as '{(combination as Review).description}'</p>
                        <p className="italic">The user also rated the flat: '{(combination as Review).rating} / 5'</p>
                      </>) : combination.type === 'offer' ?
                      (<>
                        <p className="font-semibold">{timestampConverter(combination.timestamp)}</p>
                        <p className="italic">The price offer was: {(combination as Offer).price}</p>
                        {(combination as Offer).status === 'OPEN' ? (
                          <div className="flex space-x-4 mt-4">
                            <button
                              onClick={() => changeOfferStatus('ACCEPTED', combination.idx)}
                              className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => changeOfferStatus('REJECTED', combination.idx)}
                              className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                              Reject
                            </button>
                          </div>
                        ) :
                        <p className="italic">The offer was: {(combination as Offer).status}</p>}
                      </>) : combination.type === 'legal_offer' ?
                      (<>
                        <p className="font-semibold">{timestampConverter(combination.timestamp)}</p>
                        <p className="italic">The company using the address '{(combination as CompanyOffer).name}' made a legal offer</p>
                        <p className="italic">The company wants a fee of: '{(combination as CompanyOffer).price}'</p>
                        <p>{combination.idx}</p>
                        {(combination as CompanyOffer).status === 'ACTIVE' ? (
                          <div className="flex space-x-4 mt-4">
                            <button
                              onClick={() => changeLegalOfferStatus('ACCEPTED', combination.idx)}
                              className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => changeLegalOfferStatus('REJECTED', combination.idx)}
                              className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                              Reject
                            </button>
                          </div>
                        ) :
                        <p className="italic">The offer was: {(combination as CompanyOffer).status}</p>}
                      </>) : (<></>)
                    }

                    </div>
                );
            })}
        </div>
      </div>
    </>
  );
}
