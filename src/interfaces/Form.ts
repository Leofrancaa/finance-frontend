export interface ExpenseFormData {
    type: string;
    day: string;
    amount: string;
    paymentMethod: string;
    installments: string;
    note?: string;
    fixed?: boolean;
}

export interface ExpenseFormProps {
    onSubmit: (data: ExpenseFormData) => void;
}
