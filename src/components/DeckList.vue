<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import DeckCard from '@/components/DeckCard.vue'
import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import { useDeckStore } from '@/stores/deck.store'
import type { Card } from '@/types'

const router = useRouter()
const deckStore = useDeckStore()
const { getCards } = useApi()

const cards = ref([] as Card[])

onMounted(async () => {
  await Promise.all([
    deckStore.fetchDecks(),
    getCards().then((c) => (cards.value = c)),
  ])
})
</script>

<template>
  <div class="deck-list-wrapper">
    <div class="deck-list-header">
      <h2 class="deck-list-title">Mes decks</h2>
      <NButton type="primary" @click="router.push(ROUTES.DECK_NEW)">
        Nouveau deck
      </NButton>
    </div>

    <div v-if="deckStore.loading" class="deck-list-state">
      <NSpin />
    </div>

    <div v-else-if="deckStore.error" class="deck-list-state">
      <NText type="error">{{ deckStore.error }}</NText>
    </div>

    <div v-else-if="deckStore.decks.length === 0" class="deck-list-state">
      <NText depth="3">Aucun deck pour l'instant.</NText>
    </div>

    <div v-else class="deck-list">
      <DeckCard
        v-for="deck in deckStore.decks"
        :key="deck.id"
        :deck="deck"
        :cards="cards"
      />
    </div>
  </div>
</template>

<style scoped>
.deck-list-wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.deck-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.deck-list-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #212121;
}

.deck-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.deck-list-state {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
</style>
