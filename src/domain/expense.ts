import type { ExpenseCategory } from "./expense-category";
import type { ExpenseStatus } from "./expense-status";
import type { Decision } from "./decision";
import { ApprovalRole } from "./approval-role";

export type Expense = {
    id: string;
    employeeId: string;
    description: string;
    category: ExpenseCategory;
    amountInCents: number;
    submittedAt: Date;
    status: ExpenseStatus;
    decision?: Decision;
    requiredRole?: ApprovalRole;
}

export function createExpense( amountInCents: number,description: string, category: ExpenseCategory, submittedAt: Date, id: string, employeeId: string) {
    if (amountInCents <= 0 || !Number.isInteger(amountInCents) ) {
  return {ok: false, reason: "invalid_amount"}
    }
    if (description.trim() === "") {
  return {ok: false, reason: "invalid_description"}
    }
    if (category === "personal"){
       const decision: Decision = { actor: "system", result: "rejected", decidedAt: submittedAt};
        const expense: Expense = { id, employeeId, description, category, amountInCents, submittedAt, status: "rejected", decision };
        return {ok: true, expense};
    }
    if (amountInCents <= 10000) {
        const decision: Decision = { actor: "system", result: "approved", decidedAt: submittedAt};
        const expense: Expense = { id, employeeId, description, category, amountInCents, submittedAt, status: "approved", decision };
        return {ok: true, expense};
    }
    if (amountInCents <= 100000) {
      const expense: Expense = { id, employeeId, description, category, amountInCents, submittedAt, status: "pending", requiredRole: "manager" };
      return {ok: true, expense}; 
    }

   
      const expense: Expense = { id, employeeId, description, category, amountInCents, submittedAt, status: "pending", requiredRole: "finance" };
      return {ok: true, expense}; 
    

}

export function approveExpense(expense: Expense, actor: {id: string, role: ApprovalRole}, decidedAt: Date) {
   
    if (expense.employeeId === actor.id) {
    return {ok: false, reason: "self_approval_not_allowed"};
    }
  
    if (actor.role !== expense.requiredRole) {
    return {ok: false, reason: "insufficient_role"};
    }

    if (expense.status !== "pending") {
    return {ok: false, reason: "invalid_status"};
    } 

    expense.status = "approved";

    expense.decision = {
        actor: {id: actor.id, role: actor.role},
        result: "approved",
        decidedAt
    };
    return {ok: true, expense};


}

export function rejectExpense(expense: Expense, actor: {id: string, role: ApprovalRole}, decidedAt: Date, reason: string) {
    if (reason.trim() === "") {
        return {ok: false, reason: "invalid_reason"};
    }
     if (expense.employeeId === actor.id) {
    return {ok: false, reason: "self_rejection_not_allowed"};
    }

    if (actor.role !== expense.requiredRole) {
    return {ok: false, reason: "insufficient_role"};
    }

     if (expense.status !== "pending") {
    return {ok: false, reason: "invalid_status"};
    }

    expense.status = "rejected";

    expense.decision = {
        actor: {id: actor.id, role: actor.role},
        result: "rejected",
        decidedAt,
        reason: reason.trim()
    };
    return {ok: true, expense};
  }


 