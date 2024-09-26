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
  description: string;
  documents: Document[];
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

  return (
    <div className="flex items-center justify-center">
      {company.description}
      {rating}
    </div>

  );
}
