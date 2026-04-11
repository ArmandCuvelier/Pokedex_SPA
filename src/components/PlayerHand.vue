<script setup lang="ts">
import { NText, NTooltip } from 'naive-ui'

import type { GameCard } from '../stores/jeu.store'

interface Props {
  hand: GameCard[]
  deckCount: number
  isMyTurn: boolean
  hasActiveCard: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<(e: 'play-card', cardId: number) => void>()

const canPlay = () => props.isMyTurn && !props.hasActiveCard

const handleClick = (card: GameCard) => {
  if (!canPlay()) return
  emit('play-card', card.id)
}
</script>

<template>
  <div style="margin-top: 16px">
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      "
    >
      <NText style="font-size: 13px; font-weight: 600"
        >Main ({{ hand.length }}/5)</NText
      >
      <NText style="font-size: 12px; color: #888"
        >Deck : {{ deckCount }} carte(s)</NText
      >
    </div>

    <div style="display: flex; gap: 8px; flex-wrap: wrap">
      <NTooltip v-for="card in hand" :key="card.id" trigger="hover">
        <template #trigger>
          <div
            :style="{
              cursor: canPlay() ? 'pointer' : 'not-allowed',
              opacity: canPlay() ? 1 : 0.5,
              border: '2px solid',
              borderColor: canPlay() ? '#18a058' : '#ccc',
              borderRadius: '8px',
              padding: '6px',
              background: '#fff',
              transition: 'transform 0.1s',
              transform: canPlay() ? 'scale(1.03)' : 'none',
              textAlign: 'center',
              width: '70px',
            }"
            @click="handleClick(card)"
          >
            <img
              v-if="card.imgUrl"
              :src="card.imgUrl"
              :alt="card.name"
              style="width: 50px; height: 50px; object-fit: contain"
            />
            <NText style="font-size: 11px; display: block">{{
              card.name
            }}</NText>
          </div>
        </template>
        {{ card.name }} — {{ card.hp }} HP
      </NTooltip>

      <div
        v-if="hand.length === 0"
        style="color: #aaa; font-size: 13px; padding: 8px"
      >
        Main vide
      </div>
    </div>
  </div>
</template>
