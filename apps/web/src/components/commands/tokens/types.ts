export interface Tokens {
    address: string; 
    addresses: Record<string, string>;
    createdAt: Date;
    decimals: number; 
    image: string;
    key: string;
    liquidity: number;
    name: string;
    network: string;
    platform: string;
    price: number;
    symbol: string;
    tokens: [];
    updatedAt: Date;
}