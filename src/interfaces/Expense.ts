

export interface AddExpenseData {
    type: string;
    day: string;
    amount: string;
    paymentMethod: string;
    installments?: string;
    note?: string;
    fixed?: boolean;
    startDate?: string;
    subcategory?: string;
    creditCardId?: string;

}

// Dado que o front-end usa
export interface Expense {
    _id: string;
    type: string;
    amount: number;
    day: number;
    paymentMethod: string;
    installments?: number;
    note?: string;
    fixed?: boolean;
    date: string;
    subcategory?: string;
    creditCardId?: string;
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
