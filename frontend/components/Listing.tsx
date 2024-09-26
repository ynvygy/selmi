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

  const api = new OpenAI({
    API_KEY,
    BASE_URL,
    dangerouslyAllowBrowser: true
  });

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
         functionArguments: [account.address, 0, 0, "mistralai/Mistral-7B-Instruct-v0.2", finalUserPrompt, response ], //to be updated
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
  };

  return (
    <>
      <div className="listing-card">
        <h3>Photo</h3>
        <h3>Title</h3>
        <p>Description</p>
      </div>
      <button className="btn btn-white" onClick={fetchAiEstimate}>Add ai estimate</button>
    </>
  );
}
