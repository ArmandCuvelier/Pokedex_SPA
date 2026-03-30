<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import PokemonCard from '@/components/PokemonCard.vue'
import { useDeckStore } from '@/stores/deck.store'
import type { Card, Deck } from '@/types'

const props = defineProps<{ deck: Deck; cards: Card[] }>()

const router = useRouter()
const deckStore = useDeckStore()

const deckCards = computed(() =>
  props.deck.cards
    .map((dc) => props.cards.find((c) => c.id === dc.cardId))
    .filter((c): c is Card => c !== undefined),
)
</script>

<template>
  <div class="deck-card">
    <div class="deck-info">
      <p class="deck-name">{{ deck.name }}</p>
    </div>

    <div class="deck-pokemons">
      <PokemonCard
        v-for="pokemon in deckCards"
        :key="pokemon.id"
        v-bind="pokemon"
        size="sm"
      />
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
  flex-direction: column;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
  border: 1px solid #f0f0f0;
}

.deck-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.deck-name {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #212121;
}

.deck-pokemons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.deck-actions {
  display: flex;
  gap: 8px;
}
</style>
