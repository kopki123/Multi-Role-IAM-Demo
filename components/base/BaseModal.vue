<script setup lang="ts">

withDefaults(defineProps<{
  title?: string
  description?: string
}>(), {
  title: '',
  description: '',
});

const emit = defineEmits<{
  (e: 'close'): void
}>();

function handleClose() {
  emit('close');
}

</script>

<template>
  <UModal
    :close="{ onClick: handleClose }"
    :title="title"
    :description="description"
  >
    <template #body>
      <slot />
    </template>

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UModal>
</template>
