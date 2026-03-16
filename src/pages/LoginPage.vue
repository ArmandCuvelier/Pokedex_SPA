<script setup lang="ts">
import { ref } from 'vue'

import { useAuthStore } from '@/stores/auth.store'

const auth = useAuthStore()

const email = ref<string>('')
const password = ref<string>('')
</script>

<template>
  <div class="form-container">
    <NForm class="form-card">
      <h2 class="title">Connexion</h2>

      <NFormItem label="Email">
        <NInput v-model:value="email" placeholder="red@example.fr" />
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
        class="login-btn"
        type="primary"
        block
        :loading="auth.appelAPI"
        :disabled="auth.appelAPI"
        @click="auth.handleLogin(email, password)"
      >
        Se connecter
      </NButton>

      <p class="signup-text">
        Pas encore de compte ?
        <RouterLink to="/signUp" class="signup-link"> S'inscrire </RouterLink>
      </p>
    </NForm>
  </div>
</template>

<style>
.form-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa, #e4e9f2);
}

.form-card {
  width: 350px;
  padding: 40px;
  border-radius: 12px;
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 25px;
  font-size: 24px;
  font-weight: 600;
}

.login-btn {
  margin-top: 10px;
}

.signup-text {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
}

.signup-link {
  margin-left: 5px;
  color: #18a058;
  font-weight: 500;
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}

.error {
  color: red;
  text-align: center;
  margin-bottom: 10px;
}
</style>
