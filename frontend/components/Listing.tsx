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
import { useParams } from 'react-router-dom';
import { Provider, Network } from "aptos";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = "You are a real estate agent. Analyze and give me the exact price";
const userPrompt = "Give me just the price, don't write anything else";
const GEMINI_KEY = import.meta.env.REACT_APP_GEMINI_KEY;
const firstPrompt = 'You are a real estate agent. Analyze and give me an approximate price, not a range.'
const lastPrompt = "Give me just the price in dollars, don't write anything else."

const moduleAddress = import.meta.env.REACT_APP_MODULE_ADDRESS;
const moduleName = import.meta.env.REACT_APP_MODULE_NAME;

const provider = new Provider(Network.DEVNET);

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
}

export function Listing() {
  const { address, index } = useParams();
  const navigate = useNavigate();
  const { account, signAndSubmitTransaction } = useWallet();
  const [listing, setListing] = useState<Listing>({})

  const [newStatus, setNewStatus] = useState<string>(listing.status);

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
    //if (!account) return;

    setLoading(true);
    setError(null);

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

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(event.target.value);
  };

  const handleStatusSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    setLoading(true);
    setError(null);

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
          <p className="mb-4">Description: {listing.description}</p>
          <p className="mb-4">Price: {listing.price}</p>
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
            <button
              className="w-[60%] bg-teal-500 text-white py-2 rounded hover:bg-teal-600"
              onClick={changeOfferStatus}
            >
              Save Offer Status
            </button>
            <button
              className="w-[60%] bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600"
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
                        <p className="italic">The '{combination.ai_name}' AI</p>
                        <p className="italic">Using the following input '{combination.input}'</p>
                        <p className="italic">Estimated the price to be: {combination.result}</p>
                      </>) : combination.type === 'estimation' ?
                      (<>
                        <p className="font-semibold">{timestampConverter(combination.timestamp)}</p>
                        <p className="italic">The company using the address '{combination.company}'</p>
                        <p className="italic">Left the following comment '{combination.description}'</p>
                        <p className="italic">Estimated the price to be: {combination.price}</p>
                      </>) : combination.type === 'review' ?
                      (<>
                        <p className="font-semibold">{timestampConverter(combination.timestamp)}</p>
                        <p className="italic">A user visited the flat and reviewed it as '{combination.description}'</p>
                        <p className="italic">The user also rated the flat: '{combination.rating} / 5'</p>
                      </>) : combination.type === 'offer' ?
                      (<>
                        <p className="font-semibold">{timestampConverter(combination.timestamp)}</p>
                        <p className="italic">An offer was made, that has the current status: '{combination.status}'</p>
                        <p className="italic">The price offer was: {combination.price}</p>
                      </>) : combination.type === 'legal_offer' ?
                      (<>
                        <p className="font-semibold">{timestampConverter(combination.timestamp)}</p>
                        <p className="italic">The company using the address '{combination.company}' made a legal offer</p>
                        <p className="italic">The current status: '{combination.status}'</p>
                        <p className="italic">The company wants a fee of: '{combination.price}'</p>
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
