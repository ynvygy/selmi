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
import { OpenAI } from "openai";
import { useParams } from 'react-router-dom';
import { Provider, Network } from "aptos";

const BASE_URL = import.meta.env.REACT_APP_BASE_URL;
const API_KEY = import.meta.env.REACT_APP_API_KEY;
const systemPrompt = "You are a real estate agent. Analyze and give me the exact price";
const userPrompt = "Give me just the price, don't write anything else";

const moduleAddress = import.meta.env.REACT_APP_MODULE_ADDRESS;
const moduleName = import.meta.env.REACT_APP_MODULE_NAME;

const provider = new Provider(Network.DEVNET);

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

export function Listing() {
  const { address, index } = useParams();
  const navigate = useNavigate();
  const { account, signAndSubmitTransaction } = useWallet();
  const [listing, setListing] = useState<Listing>({})

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [combinedItems, setCombinedItems] = useState([]);

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

  const api = new OpenAI({
    apiKey: import.meta.env.REACT_APP_API_KEY,
    baseUrl: import.meta.env.REACT_APP_BASE_URL,
    dangerouslyAllowBrowser: true
  });

  const getCurrentTimestamp = (): number => {
    const currentDate = new Date();
    return Math.floor(currentDate.getTime() / 1000);
  };

  const timestampConverter = (timestamp): string => {
      const date = new Date(timestamp * 1000);

      const formattedDate = date.toLocaleString();

      return formattedDate
  };

  const fetchAiEstimate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    setLoading(true);
    setError(null);

    const finalUserPrompt = listing.description + userPrompt
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
    const min = 50000;
    const max = 200000;
    const response = Math.floor(Math.random() * (max - min + 1)) + min;

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::add_ai_estimate`,
         type_arguments: [],
         functionArguments: [address, index, "mistralai/Mistral-7B-Instruct-v0.2", finalUserPrompt, response, getCurrentTimestamp()],
       }
     }

    try {
      const response = await signAndSubmitTransaction(transaction);

      await provider.waitForTransaction(transaction.hash);
      setDescription('');
      alert('Listing created successfully!');
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleEstimatePriceChange = async (e) => {
      setEstimatedPrice(e.target.value)
  };

  const handleEstimateDescriptionChange = async (e) => {
      setEstimatedDescription(e.target.value);
  };

  const toggleEstimate = async (event) => {
      setAddEstimate(!addEstimate)
      setAddReview(false)
      setAddOffer(false)
      setAddLegalOffer(false)
  }

  const saveEstimate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    setLoading(true);
    setError(null);

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::add_estimate`,
         type_arguments: [],
         functionArguments: [account.address, 0, 99999, "description", getCurrentTimestamp() ],
       }
     }

    try {
      const response = await signAndSubmitTransaction(transaction);

      await provider.waitForTransaction(transaction.hash);
      setDescription('');
      alert('Estimation created successfully');
    } catch (err) {
      console.error('Error creating estimation:', err);
      setError('Failed to create estimation. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleReviewDescriptionChange = async (e) => {
      setReviewDescription(e.target.value)
  };

  const handleReviewRatingChange = async (e) => {
      setReviewRating(e.target.value);
  };

  const toggleReview = async (event) => {
      setAddReview(!addReview)
      setAddEstimate(false)
      setAddOffer(false)
      setAddLegalOffer(false)
  }

  const saveReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    setLoading(true);
    setError(null);

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::add_listing_review`,
         type_arguments: [],
         functionArguments: [address, index, reviewDescription, reviewRating, getCurrentTimestamp() ],
       }
     }

    try {
      const response = await signAndSubmitTransaction(transaction);

      await provider.waitForTransaction(transaction.hash);
      setDescription('');
      alert('Review created successfully');
    } catch (err) {
      console.error('Error creating review:', err);
      setError('Failed to create review. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleOfferDescriptionChange = async (e) => {
      setOfferDescription(e.target.value)
  };

  const handleOfferPriceChange = async (e) => {
      setOfferPrice(e.target.value);
  };

  const toggleOffer = async (event) => {
      setAddOffer(!addOffer)
      setAddReview(false)
      setAddEstimate(false)
      setAddLegalOffer(false)
  }

  const saveOffer = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    setLoading(true);
    setError(null);

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::add_offer`,
         type_arguments: [],
         functionArguments: [address, index, offerDescription, offerPrice, getCurrentTimestamp() ],
       }
     }

    try {
      const response = await signAndSubmitTransaction(transaction);

      await provider.waitForTransaction(transaction.hash);
      setDescription('');
      alert('Offer created successfully');
    } catch (err) {
      console.error('Error creating offer:', err);
      setError('Failed to create offer. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleLegalOfferPriceChange = async (e) => {
      setLegalOfferPrice(e.target.value);
  };

  const toggleLegalOffer = async (event) => {
      setAddLegalOffer(!addLegalOffer)
      setAddReview(false)
      setAddEstimate(false)
      setAddOffer(false)
  }

  const saveLegalOffer = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    setLoading(true);
    setError(null);

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::add_company_offer`,
         type_arguments: [],
         functionArguments: [account.address, 0, 100, getCurrentTimestamp() ],
       }
     }

    try {
      const response = await signAndSubmitTransaction(transaction);

      await provider.waitForTransaction(transaction.hash);
      setDescription('');
      alert('Legal offer created successfully');
    } catch (err) {
      console.error('Error creating legal offer:', err);
      setError('Failed to create legal offer. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const changeOfferStatus = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    setLoading(true);
    setError(null);

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::change_offer_status`,
         type_arguments: [],
         functionArguments: [0, "status" ],
       }
     }

    try {
      const response = await signAndSubmitTransaction(transaction);

      await provider.waitForTransaction(transaction.hash);
      setDescription('');
      alert('Offer status changed successfully');
    } catch (err) {
      console.error('Error changing offer status:', err);
      setError('Failed to change offer status. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const changeLegalOfferStatus = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    setLoading(true);
    setError(null);

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::change_company_offer_status`,
         type_arguments: [],
         functionArguments: [ 0, 0, "status" ],
       }
     }

    try {
      const response = await signAndSubmitTransaction(transaction);

      await provider.waitForTransaction(transaction.hash);
      setDescription('');
      alert('Legal offer status changed successfully');
    } catch (err) {
      console.error('Error changing legal offer status:', err);
      setError('Failed to change legal offer status. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const fetchListing = async () => {
    if (!account) return;
    console.log(moduleAddress)
    try {
      const result: Listing[] = await provider.view({
        function: `${moduleAddress}::${moduleName}::get_user_listing`,
        type_arguments: [],
        arguments: [address, index],
      });

      console.log(result);
      setListing(result[0]);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [account]);

  useEffect(() => {
    if (listing.description) {
      orderListingItems();
    }
  }, [listing]);

  const orderListingItems = async () => {
    if (listing) {
      const combined = [
          ...listing.offers.map(offer => ({ ...offer, type: 'offer', idx: index })),
          ...listing.estimates.map(est => ({ ...est, type: 'estimation', idx: index })),
          ...listing.ai_estimates.map(aiEst => ({ ...aiEst, type: 'ai_estimation', idx: index })),
          ...listing.reviews.map(review => ({ ...review, type: 'review', idx: index })),
          ...listing.legal_offers.map(legalOffer => ({ ...legalOffer, type: 'legal_offer', idx: index }))
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

          <div className="grid grid-cols-3 gap-2 mb-4">
            {listing && listing.photos && listing.photos.length > 0 ? (
              listing.photos.map((photo, index) => (
                <img
                  key={index}
                  src="/watch.jpeg"
                  alt={`Listing photo ${index + 1}`}
                  className="w-[50%] h-32 object-cover rounded"
                />
              ))
            ) : (
              <p>No photos available.</p>
            )}
          </div>
          <h3 className="text-xl font-bold mb-2">Title</h3>
          <p className="mb-4">Description:</p>
        </div>
        <div className="w-[25%]">
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
                <label className="block mb-2" htmlFor="price">Description</label>
                <input
                    type="text"
                    id="description"
                    className="border border-gray-300 p-2 mb-4 w-full"
                    placeholder="Enter description"
                    value={reviewDescription}
                    onChange={handleReviewDescriptionChange}
                />

                <label className="block mb-2" htmlFor="description">Rating</label>
                <input
                    type="text"
                    id="rating"
                    className="border border-gray-300 p-2 mb-4 w-full"
                    placeholder="Enter rating"
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
                <label className="block mb-2" htmlFor="price">Description</label>
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
                    value={offerLegalOfferPrice}
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
              className="w-[50%] bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              onClick={fetchAiEstimate}
            >
              Add AI Estimate
            </button>
            <button
              className="w-[50%] bg-green-500 text-white py-2 rounded hover:bg-green-600"
              onClick={toggleEstimate}
            >
              Add Estimate
            </button>
            <button
              className="w-[50%] bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600"
              onClick={toggleReview}
            >
              Add Review
            </button>
            <button
              className="w-[50%] bg-purple-500 text-white py-2 rounded hover:bg-purple-600"
              onClick={toggleOffer}
            >
              Add Offer
            </button>
            <button
              className="w-[50%] bg-red-500 text-white py-2 rounded hover:bg-red-600"
              onClick={toggleLegalOffer}
            >
              Add Legal Offer
            </button>
            <button
              className="w-[50%] bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
              onClick={changeOfferStatus}
            >
              Save Offer Status
            </button>
            <button
              className="w-[50%] bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
              onClick={changeLegalOfferStatus}
            >
              Save Legal Offer Status
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
                        ? 'bg-red-200'
                        : combination.type === 'offer'
                        ? 'bg-yellow-200'
                        : combination.type === 'legal_offer'
                        ? 'bg-brown-200'
                        : 'bg-gray-200';

                return (
                    <div
                        key={index}
                        className={`p-4 rounded shadow mb-4 ${bgColor}`}
                    > {
                      combination.type === 'ai_estimation' ?
                      (<>
                        <p className="font-semibold">{timestampConverter(combination.timestamp)}</p>
                        <p className="font-semibold">{combination.input}</p>
                        <p className="italic">Result: {combination.result}</p>
                      </>) : combination.type === 'estimation' ?
                      (<>
                        <p className="font-semibold">{timestampConverter(combination.timestamp)}</p>
                        <p className="font-semibold">{combination.company}</p>
                        <p>{combination.description}</p>
                        <p className="italic">Price: {combination.price}</p>
                      </>) : combination.type === 'review' ?
                      (<>
                        <p className="font-semibold">{timestampConverter(combination.timestamp)}</p>
                        <p>{combination.description}</p>
                        <p className="italic">Rating: {combination.rating}</p>
                      </>) : combination.type === 'offer' ?
                      (<>
                        <p className="font-semibold">{timestampConverter(combination.timestamp)}</p>
                        <p>{combination.status}</p>
                        <p className="italic">Price: {combination.price}</p>
                      </>) : combination.type === 'legal_offer' ?
                      (<>
                        <p className="font-semibold">{timestampConverter(combination.timestamp)}</p>
                        <p className="font-semibold">{combination.address}</p>
                        <p>{combination.status}</p>
                        <p className="italic">Price: {combination.price}</p>
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
