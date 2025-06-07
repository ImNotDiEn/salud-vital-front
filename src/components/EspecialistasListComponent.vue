<template>
  <div>
    <h2>Especialistas Activos</h2>

    <label>Ordenar por: </label>
    <select v-model="orden">
      <option value="nombre">Nombre</option>
      <option value="especialidad">Especialidad</option>
    </select>

    <table border="1" cellpadding="8" cellspacing="0">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Especialidad</th>
          <th>Días y horarios</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="especialista in especialistasOrdenados" :key="especialista.id">
          <td>{{ especialista.nombre_completo }}</td>
          <td>{{ especialista.especialidad }}</td>
          <td>
            <div v-for="(horas, dia) in agruparPorDia(especialista.horarios)" :key="dia">
              <strong>{{ dia }}:</strong>
              <span v-for="(rango, i) in horas" :key="i">
                {{ rango.desde }} - {{ rango.hasta }}<span v-if="i < horas.length - 1">, </span>
              </span>
            </div>
          </td>
          <td>
            <button @click="$emit('editar', especialista)">Editar</button>
            <button @click="marcarInactivo(especialista.id)">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref, computed } from 'vue'
import type { Especialista, Horario } from '../interfaces/Especialista'

export default defineComponent({
  emits: ['editar'],
  setup(_, { emit }) {
    const especialistas = ref<Especialista[]>([])
    const orden = ref<'nombre' | 'especialidad'>('nombre')

    const fetchEspecialistas = async () => {
      const res = await fetch('http://localhost:3333/api/especialistas')
      especialistas.value = await res.json()
    }

    onMounted(() => {
      fetchEspecialistas()
    })

    const marcarInactivo = async (id: number) => {
      const confirmar = confirm('¿Estás seguro de eliminar este especialista?')
      if (!confirmar) return

      await fetch(`http://localhost:3333/api/especialistas/${id}`, {
        method: 'DELETE'
      })
      fetchEspecialistas()
    }

    const especialistasOrdenados = computed(() => {
      return [...especialistas.value].sort((a, b) => {
        return orden.value === 'nombre'
          ? a.nombre_completo.localeCompare(b.nombre_completo)
          : a.especialidad.localeCompare(b.especialidad)
      })
    })

    const agruparPorDia = (horarios: Horario[]) => {
      const agrupados: Record<string, Horario[]> = {}
      horarios.forEach(h => {
        if (!agrupados[h.dia]) agrupados[h.dia] = []
        agrupados[h.dia].push(h)
      })
      return agrupados
    }

    return {
      especialistas,
      orden,
      agruparPorDia,
      especialistasOrdenados,
      marcarInactivo
    }
  }
})
</script>
