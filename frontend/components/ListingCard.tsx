import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
// Internal components
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { PinataSDK } from "pinata-web3";

interface ListingCardProps {
  address: string,
  index: number,
  price: number;
  description: string;
  photo: string;
}

export const ListingCard: React.FC<ListingCardProps> = ({ address, index, price, description, photo }) => {
  const navigate = useNavigate();
  const { account, signAndSubmitTransaction } = useWallet();
  const [ image, setImage ] = useState("")

  const pinata = new PinataSDK({
    pinataJwt: import.meta.env.REACT_APP_PINATA_JWT,
    pinataGateway: import.meta.env.REACT_APP_PINATA_GATEWAY,
  });

  const handleClick = () => {
    navigate(`/listings/${address}/${index}`);
  };

  const fileImageDownload = async (event) => {
    if (!photo) return;

    try {
      const data = await pinata.gateways.get(photo);

      const response = { data: data.data, contentType: 'image/webp' };

      const imageUrl = URL.createObjectURL(response.data);
      console.log(imageUrl)
      setImage(imageUrl)
    } catch (error) {
      console.log("Error fetching or displaying image:", error);
    }
  }

  useEffect(() => {
    fileImageDownload();
  }, [account]);

  return (
    <div className="listing-card flex" onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className="w-1/4">
        <img src={image} alt="photo" className="listing-image max-w-[100px] h-[100px]" />
      </div>
      <div className="w-3/4 ml-[15%] flex flex-col justify-between">
        <p className="italic m-0">{description}</p>
        <h3 className="font-bold ml-[70%]">
          {price}
        </h3>
      </div>
    </div>
  );
}
