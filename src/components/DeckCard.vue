<script setup lang="ts">
import { useRouter } from 'vue-router'

import { useDeckStore } from '@/stores/deck.store'
import type { Deck } from '@/types'

defineProps<{ deck: Deck }>()

const router = useRouter()
const deckStore = useDeckStore()
</script>

<template>
  <div class="deck-card">
    <div class="deck-info">
      <p class="deck-name">{{ deck.name }}</p>
    </div>

    <div class="deck-actions">
      <NButton
        size="small"
        @click="router.push({ name: 'DeckDetail', params: { id: deck.id } })"
      >
        Voir
      </NButton>
      <NButton
        size="small"
        @click="router.push({ name: 'EditDeck', params: { id: deck.id } })"
      >
        Modifier
      </NButton>
      <NButton size="small" type="error" @click="deckStore.removeDeck(deck.id)">
        Supprimer
      </NButton>
    </div>
  </div>
</template>

<style scoped>
.deck-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  border: 1px solid #f0f0f0;
}

.deck-name {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #212121;
}

.deck-actions {
  display: flex;
  gap: 8px;
}
</style>
