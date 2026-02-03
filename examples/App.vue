<template>
  <div>
    <h1>{{ message }}</h1>
    <input
      v-model="message"
      type="text"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello from Vue!')
</script>
