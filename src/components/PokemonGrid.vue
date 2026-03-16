<script setup lang="ts">
import { computed } from 'vue'

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
  <div class="pokemon-grid">
    <PokemonCard
      v-for="card in cards"
      :key="card.id"
      v-bind="card"
      :size="size"
      :selected="selectable && modelValue.includes(card.id)"
      :disabled="selectable && isDisabled(card)"
      @click="toggle(card)"
    />
  </div>
</template>

<style scoped>
.pokemon-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
