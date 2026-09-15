import axios from 'axios';
import type { Token } from '../types';

export const fetchTokenPrices = async (): Promise<Token[]> => {
  try {
    const { data } = await axios.get('https://interview.switcheo.com/prices.json');
    
    const priceMap = new Map<string, number>();
    data.forEach((item: { currency: string; price: number }) => {
      if (item.price && !priceMap.has(item.currency)) {
        priceMap.set(item.currency, item.price);
      }
    });

    return Array.from(priceMap.entries()).map(([currency, price]) => ({
      currency,
      price,
    }));
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return [];
  }
};

export const getTokenIconUrl = (currency: string): string =>
  `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${currency}.svg`;