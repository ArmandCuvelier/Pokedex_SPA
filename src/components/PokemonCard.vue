<script setup lang="ts">
import { computed } from 'vue'

import { useColors } from '@/composables/useColors'
import type { Card } from '@/types'

interface Props extends Card {
  size?: 'sm' | 'md'
  selected?: boolean
  disabled?: boolean
  currentHp?: number
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  selected: false,
  disabled: false,
  currentHp: undefined,
})

const { getTypeColor, hpColor } = useColors()

const hpPercent = computed(() =>
  props.currentHp !== undefined
    ? Math.round((props.currentHp / props.hp) * 100)
    : undefined,
)

const hpBarColor = computed(() =>
  hpPercent.value !== undefined ? hpColor(hpPercent.value) : undefined,
)
</script>

<template>
  <div class="pokemon-card" :class="[`size-${size}`, { selected, disabled }]">
    <span class="pokemon-id">#{{ pokedexNumber }}</span>

    <div class="pokemon-image-wrapper">
      <img :src="imgUrl" :alt="name" class="pokemon-image" />
    </div>

    <div class="pokemon-info">
      <p class="pokemon-name">{{ name }}</p>

      <span
        class="pokemon-type"
        :style="{ backgroundColor: getTypeColor(type) }"
      >
        {{ type }}
      </span>

      <div class="pokemon-stats">
        <span class="stat"> <span class="stat-icon hp">♥</span> {{ hp }} </span>
        <span class="stat-separator">·</span>
        <span class="stat">
          <span class="stat-icon atk">⚔</span> {{ attack }}
        </span>
      </div>

      <div v-if="hpPercent !== undefined" class="hp-bar-wrapper">
        <div class="hp-bar-labels">
          <span>HP</span>
          <span>{{ currentHp }} / {{ hp }}</span>
        </div>
        <div class="hp-bar-track">
          <div
            class="hp-bar-fill"
            :style="{ width: `${hpPercent}%`, backgroundColor: hpBarColor }"
          />
        </div>
      </div>
    </div>

    <div v-if="selected" class="selected-indicator" />
  </div>
</template>

<style scoped>
.pokemon-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 2px solid transparent;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/* Sizes */
.size-md {
  width: 160px;
  padding: 16px 12px 14px;
}
.size-sm {
  width: 120px;
  padding: 10px 8px 10px;
  border-radius: 12px;
}

/* Hover */
.pokemon-card:not(.disabled):hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

/* Selected */
.pokemon-card.selected {
  border-color: #18a058;
  box-shadow: 0 0 0 3px rgba(24, 160, 88, 0.15);
}

/* Disabled */
.pokemon-card.disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

/* Selected dot */
.selected-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #18a058;
}

.pokemon-id {
  position: absolute;
  top: 10px;
  left: 12px;
  color: #bdbdbd;
  font-weight: 500;
}

.size-md .pokemon-id {
  font-size: 11px;
}
.size-sm .pokemon-id {
  font-size: 10px;
}

.pokemon-image-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.size-md .pokemon-image-wrapper {
  width: 96px;
  height: 96px;
  margin-bottom: 8px;
}
.size-sm .pokemon-image-wrapper {
  width: 64px;
  height: 64px;
  margin-bottom: 6px;
}

.pokemon-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  image-rendering: pixelated;
}

.pokemon-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: 100%;
}

.pokemon-name {
  margin: 0;
  font-weight: 600;
  color: #212121;
  text-align: center;
}

.size-md .pokemon-name {
  font-size: 15px;
}
.size-sm .pokemon-name {
  font-size: 12px;
}

.pokemon-type {
  display: inline-block;
  border-radius: 999px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 0.02em;
}

.size-md .pokemon-type {
  padding: 2px 12px;
  font-size: 12px;
}
.size-sm .pokemon-type {
  padding: 1px 8px;
  font-size: 10px;
}

.pokemon-stats {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #616161;
}

.size-md .pokemon-stats {
  font-size: 12px;
}
.size-sm .pokemon-stats {
  font-size: 10px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 3px;
}

.stat-icon {
  font-size: 11px;
}
.stat-icon.hp {
  color: #e53935;
}
.stat-icon.atk {
  color: #757575;
}

.stat-separator {
  color: #bdbdbd;
}

/* HP bar */
.hp-bar-wrapper {
  width: 100%;
  margin-top: 2px;
}

.hp-bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  color: #9e9e9e;
  margin-bottom: 3px;
}

.hp-bar-track {
  width: 100%;
  height: 5px;
  background: #eeeeee;
  border-radius: 999px;
  overflow: hidden;
}

.hp-bar-fill {
  height: 100%;
  border-radius: 999px;
  transition:
    width 0.4s ease,
    background-color 0.4s ease;
}
</style>
