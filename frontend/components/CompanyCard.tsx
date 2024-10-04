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

interface Company {
  name: string;
  description: string;
  reviews: Review[];
}

export const CompanyCard: React.FC<Company> = ({ company }) => {
  const [rating, setRating] = useState(0);

  const calculateRating = async () => {
    if (company.reviews.length === 0) {
      setRating(0); // or return null, or any other placeholder value
    } else {
      const totalRating = company.reviews.reduce((acc, review) => acc + review.rating, 0);
      const averageRating = totalRating / company.reviews.length;

      setRating(averageRating.toFixed(2));
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-${i <= rating ? 'yellow-400' : 'gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Your Company's Info</h2>
      <p className="text-gray-700 text-center mb-4">{company.name}</p>
      <p className="text-gray-700 text-center mb-4">{company.description}</p>
      <div className="flex items-center">
        <div className="flex text-lg">
          {renderStars(rating)}
        </div>
        <span className="ml-2 text-gray-600">{rating.toFixed(1)}</span>
      </div>
    </div>
  );
}
