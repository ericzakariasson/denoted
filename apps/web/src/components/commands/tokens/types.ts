export interface PortalsResponse {
    more: boolean;
    page: number;
    pageItems: number;
    tokens : Token[];
    totalItems: number;
}

export interface Token {
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