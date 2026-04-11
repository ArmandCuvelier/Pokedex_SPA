import { defineStore } from 'pinia'
import { io, type Socket } from 'socket.io-client'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useJeuStore } from '../stores/jeu.store'

interface Room {
  id: string
  hostName: string
  deckName: string
}

export const useLobbyStore = defineStore('lobby', () => {
  const router = useRouter()
  const jeuStore = useJeuStore()

  const socket = ref<Socket | null>(null)
  const rooms = ref<Room[]>([])
  const currentRoomId = ref<string | null>(null)
  const error = ref<string | null>(null)
  const isConnected = ref(false)

  const connect = (token: string, userId: number): void => {
    if (socket.value?.connected) return

    const s = io(import.meta.env.VITE_SOCKET_URL, { auth: { token } })
    socket.value = s
    jeuStore.myId = userId

    s.on('connect', () => {
      isConnected.value = true
      s.emit('getRooms')
    })

    s.on('disconnect', () => {
      isConnected.value = false
    })

    s.on('roomsList', (data: Room[]) => {
      rooms.value = data
    })

    s.on('roomsListUpdated', (data: Room[]) => {
      rooms.value = data
    })

    s.on('roomCreated', (data: { roomId: string }) => {
      currentRoomId.value = data.roomId
    })

    s.on('gameStarted', () => {
      // Transférer le socket au store de jeu
      jeuStore.connect(token)
      router.push('/game')
    })

    s.on('error', (data: { message: string }) => {
      error.value = data.message
    })
  }

  const disconnect = (): void => {
    socket.value?.disconnect()
    socket.value = null
    isConnected.value = false
    rooms.value = []
    currentRoomId.value = null
    error.value = null
  }

  const createRoom = (deckId: number): void => {
    error.value = null
    socket.value?.emit('createRoom', { deckId })
  }

  const joinRoom = (roomId: string, deckId: number): void => {
    error.value = null
    socket.value?.emit('joinRoom', { roomId, deckId })
  }

  return {
    rooms,
    currentRoomId,
    error,
    isConnected,
    connect,
    disconnect,
    createRoom,
    joinRoom,
  }
})
