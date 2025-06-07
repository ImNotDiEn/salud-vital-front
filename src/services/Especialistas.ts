export interface Especialista {
  id?: number
  nombre_completo: string
  especialidad: string
  registro_profesional: string
  horarios_atencion: Record<string, string>
  activo: boolean
}

const BASE_URL = 'http://localhost:3333/api/especialistas'

async function checkResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || 'Error en la petición')
  }
  return response.json()
}

export async function getEspecialistas(): Promise<Especialista[]> {
  const res = await fetch(BASE_URL)
  return checkResponse(res)
}

export async function createEspecialista(data: Especialista): Promise<Especialista> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return checkResponse(res)
}

export async function updateEspecialista(id: number, data: Especialista): Promise<Especialista> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  return checkResponse(res)
}

export async function deleteEspecialista(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Error eliminando especialista')
}
