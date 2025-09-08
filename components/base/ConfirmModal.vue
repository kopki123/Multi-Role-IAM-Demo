<script setup lang="ts">
import type { ButtonProps } from '@nuxt/ui';

withDefaults(defineProps<{
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  confirmColor?: ButtonProps['color']
  isLoading?: boolean
}>(), {
  title: 'Confirm Action',
  message: 'Are you sure you want to perform this action?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmColor: 'secondary',
});

const emit = defineEmits<{
  (e: 'confirm' | 'close'): void
}>();

</script>

<template>
  <BaseModal
    :title="title"
    :description="message"
    @close="emit('close')"
  >
    <div class="flex justify-end gap-2">
      <UButton
        color="neutral"
        variant="outline"
        @click="emit('close')"
      >
        {{ cancelText }}
      </UButton>

      <UButton
        :color="confirmColor"
        :loading="isLoading"
        :disabled="isLoading"
        @click="emit('confirm')"
      >
        {{ confirmText }}
      </UButton>
    </div>
  </BaseModal>
</template>
