export interface RecurringExpense {
    _id: string;
    type: string;
    amount: number;
    note?: string;
    day: number; // dia do mês, ex: 10
    startDate: string; // formato YYYY-MM-DD
    paymentMethod: string;
    fixed?: boolean;
    subcategory?: string;
    creditCardId?: string;
}
