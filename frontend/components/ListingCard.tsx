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

interface ListingCardProps {
  price: number;
  description: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({ id, price, description }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/listings/${id}`);
  };

  return (
    <div className="listing-card" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <h3>Price: {price}</h3>
      <p>Description: {description}</p>
      {/* Add more details or styling as needed */}
    </div>
  );
}
