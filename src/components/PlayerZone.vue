<script setup lang="ts">
import { NProgress, NText } from 'naive-ui'
import { computed } from 'vue'

import { useColors } from '@/composables/useColors'
import type { Card } from '@/types'

interface GameCard extends Card {
  currentHp: number
}

interface Props {
  label: string
  score: number
  activeCard: GameCard | null
  isOpponent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpponent: false,
})

const { hpColor } = useColors()

const hpPercent = computed(() => {
  if (!props.activeCard) return 0
  return Math.round((props.activeCard.currentHp / props.activeCard.hp) * 100)
})
</script>

<template>
  <div
    :style="{
      border: '2px solid',
      borderColor: isOpponent ? '#d03050' : '#18a058',
      borderRadius: '12px',
      padding: '16px',
      background: isOpponent ? '#fff0f0' : '#f0fff4',
      flex: 1,
    }"
  >
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      "
    >
      <NText style="font-weight: 700; font-size: 15px">{{ label }}</NText>
      <div style="display: flex; gap: 4px">
        <span v-for="i in 3" :key="i" style="font-size: 18px">{{
          i <= score ? '💀' : '⭕'
        }}</span>
      </div>
    </div>

    <div
      v-if="activeCard"
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      "
    >
      <img
        v-if="activeCard.imgUrl"
        :src="activeCard.imgUrl"
        :alt="activeCard.name"
        style="width: 90px; height: 90px; object-fit: contain"
      />
      <NText style="font-weight: 600">{{ activeCard.name }}</NText>
      <div style="width: 100%">
        <NText style="font-size: 12px; color: #555">
          HP : {{ activeCard.currentHp }} / {{ activeCard.hp }}
        </NText>
        <NProgress
          type="line"
          :percentage="hpPercent"
          :color="hpColor(hpPercent)"
          :show-indicator="false"
          style="margin-top: 4px"
        />
      </div>
    </div>

    <div
      v-else
      style="
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px dashed #ccc;
        border-radius: 8px;
        color: #aaa;
        font-size: 14px;
      "
    >
      Aucune carte active
    </div>

    <slot />
  </div>
</template>
