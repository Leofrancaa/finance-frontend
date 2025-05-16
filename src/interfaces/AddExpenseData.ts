export interface AddExpenseData {
    type: string;
    day: string; // Vem como string do form
    amount: string; // Também vem como string
    paymentMethod: string;
    installments?: string; // String para poder validar e converter depois
    note?: string;
    fixed?: boolean;
    startDate?: string; // Só é usado em despesas fixas
    creditCardId?: string;

}
