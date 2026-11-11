const reserva = {
  nombre: "Juan",
  personas: 4,
confirmada: false
}

const reservaGrande = {
  nombre: "Pedro",
  personas: 8,
  confirmada: false
}

type Reserva = {
  nombre: string;
  personas: number;
  confirmada: boolean;
}

function confirmarReserva(reserva: Reserva){
    if (reserva.personas > 0 && reserva.personas <= 6) {
        reserva.confirmada = true;
    }
}
console.log(reservaGrande.confirmada) // false
confirmarReserva(reservaGrande)
console.log(reservaGrande.confirmada) // true
console.log(reservaGrande) // { nombre: 'Juan', personas: 4, confirmada: true }
