<template>
  <div>
    <Foo :message="message" />
    <input
      v-model="message"
      type="text"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Foo from '../src/vue'

const message = ref('Hello from Vue!')
</script>
