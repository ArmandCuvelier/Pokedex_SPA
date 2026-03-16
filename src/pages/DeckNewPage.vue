<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import PokemonGrid from '@/components/PokemonGrid.vue'
import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import type { Card } from '@/types'

const DECK_SIZE = 10

const router = useRouter()
const { getCards, createDeck } = useApi()

const name = ref<string>('')
const cards = ref<Card[]>([])
const selectedIds = ref<number[]>([])
const loading = ref<boolean>(false)
const submitting = ref<boolean>(false)
const error = ref<string>('')

const selectedCount = computed(() => selectedIds.value.length)
const canSubmit = computed(
  () => name.value.trim() !== '' && selectedCount.value === DECK_SIZE,
)

onMounted(async () => {
  loading.value = true
  try {
    cards.value = await getCards()
  } catch {
    error.value = 'Impossible de charger les cartes'
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  if (!canSubmit.value) return

  submitting.value = true
  error.value = ''

  try {
    await createDeck({ name: name.value.trim(), cards: selectedIds.value })
    router.push(ROUTES.HOME)
  } catch {
    error.value = 'Impossible de créer le deck'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="deck-new-page">
    <h2 class="page-title">Nouveau deck</h2>

    <div class="form-section">
      <NFormItem label="Nom du deck">
        <NInput v-model:value="name" placeholder="Ex: Mon deck feu" />
      </NFormItem>
    </div>

    <div class="counter-row">
      <span class="counter-label">Cartes sélectionnées</span>
      <NTag
        :type="
          selectedCount === DECK_SIZE
            ? 'success'
            : selectedCount > 0
              ? 'warning'
              : 'default'
        "
      >
        {{ selectedCount }} / {{ DECK_SIZE }}
      </NTag>
    </div>

    <div v-if="loading" class="state-center">
      <NSpin />
    </div>

    <div v-else-if="error" class="state-center">
      <NText type="error">{{ error }}</NText>
    </div>

    <PokemonGrid
      v-else
      v-model="selectedIds"
      :cards="cards"
      selectable
      :max-selected="DECK_SIZE"
      size="sm"
    />

    <div class="submit-row">
      <NButton
        type="primary"
        :disabled="!canSubmit"
        :loading="submitting"
        @click="handleSubmit"
      >
        Créer le deck
      </NButton>
    </div>
  </div>
</template>

<style scoped>
.deck-new-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #212121;
}

.form-section {
  max-width: 360px;
}

.counter-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.counter-label {
  font-size: 14px;
  font-weight: 500;
  color: #424242;
}

.state-center {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.submit-row {
  display: flex;
  justify-content: flex-end;
}
</style>
