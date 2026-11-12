import type { ExpenseCategory } from "../domain/expense-category";

export type SubmitExpenseInput = {
    employeeId: string;
    description: string;
    category: ExpenseCategory;
    amountInCents: number
}