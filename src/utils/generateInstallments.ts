import { AddExpenseData, Expense } from "@/interfaces/Expense";

export function generateInstallments(
    data: AddExpenseData,
    selectedYear: number,
    selectedMonth: number
): Expense[] {
    const totalInstallments = data.installments
        ? parseInt(data.installments)
        : 1;

    const baseDate = new Date(selectedYear, selectedMonth, parseInt(data.day));
    const valuePerInstallment = parseFloat(data.amount) / totalInstallments;

    return Array.from({ length: totalInstallments }, (_, i) => {
        const installmentDate = new Date(baseDate);
        installmentDate.setMonth(baseDate.getMonth() + i);

        return {
            _id: `${data.type}-${installmentDate.getTime()}-${i}`, // Generate a unique _id
            type: data.type,
            date: installmentDate.toISOString(),
            day: installmentDate.getDate(), // Extract the day from the date
            amount: parseFloat(valuePerInstallment.toFixed(2)),
            paymentMethod: data.paymentMethod,
            installments: totalInstallments,
            note: data.note,
        };
    });
}
