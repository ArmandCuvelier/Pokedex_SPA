<script setup lang="ts">
import { ref } from 'vue'

import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()

const username = ref('')
const email = ref('')
const password = ref('')
</script>

<template>
  <div class="form-container">
    <NForm class="form-card">
      <h2 class="title">Inscription</h2>

      <NFormItem label="Nom d'utilisateur">
        <NInput v-model:value="username" placeholder="Dupont" />
      </NFormItem>

      <NFormItem label="Email">
        <NInput v-model:value="email" placeholder="jean.dupont@example.fr" />
      </NFormItem>

      <NFormItem label="Mot de passe">
        <NInput
          v-model:value="password"
          type="password"
          placeholder="*******"
        />
      </NFormItem>

      <p v-if="auth.errorMessage" class="error">
        {{ auth.errorMessage }}
      </p>

      <NButton
        class="signup-btn"
        type="primary"
        block
        :loading="auth.appelAPI"
        :disabled="auth.appelAPI"
        @click="auth.handleSignUp(username, email, password)"
      >
        S'inscrire
      </NButton>

      <p class="login-text">
        Déjà un compte ?
        <RouterLink to="/login" class="login-link"> Se connecter </RouterLink>
      </p>
    </NForm>
  </div>
</template>
