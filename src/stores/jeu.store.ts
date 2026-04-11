import { defineStore } from 'pinia'
import { io, type Socket } from 'socket.io-client'
import { computed, ref } from 'vue'

import type { Card } from '@/types'

export interface GameCard extends Card {
  currentHp: number
}

interface PlayerBoard {
  hand: GameCard[]
  field: GameCard[]
  deckCount: number
  score: number
}

interface GameState {
  joueur1_id: number
  joueur2_id: number
  id_tour_joueur: number
  board_joueur1: PlayerBoard
  board_joueur2: PlayerBoard
}

interface GameResult {
  winner_id: number
  reason: string
}

export const useJeuStore = defineStore('jeu', () => {
  const socket = ref<Socket | null>(null)
  const socketId = ref<string | null>(null)
  const myId = ref<number | null>(null)
  const gameState = ref<GameState | null>(null)
  const gameResult = ref<GameResult | null>(null)
  const error = ref<string | null>(null)

  const isConnected = computed(() => !!socketId.value)

  const isMyTurn = computed(
    () => gameState.value?.id_tour_joueur === myId.value,
  )

  const isHost = computed(() => gameState.value?.joueur1_id === myId.value)

  const maPartie = computed(() =>
    isHost.value
      ? gameState.value?.board_joueur1
      : gameState.value?.board_joueur2,
  )

  const partieAdversaire = computed(() =>
    isHost.value
      ? gameState.value?.board_joueur2
      : gameState.value?.board_joueur1,
  )

  const connect = (token: string): void => {
    if (socket.value?.connected) return

    const s = io(import.meta.env.VITE_SOCKET_URL, { auth: { token } })
    socket.value = s

    s.on('connect', () => {
      socketId.value = s.id ?? null
    })

    s.on('disconnect', () => {
      socketId.value = null
    })

    s.on('gameStateUpdated', (data: GameState) => {
      gameState.value = data
    })

    s.on('gameEnded', (data: GameResult) => {
      gameResult.value = data
    })

    s.on('opponentDisconnected', () => {
      error.value = 'Votre adversaire a quitté la partie'
    })
  }

  const drawCards = () => socket.value?.emit('drawCards')
  const playCard = (cardId: number) =>
    socket.value?.emit('playCard', { cardId })
  const attack = (targetId: number) =>
    socket.value?.emit('attack', { targetId })
  const endTurn = () => socket.value?.emit('endTurn')

  const resetGame = () => {
    gameState.value = null
    gameResult.value = null
    error.value = null
    myId.value = null
  }

  return {
    socketId,
    myId,
    gameState,
    gameResult,
    error,
    isConnected,
    isMyTurn,
    isHost,
    maPartie,
    partieAdversaire,
    connect,
    drawCards,
    playCard,
    attack,
    endTurn,
    resetGame,
  }
})
