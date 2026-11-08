import { test, expect } from "bun:test";
import { approveExpense, createExpense } from "../src/domain/expense";
import { Actor } from "@/domain/actor";

test("rechaza automáticamente un gasto personal de 20 €", () => {
    const result = createExpense(2000, "Entradas de cine", "personal", new Date("2026-09-02"), "069", "326" );    
    expect(result.ok).toBe(true);
    expect(result.expense?.status).toBe("rejected");
    expect(result.expense?.decision?.actor).toBe("system");
});

test("Gasto de 100 € en comidas autorizado automáticamente", () => {
    const result = createExpense(10000, "Comida de equipo", "meals", new Date("2026-09-02"), "069", "326" );
    expect(result.ok).toBe(true);
    expect(result.expense?.status).toBe("approved");
    expect(result.expense?.decision?.actor).toBe("system");
});

test("Gasto de 100.01 € en comidas pendiente de aprobación", () => {
    const result = createExpense(10001, "Comida de equipo", "meals", new Date("2026-09-02"), "069", "326" );
    expect(result.ok).toBe(true);
    expect(result.expense?.status).toBe("pending");
    expect(result.expense?.decision).toBeUndefined();
});

test("Importe incorrecto: 0 €", () => {
    const result = createExpense(0, "Comida de equipo", "meals", new Date("2026-09-02"), "069", "326" );
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("invalid_amount");
}  
); 

test("Descripción incorrecta: solo espacios", () => {
    const result = createExpense(4500, "                       ", "meals", new Date("2026-09-02"), "069", "326" );
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("invalid_description");
}   
);

test ("Importe incorrecto: 1,5 centimos", () => {
    const result = createExpense(1.5, "Comida de equipo", "meals", new Date("2026-09-02"), "069", "326" );
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("invalid_amount");
}    
)

test ("gasto de 600 € en capacitacion pendiente de aprobación por un manager", () => {
    const result = createExpense(60000, "Curso de capacitación", "training", new Date("2026-09-02"), "069", "326" );
    expect(result.ok).toBe(true);
    expect(result.expense?.status).toBe("pending");
    expect(result.expense?.requiredRole).toBe("manager");
}
)

test ("gasto de 1.500 € en material informatico pendiente de aprobación por finanzas", () => {
    const result = createExpense(150000, "Material informático", "equipment", new Date("2026-09-02"), "069", "326" );
    expect(result.ok).toBe(true);
    expect(result.expense?.status).toBe("pending");
    expect(result.expense?.requiredRole).toBe("finance");
}
)

test ("gasto de 1000 € en capacitacion pendiente de aprobación por un manager", () => {
    const result = createExpense(100000, "Curso de capacitación", "training", new Date("2026-09-02"), "069", "326" );
    expect(result.ok).toBe(true);
    expect(result.expense?.status).toBe("pending");
    expect(result.expense?.requiredRole).toBe("manager");
}
)

test ("gasto de 1.001 € en material informatico pendiente de aprobación por finanzas", () => {
    const result = createExpense(100001, "Material informático", "equipment", new Date("2026-09-02"), "069", "326" );
    expect(result.ok).toBe(true);
    expect(result.expense?.status).toBe("pending");
    expect(result.expense?.requiredRole).toBe("finance");
}
)

test ("gasto de 600 € en material informatico pendiente de aprobación por un manager", () => {

    const result = createExpense(60000, "Material informático", "equipment", new Date("2026-09-02"), "069", "326" );
    const actor: Actor = {id: "545", role: "manager"};
    const approvalResult = approveExpense(result.expense!, actor, new Date("2026-09-02"));
    expect(result.ok).toBe(true);
    expect(result.expense?.status).toBe("approved");
    expect(result.expense?.requiredRole).toBe("manager");

}
)

test ("Un empelado no puede aprobar su propio gasto", () => {

    const result = createExpense(60000, "Material informático", "equipment", new Date("2026-09-02"), "069", "326" );
    const actor: Actor = {id: "326", role: "manager"};
    const approvalResult = approveExpense(result.expense!, actor, new Date("2026-09-02"));
    expect(result.ok).toBe(true);
    expect(approvalResult.ok).toBe(false);
    expect(approvalResult.reason).toBe("self_approval_not_allowed");
    expect(result.expense?.status).toBe("pending");
}
)

 