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
  address: string,
  index: number,
  price: number;
  description: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({ address, index, price, description }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/listings/${address}/${index}`);
  };

  return (
    <div className="listing-card flex" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="w-1/4 listing-image">
        <img src="public/aptos.png" alt="Listing" className="listing-image w-full h-auto" />
      </div>
      <div className="w-2/3 pl-4 flex flex-col justify-between">
        <p className="italic m-0">{description}</p>
        <h3 className="font-bold ml-[60%]">
          Price: {price}
        </h3>
      </div>
    </div>
  );
}
