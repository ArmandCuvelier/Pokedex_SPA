<script setup lang="ts">
import { NButton, NFlex, NTag, NText } from 'naive-ui'
import { computed } from 'vue'

import type { GameCard } from '../stores/jeu.store'

interface Props {
  isMyTurn: boolean
  hand: GameCard[]
  deckCount: number
  myActiveCard: GameCard | null
  opponentActiveCard: GameCard | null
  lastMessage: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  draw: []
  attack: []
  'end-turn': []
}>()

const canDraw = computed(
  () => props.isMyTurn && props.hand.length < 5 && props.deckCount > 0,
)

const canAttack = computed(
  () => props.isMyTurn && !!props.myActiveCard && !!props.opponentActiveCard,
)
</script>

<template>
  <div
    style="
      background: #f8f8f8;
      border-top: 1px solid #e0e0e0;
      border-bottom: 1px solid #e0e0e0;
      padding: 12px 24px;
    "
  >
    <NFlex justify="space-between" align="center">
      <NFlex align="center" gap="10">
        <NTag :type="isMyTurn ? 'success' : 'warning'" size="medium">
          {{ isMyTurn ? '✅ Votre tour' : '⏳ Tour adversaire' }}
        </NTag>
        <NText
          v-if="lastMessage"
          style="font-size: 13px; color: #555; font-style: italic"
        >
          {{ lastMessage }}
        </NText>
      </NFlex>

      <NFlex gap="10">
        <NButton :disabled="!canDraw" @click="emit('draw')"> Piocher </NButton>
        <NButton type="warning" :disabled="!canAttack" @click="emit('attack')">
          Attaquer
        </NButton>
        <NButton type="error" :disabled="!isMyTurn" @click="emit('end-turn')">
          Fin de tour
        </NButton>
      </NFlex>
    </NFlex>
  </div>
</template>
