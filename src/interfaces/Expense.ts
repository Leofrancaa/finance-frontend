

export interface AddExpenseData {
    type: string;
    amount: string;
    paymentMethod: string;
    installments?: string | null;
    note?: string;
    fixed?: boolean;
    subcategory?: string;
    creditCardId?: string | null;
    date: string; // <-- novo
}

// Dado que o front-end usa
export interface Expense {
    _id: string;
    type: string;
    amount: number;
    paymentMethod: string;
    installments?: number | null;
    note?: string;
    fixed?: boolean;
    date: string;
    day?: number; // <-- opcional, derivável
    subcategory?: string;
    creditCardId?: string | null;
}


// Dado que vem do backend
export interface ExpenseFromAPI {
    _id: string;
    type: string;
    amount: string;
    day: string;
    paymentMethod: string;
    installments?: string;
    note?: string;
    fixed?: boolean;
    date: string;
    subcategory?: string;
    creditCardId?: string;
}
