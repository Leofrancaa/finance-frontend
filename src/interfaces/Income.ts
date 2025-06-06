export interface Income {
    _id: string; // Agora usamos somente _id
    type: string;
    amount: number;
    date: string;
    note?: string;
    source?: string;
}
