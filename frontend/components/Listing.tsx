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

export function Listing() {
  const navigate = useNavigate();

  return (
    <>
      <div className="listing-card">
        <h3>Photo</h3>
        <h3>Title</h3>
        <p>Description</p>
      </div>
      <button className="btn btn-white">Add ai estimate</button>
    </>
  );
}
