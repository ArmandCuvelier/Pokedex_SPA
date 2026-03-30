<script setup lang="ts">
import { NInput } from 'naive-ui'
import { computed, ref } from 'vue'

import type { Card } from '@/types'

import PokemonCard from './PokemonCard.vue'

interface Props {
  cards: Card[]
  selectable?: boolean
  maxSelected?: number
  modelValue?: number[]
  size?: 'sm' | 'md'
}

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  maxSelected: undefined,
  modelValue: () => [],
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [ids: number[]]
}>()

const searchQuery = ref<string>('')

const filteredCards = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  if (!query) {
    return props.cards
  }

  return props.cards.filter((card) => {
    const matchesSearch = card.name.toLowerCase().includes(query)
    const isSelected = props.modelValue.includes(card.id)
    return matchesSearch || isSelected
  })
})

const maxReached = computed(
  () =>
    props.maxSelected !== undefined &&
    props.modelValue.length >= props.maxSelected,
)

function toggle(card: Card) {
  if (!props.selectable) return

  const selected = props.modelValue.includes(card.id)

  if (selected) {
    emit(
      'update:modelValue',
      props.modelValue.filter((id) => id !== card.id),
    )
  } else if (!maxReached.value) {
    emit('update:modelValue', [...props.modelValue, card.id])
  }
}

function isDisabled(card: Card) {
  return maxReached.value && !props.modelValue.includes(card.id)
}
</script>

<template>
  <div class="pokemon-grid-wrapper">
    <div class="search-container">
      <NInput
        v-model:value="searchQuery"
        placeholder="Rechercher une carte par nom..."
        clearable
        size="large"
        class="search-input"
      >
        <template #prefix>
          <span style="font-size: 18px"></span>
        </template>
      </NInput>
    </div>

    <div class="pokemon-grid">
      <PokemonCard
        v-for="card in filteredCards"
        :key="card.id"
        v-bind="card"
        :size="size"
        :selected="selectable && modelValue.includes(card.id)"
        :disabled="selectable && isDisabled(card)"
        @click="toggle(card)"
      />
    </div>

    <div v-if="filteredCards.length === 0" class="no-results">
      <p>Aucune carte ne correspond à votre recherche</p>
    </div>
  </div>
</template>

<style scoped>
.pokemon-grid-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-container {
  max-width: 500px;
}

.search-input {
  font-size: 15px;
}

.pokemon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #9e9e9e;
  font-size: 14px;
}

.no-results p {
  margin: 0;
}
</style>
