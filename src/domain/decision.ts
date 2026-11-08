import type { Actor } from "./actor";


export type Decision = {
    actor: Actor | "system";
    result: "approved" | "rejected";
    decidedAt: Date;
    reason?: string;
}