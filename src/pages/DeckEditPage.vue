<script setup lang="ts">
import {
  NButton,
  NFlex,
  NForm,
  NFormItem,
  NInput,
  NSpin,
  NText,
} from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import PokemonGrid from '@/components/PokemonGrid.vue'
import { useApi } from '@/composables/useApi'
import type { Card } from '@/types'

const route = useRoute()
const router = useRouter()
const api = useApi()

const deckName = ref('')
const selectedCardIds = ref<number[]>([])
const cards = ref<Card[]>([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const error = ref<string | null>(null)

const mode = computed<'create' | 'edit'>(() =>
  route.path.includes('edit') ? 'edit' : 'create',
)
const deckId = computed(() =>
  mode.value === 'edit' ? Number(route.params.id) : null,
)
const formTitle = computed(() =>
  mode.value === 'create' ? 'Créer un deck' : 'Modifier le deck',
)

onMounted(async () => {
  try {
    isLoading.value = true
    cards.value = await api.getCards()

    if (mode.value === 'edit' && deckId.value) {
      const deck = await api.getDeck(deckId.value)
      deckName.value = deck.name
      // Extraction des IDs pour remplir le v-model
      selectedCardIds.value = deck.cards.map((dc) => dc.cardId)
    }
  } catch {
    error.value = 'Erreur de chargement'
  } finally {
    isLoading.value = false
  }
})

const handleSubmit = async () => {
  if (selectedCardIds.value.length !== 10 || !deckName.value.trim()) return

  try {
    isSubmitting.value = true
    const payload = {
      name: deckName.value.trim(),
      cards: selectedCardIds.value,
    }

    if (mode.value === 'create') {
      await api.createDeck(payload)
    } else if (deckId.value) {
      await api.updateDeck(deckId.value, payload)
    }
    router.push('/')
  } catch {
    error.value = "Erreur lors de l'enregistrement"
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div style="padding: 24px; max-width: 1100px; margin: 0 auto">
    <NText
      style="
        font-size: 20px;
        font-weight: 600;
        display: block;
        margin-bottom: 24px;
      "
      >{{ formTitle }}</NText
    >

    <NSpin :show="isLoading">
      <NForm label-placement="top" style="max-width: 480px">
        <NFormItem label="Nom du deck">
          <NInput v-model:value="deckName" placeholder="Nom du deck" />
        </NFormItem>
      </NForm>

      <NFlex align="center" gap="12" style="margin-bottom: 16px">
        <NText>Sélection : {{ selectedCardIds.length }}/10</NText>
      </NFlex>

      <PokemonGrid
        v-model="selectedCardIds"
        :cards="cards"
        :selectable="true"
        :max-selected="10"
        size="sm"
      />

      <NFlex gap="12" style="margin-top: 24px">
        <NButton
          type="primary"
          :loading="isSubmitting"
          :disabled="selectedCardIds.length !== 10"
          @click="handleSubmit"
        >
          Enregistrer
        </NButton>
        <NButton @click="router.push('/')">Annuler</NButton>
      </NFlex>
    </NSpin>
  </div>
</template>
