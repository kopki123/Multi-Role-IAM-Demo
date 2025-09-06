<script setup lang="ts">
import { createUserSchema } from '~/schemas/user';
import type { CreateUser } from '~/schemas/user';
import { ROLE_OPTIONS } from '~/utils/role';

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'submit', data: CreateUser): void
}>();

const form = reactive<Partial<CreateUser>>({
  name: undefined,
  email: undefined,
  role: undefined,
});

function onSubmit() {
  emit('submit', form as Required<CreateUser>);
}

</script>

<template>
  <BaseModal
    title="Add New User"
    @close="emit('close')"
  >
    <UForm
      :schema="createUserSchema"
      :state="form"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField required label="Name" name="name">
        <UInput v-model="form.name" class="w-full" />
      </UFormField>

      <UFormField required label="Email" name="email">
        <UInput v-model="form.email" class="w-full" />
      </UFormField>

      <UFormField required label="Role" name="role">
        <USelect v-model="form.role" :items="ROLE_OPTIONS" class="w-full" />
      </UFormField>

      <div class="flex justify-end">
        <UButton
          type="submit"
          color="secondary"
          class="text-end"
        >
          Submit
        </UButton>
      </div>
    </UForm>
  </BaseModal>
</template>
