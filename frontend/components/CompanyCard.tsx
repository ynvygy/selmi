import { useEffect, useState } from "react";
interface CompanyCardProps {
  company: Company;
}

// Internal components

interface Company {
  name: string;
  description: string;
  reviews: Review[];
}

interface Review {
  description: string;
  rating: number;
  timestamp: number;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const [rating, setRating] = useState<number>(0);

  const calculateRating = async () => {
    if (company.reviews.length === 0) {
      setRating(0); // or return null, or any other placeholder value
    } else {
      const totalRating = company.reviews.reduce((acc: any, review: any) => acc + review.rating, 0);
      const averageRating = totalRating / company.reviews.length;

      setRating(parseFloat(averageRating.toFixed(2)));
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

  useEffect(() => {
    calculateRating()
  }, [company]);

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Your Company's Info</h2>
      <p className="text-gray-700 text-center mb-4">{company.name}</p>
      <p className="text-gray-700 text-center mb-4">{company.description}</p>
      <div className="flex items-center">
        {rating}
        <div className="flex text-lg">
          {renderStars(rating)}
        </div>
        <span className="ml-2 text-gray-600">{rating.toFixed(1)}</span>
      </div>
    </div>
  );
}
