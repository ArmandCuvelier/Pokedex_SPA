<script setup lang="ts">
import {
  NAlert,
  NButton,
  NCard,
  NFlex,
  NSelect,
  NSpin,
  NTag,
  NText,
} from 'naive-ui'
import { computed, onMounted, onUnmounted, ref } from 'vue'

import { useStorage } from '../composables/useStorage'
import { useAuthStore } from '../stores/auth.store'
import { useDeckStore } from '../stores/deck.store'
import { useLobbyStore } from '../stores/lobby.store'

const authStore = useAuthStore()
const deckStore = useDeckStore()
const lobbyStore = useLobbyStore()
const storage = useStorage()

const selectedDeckId = ref<number | null>(null)

const deckOptions = computed(() =>
  deckStore.decks.map((d) => ({ label: d.name, value: d.id })),
)

onMounted(async () => {
  await deckStore.fetchDecks()
  const token = storage.get<string>('token')
  if (token && authStore.user) {
    lobbyStore.connect(token, authStore.user.id)
  }
})

onUnmounted(() => {
  lobbyStore.disconnect()
})

const handleCreateRoom = () => {
  if (!selectedDeckId.value) return
  lobbyStore.createRoom(selectedDeckId.value)
}

const handleJoinRoom = (roomId: string) => {
  if (!selectedDeckId.value) return
  lobbyStore.joinRoom(roomId, selectedDeckId.value)
}

const clearError = () => {
  lobbyStore.error = null
}
</script>

<template>
  <div style="padding: 24px; max-width: 800px; margin: 0 auto">
    <NText
      style="
        font-size: 22px;
        font-weight: 700;
        display: block;
        margin-bottom: 20px;
      "
    >
      Lobby
    </NText>

    <NAlert
      v-if="lobbyStore.error"
      type="error"
      style="margin-bottom: 16px"
      closable
      @close="clearError"
    >
      {{ lobbyStore.error }}
    </NAlert>

    <NCard style="margin-bottom: 20px">
      <NText style="font-weight: 600; display: block; margin-bottom: 12px">
        Choisir un deck pour jouer
      </NText>
      <NSpin :show="deckStore.loading">
        <NFlex gap="12" align="center">
          <NSelect
            v-model:value="selectedDeckId"
            :options="deckOptions"
            placeholder="Sélectionner un deck"
            style="width: 260px"
          />
          <NButton
            type="primary"
            :disabled="!selectedDeckId || !lobbyStore.isConnected"
            @click="handleCreateRoom"
          >
            Créer une room
          </NButton>
        </NFlex>
      </NSpin>
    </NCard>

    <NCard>
      <NFlex justify="space-between" align="center" style="margin-bottom: 12px">
        <NText style="font-weight: 600">Rooms disponibles</NText>
        <NTag
          :type="lobbyStore.isConnected ? 'success' : 'warning'"
          size="small"
        >
          {{ lobbyStore.isConnected ? 'Connecté' : 'Connexion…' }}
        </NTag>
      </NFlex>

      <div
        v-if="lobbyStore.rooms.length === 0"
        style="color: #888; font-size: 14px; padding: 12px 0"
      >
        Aucune room disponible pour le moment.
      </div>

      <NFlex v-else vertical gap="10">
        <NFlex
          v-for="room in lobbyStore.rooms"
          :key="room.id"
          justify="space-between"
          align="center"
          style="padding: 12px; border: 1px solid #e0e0e0; border-radius: 8px"
        >
          <div>
            <NText style="font-weight: 600">{{ room.hostName }}</NText>
            <NText style="font-size: 12px; color: #888; display: block">
              Deck : {{ room.deckName }}
            </NText>
          </div>
          <NButton
            type="primary"
            size="small"
            :disabled="!selectedDeckId || !lobbyStore.isConnected"
            @click="handleJoinRoom(room.id)"
          >
            Rejoindre
          </NButton>
        </NFlex>
      </NFlex>
    </NCard>

    <NCard
      v-if="lobbyStore.currentRoomId"
      style="margin-top: 16px; text-align: center"
    >
      <NSpin show>
        <NText style="display: block; margin-top: 16px; color: #888">
          En attente d'un adversaire… (Room : {{ lobbyStore.currentRoomId }})
        </NText>
      </NSpin>
    </NCard>
  </div>
</template>
