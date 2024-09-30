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

const BASE_URL = import.meta.env.REACT_APP_BASE_URL;
const API_KEY = import.meta.env.REACT_APP_API_KEY;
const systemPrompt = "You are a real estate agent. Analyze and give me the exact price";
const userPrompt = "To be added later. Give me just the price, don't write anything else";

export function Listing() {
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [combinedItems, setCombinedItems] = useState([]);

  const api = new OpenAI({
    apiKey: API_KEY,
    baseUrl: BASE_URL,
    dangerouslyAllowBrowser: true
  });

  const getCurrentTimestamp = (): number => {
    const currentDate = new Date();
    return Math.floor(currentDate.getTime() / 1000);
  };

  const fetchAiEstimate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    setLoading(true);
    setError(null);

    finalUserPrompt = ""

    const ai_result = await api.chat.completions.create({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 256,
    });

    const response = ai_result.choices[0].message.content;

    console.log("User:", userPrompt);
    console.log("AI:", response);

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::add_ai_estimate`,
         type_arguments: [],
         functionArguments: [account.address, 0, 0, "mistralai/Mistral-7B-Instruct-v0.2", finalUserPrompt, response, getCurrentTimestamp() ], //to be updated
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

  const addEstimate = async (event: React.FormEvent) => {
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

  const addReview = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    setLoading(true);
    setError(null);

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::add_listing_review`,
         type_arguments: [],
         functionArguments: [account.address, 0, "description", 5, getCurrentTimestamp() ],
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

  const addOffer = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!account) return;

    setLoading(true);
    setError(null);

    const transaction:InputTransactionData = {
       data: {
         function: `${moduleAddress}::${moduleName}::add_offer`,
         type_arguments: [],
         functionArguments: [account.address, 0, "description", 65000, getCurrentTimestamp() ],
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

  const addLegalOffer = async (event: React.FormEvent) => {
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

  const orderListingItems = async () => {
    if (listing) {
      const combined = [
          ...listing.offers.map(offer => ({ ...offer, type: 'offer' })),
          ...listing.estimates.map(est => ({ ...est, type: 'estimation' })),
          ...listing.ai_estimates.map(aiEst => ({ ...aiEst, type: 'ai_estimation' })),
          ...listing.reviews.map(review => ({ ...review, type: 'review' })),
          ...listing.legal_offers.map(legalOffer => ({ ...legalOffer, type: 'legal_offer' }))
      ];

      // Sort by timestamp
      combined.sort((a, b) => a.timestamp - b.timestamp);

      setCombinedItems(combined);
    }
  };

  return (
    <>
      <div className="listing-card">
        <h3>Photo</h3>
        <h3>Title</h3>
        <p>Description</p>
      </div>
      <button className="btn btn-white" onClick={fetchAiEstimate}>Add ai estimate</button>
      <button className="btn btn-white" onClick={addEstimate}>Add estimate</button>
      <button className="btn btn-white" onClick={addReview}>Add review</button>
      <button className="btn btn-white" onClick={addOffer}>Add offer</button>
      <button className="btn btn-white" onClick={addLegalOffer}>Add Legal Offer</button>
      <button className="btn btn-white" onClick={changeOfferStatus}>Save offer status</button>
      <button className="btn btn-white" onClick={changeLegalOfferStatus}>Save legal offer status</button>
    </>
  );
}
