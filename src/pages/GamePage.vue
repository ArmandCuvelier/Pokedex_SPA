<script setup lang="ts">
import { NButton, NModal, NText } from 'naive-ui'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import ActionBar from '../components/ActionBar.vue'
import PlayerHand from '../components/PlayerHand.vue'
import PlayerZone from '../components/PlayerZone.vue'
import { useAuthStore } from '../stores/auth.store'
import { useJeuStore } from '../stores/jeu.store'

const router = useRouter()
const jeuStore = useJeuStore()
const authStore = useAuthStore()

const lastMessage = ref('')
const showEndModal = computed(() => !!jeuStore.gameResult)

const isWinner = computed(
  () => jeuStore.gameResult?.winner_id === authStore.user?.id,
)

const myBoard = computed(() => jeuStore.maPartie)
const opponentBoard = computed(() => jeuStore.partieAdversaire)

const myActiveCard = computed(() => myBoard.value?.field?.[0] ?? null)
const opponentActiveCard = computed(
  () => opponentBoard.value?.field?.[0] ?? null,
)

const myScore = computed(() => myBoard.value?.score ?? 0)
const opponentScore = computed(() => opponentBoard.value?.score ?? 0)
const myDeckCount = computed(() => myBoard.value?.deckCount ?? 0)

watch(
  () => jeuStore.gameState,
  () => {
    lastMessage.value = jeuStore.isMyTurn
      ? "C'est votre tour !"
      : "L'adversaire joue…"
  },
)

watch(
  () => jeuStore.error,
  (val) => {
    if (val) lastMessage.value = val
  },
)

const handleDraw = () => {
  jeuStore.drawCards()
  lastMessage.value = 'Vous piochez une carte…'
}

const handlePlayCard = (cardId: number) => {
  jeuStore.playCard(cardId)
  lastMessage.value = 'Carte jouée !'
}

const handleAttack = () => {
  const targetId = opponentActiveCard.value?.id
  if (targetId === undefined) return
  jeuStore.attack(targetId)
  lastMessage.value = 'Vous attaquez !'
}

const handleEndTurn = () => {
  jeuStore.endTurn()
  lastMessage.value = 'Fin de tour.'
}

const handleReturnToLobby = () => {
  jeuStore.resetGame()
  router.push('/')
}
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
      background: #fafafa;
    "
  >
    <div style="padding: 12px 20px; flex: 1; overflow: auto">
      <PlayerZone
        label="Adversaire"
        :score="opponentScore"
        :active-card="opponentActiveCard"
        :is-opponent="true"
      />
    </div>

    <ActionBar
      :is-my-turn="jeuStore.isMyTurn"
      :hand="myBoard?.hand ?? []"
      :deck-count="myDeckCount"
      :my-active-card="myActiveCard"
      :opponent-active-card="opponentActiveCard"
      :last-message="lastMessage"
      @draw="handleDraw"
      @attack="handleAttack"
      @end-turn="handleEndTurn"
    />

    <div style="padding: 12px 20px; flex: 1; overflow: auto">
      <PlayerZone
        label="Vous"
        :score="myScore"
        :active-card="myActiveCard"
        :is-opponent="false"
      >
        <PlayerHand
          :hand="myBoard?.hand ?? []"
          :deck-count="myDeckCount"
          :is-my-turn="jeuStore.isMyTurn"
          :has-active-card="!!myActiveCard"
          @play-card="handlePlayCard"
        />
      </PlayerZone>
    </div>

    <NModal :show="showEndModal" :mask-closable="false">
      <div
        style="
          background: #fff;
          border-radius: 12px;
          padding: 40px;
          text-align: center;
          min-width: 300px;
        "
      >
        <div style="font-size: 48px; margin-bottom: 12px">
          {{ isWinner ? 'Win' : 'Lose' }}
        </div>
        <NText
          style="
            font-size: 22px;
            font-weight: 700;
            display: block;
            margin-bottom: 8px;
          "
        >
          {{ isWinner ? 'Victoire !' : 'Défaite…' }}
        </NText>
        <NText style="color: #888; display: block; margin-bottom: 24px">
          {{ jeuStore.gameResult?.reason }}
        </NText>
        <NButton type="primary" size="large" @click="handleReturnToLobby">
          Retour au lobby
        </NButton>
      </div>
    </NModal>
  </div>
</template>
