export interface Horario {
  dia: string
  desde: string
  hasta: string
}

export interface Especialista {
  id?: number
  nombre_completo: string
  especialidad: string
  registro_profesional: string
  horarios: Horario[]
  activo: boolean
}
