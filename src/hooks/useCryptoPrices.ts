import { useEffect, useState } from "react";
import axios from "axios";

type CryptoPrice = {
    [symbol: string]: {
        brl: number;
    };
};

export function useCryptoPrices(coinIds: string[]) {
    const [prices, setPrices] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPrices() {
            try {
                const ids = coinIds.join(",");
                const res = await axios.get<CryptoPrice>(
                    `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=brl`
                );
                const data: Record<string, number> = {};
                coinIds.forEach((id) => {
                    data[id] = res.data[id]?.brl ?? 0;
                });
                setPrices(data);
            } catch (err) {
                console.error("Erro ao buscar preços:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchPrices();
    }, [coinIds]);

    return { prices, loading };
}
