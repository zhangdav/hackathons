import { useState, useEffect } from "react";

const CoinPrice: React.FC = () => {
  const [tokenPrice, setTokenPrice] = useState<number | null>(null);

  useEffect(() => {
    const fetchTokenPrice = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=chainlink&vs_currencies=usd"
        );
        const data = await response.json();
        setTokenPrice(data.chainlink.usd);
      } catch (error) {
        console.error("Error fetching token price:", error);
      }
    };

    fetchTokenPrice();
  }, []);

  return (
    <p>
      {tokenPrice !== null && (
        <p>Chainlink Current Price (${tokenPrice.toFixed(2)})</p>
      )}
    </p>
  );
};

export default CoinPrice;
