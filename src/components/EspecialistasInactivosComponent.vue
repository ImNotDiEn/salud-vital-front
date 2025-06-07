<template>
  <div>
    <h2>Especialistas Inactivos</h2>

    <table border="1" cellpadding="8" cellspacing="0" v-if="inactivos.length">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Especialidad</th>
          <th>Registro</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="esp in inactivos" :key="esp.id">
          <td>{{ esp.nombre_completo }}</td>
          <td>{{ esp.especialidad }}</td>
          <td>{{ esp.registro_profesional }}</td>
          <td>
            <button @click="restaurar(esp.id)">Restaurar</button>
            <button @click="eliminarDefinitivamente(esp.id)">Eliminar Definitivamente</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else>No hay especialistas inactivos.</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import type { Especialista } from '../interfaces/Especialista'

export default defineComponent({
  setup() {
    const inactivos = ref<Especialista[]>([])

    const fetchInactivos = async () => {
      const res = await fetch('http://localhost:3333/api/especialistas/inactivos')
      inactivos.value = await res.json()
    }

    const restaurar = async (id: number) => {
      await fetch(`http://localhost:3333/api/especialistas/${id}/restore`, {
        method: 'POST'
      })
      fetchInactivos()
    }

    const eliminarDefinitivamente = async (id: number) => {
      const confirmar = confirm('¿Deseas eliminar permanentemente este especialista?')
      if (!confirmar) return

      await fetch(`http://localhost:3333/api/especialistas/${id}/destroy`, {
        method: 'DELETE'
      })
      fetchInactivos()
    }

    onMounted(fetchInactivos)

    return {
      inactivos,
      restaurar,
      eliminarDefinitivamente
    }
  }
})
</script>
