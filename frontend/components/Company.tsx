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

interface CompanyProps {
  provider: any;
  moduleAddress: string;
  moduleName: string;
}

export const Company: React.FC<CompanyProps> = ({provider, moduleAddress, moduleName }) => {
  const { account, signAndSubmitTransaction } = useWallet();
  const [company, setCompany] = useState<Company | null>(null);

  const createCompany = async() => {
    if (!account) return;
  }

  const fetchCompany = async () => {
    if (!account) return;

    try {
      const result: Company = await provider.view({
        function: `${moduleAddress}::${moduleName}::get_company`,
        type_arguments: [],
        arguments: [account.address],
      });

      console.log(result);
      setCompany(result);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  }

  return (
    <>
      <div className="flex justify-center mt-16">
        <button
          className="px-6 py-3 text-lg font-semibold rounded-lg"
          onClick={fetchCompany}
          style={{
            background: "none",
            border: "2px solid transparent",
            borderImage: "linear-gradient(to right, #3b82f6, #22c55e) 1",
            boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
          }}
        >
          Fetch Company
        </button>
      </div>
    </>
  )
}
