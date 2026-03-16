<template>
  <div class="container">
    <DeckList />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import DeckList from '@/components/DeckList.vue'

export default defineComponent({
  name: 'HomeView',
  components: {
    DeckList,
  },
})
</script>
