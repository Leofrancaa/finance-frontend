export interface Investment {
    _id?: string;
    userId: string;
    type: string;
    name: string;
    amount: number;
    date: string; // ISO
    isCrypto: boolean;
    description?: string;
}
