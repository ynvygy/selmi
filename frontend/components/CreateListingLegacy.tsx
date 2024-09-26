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

export function CreateListing() {
  const [price, setPrice] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const { account, signAndSubmitTransaction } = useWallet();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await provider.sendTransaction({
        function: `${moduleAddress}::${moduleName}::create_listing`,
        type_arguments: [],
        arguments: [account.address, price, description],
      });

      // Optionally, you can reset the form or display a success message
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

  return (
    <div className="form-container flex items-center justify-center ">
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
      </form>
    </div>
  );
}
