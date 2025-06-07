<template>
  <div>
    <h1>Gestión de Especialistas</h1>

    <EspecialistaForm
      v-if="!modoEdicion"
      @guardado="recargarLista"
    />

    <EspecialistaForm
      v-else
      :key="especialistaEditar?.id"
      :editar="especialistaEditar"
      @guardado="terminarEdicion"
    />

    <hr />

    <EspecialistaList
      @editar="editarEspecialista"
      :recargar="recargar"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import EspecialistaForm from '../components/EspecialistaForm.vue'
import EspecialistaList from '../components/EspecialistaList.vue'
import type { Especialista } from '../interfaces/Especialista'

export default defineComponent({
  components: {
    EspecialistaForm,
    EspecialistaList
  },
  setup() {
    const modoEdicion = ref(false)
    const especialistaEditar = ref<Especialista | null>(null)
    const recargar = ref(0)

    const editarEspecialista = (especialista: Especialista) => {
      modoEdicion.value = true
      especialistaEditar.value = { ...especialista }
    }

    const terminarEdicion = () => {
      modoEdicion.value = false
      especialistaEditar.value = null
      recargar.value++
    }

    const recargarLista = () => {
      recargar.value++
    }

    return {
      modoEdicion,
      especialistaEditar,
      editarEspecialista,
      terminarEdicion,
      recargar,
      recargarLista
    }
  }
})
</script>
