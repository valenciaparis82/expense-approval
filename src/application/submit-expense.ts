import type { ExpenseCategory } from "../domain/expense-category";
import {createExpense} from "../domain/expense";


export type SubmitExpenseInput = {
    employeeId: string; 
    description: string; 
    category: ExpenseCategory; 
    amountInCents: number
}