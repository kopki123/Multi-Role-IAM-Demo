<script setup lang="ts">
import Sidebar from '~/components/layout/Sidebar.vue';

</script>

<template>
  <div
    class="
      flex
      w-screen h-screen
    "
  >
    <Sidebar />

    <div class="flex-1 p-8 bg-gray-50">
      <slot />
    </div>
  </div>
</template>




