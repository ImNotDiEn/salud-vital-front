<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>Nombre completo:</label>
      <input v-model="form.nombre_completo" required minlength="3" />
    </div>

    <div>
      <label>Especialidad:</label>
      <input v-model="form.especialidad" required />
    </div>

    <div>
      <label>Registro profesional:</label>
      <input v-model="form.registro_profesional" required />
    </div>

    <div>
      <label>Días y horarios de atención:</label>
      <div v-for="(dia, index) in diasSemana" :key="index" style="margin-bottom: 1rem;">
        <label>
          <input type="checkbox" v-model="diasSeleccionados[dia]" />
          {{ dia }}
        </label>
        <div v-if="diasSeleccionados[dia]">
          <div v-for="(rango, i) in horarios[dia]" :key="i" style="margin-left: 1rem;">
            Desde:
            <input type="time" v-model="rango.desde" />
            Hasta:
            <input type="time" v-model="rango.hasta" />
            <button type="button" @click="removeHorario(dia, i)">Eliminar</button>
          </div>
          <button type="button" @click="addHorario(dia)">+ Añadir horario</button>
        </div>
      </div>
    </div>

    <div v-if="errorTraslapes" style="color: red;">
      Hay traslapes de horarios en los días seleccionados.
    </div>

    <button type="submit">Guardar</button>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import type { Especialista, Horario } from '../interfaces/Especialista'

export default defineComponent({
  emits: ['guardado'],
  setup(_, { emit }) {
    const form = reactive<Especialista>({
      nombre_completo: '',
      especialidad: '',
      registro_profesional: '',
      horarios: [],
      activo: true
    })

    const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const diasSeleccionados = reactive<Record<string, boolean>>({})
    const horarios = reactive<Record<string, Horario[]>>({})
    const errorTraslapes = ref(false)

    diasSemana.forEach(dia => {
      diasSeleccionados[dia] = false
      horarios[dia] = []
    })

    const addHorario = (dia: string) => {
      horarios[dia].push({ dia, desde: '', hasta: '' })
    }

    const removeHorario = (dia: string, index: number) => {
      horarios[dia].splice(index, 1)
    }

    const tieneTraslapes = (): boolean => {
      for (const dia of diasSemana) {
        const rangos = horarios[dia]
          .filter(r => r.desde && r.hasta)
          .sort((a, b) => a.desde.localeCompare(b.desde))

        for (let i = 0; i < rangos.length - 1; i++) {
          if (rangos[i].hasta > rangos[i + 1].desde) {
            return true
          }
        }
      }
      return false
    }

    const handleSubmit = async () => {
      errorTraslapes.value = tieneTraslapes()
      if (errorTraslapes.value) return

      form.horarios = []
      for (const dia of diasSemana) {
        if (diasSeleccionados[dia]) {
          form.horarios.push(...horarios[dia])
        }
      }

      const res = await fetch('http://localhost:3333/api/especialistas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (res.ok) {
        emit('guardado')
        alert('Especialista guardado correctamente')
        // Resetear el formulario
        Object.assign(form, {
          nombre_completo: '',
          especialidad: '',
          registro_profesional: '',
          horarios: [],
          activo: true
        })
        diasSemana.forEach(dia => {
          diasSeleccionados[dia] = false
          horarios[dia] = []
        })
      } else {
        alert('Error al guardar')
      }
    }

    return {
      form,
      diasSemana,
      diasSeleccionados,
      horarios,
      addHorario,
      removeHorario,
      handleSubmit,
      errorTraslapes
    }
  }
})
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 600px;
}
</style>
