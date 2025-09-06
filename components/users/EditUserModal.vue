<script setup lang="ts">
import type { User } from '~/types/user';
import { updateUserSchema } from '~/schemas/user';
import type { UpdateUser } from '~/schemas/user';
import { ROLE_OPTIONS } from '~/utils/role';

const props = defineProps<{
  user?: User
}>();

const emit = defineEmits<{
  (e: 'close'): void,
  (e: 'submit', data: UpdateUser): void
}>();

const form = reactive<Partial<UpdateUser>>({
  name: props.user?.name,
  email: props.user?.email,
  role: props.user?.role,
});

function onSubmit() {
  emit('submit', form as UpdateUser);
}

</script>

<template>
  <BaseModal
    title="Edit User"
    @close="emit('close')"
  >
    <UForm
      :schema="updateUserSchema"
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
        >
          Submit
        </UButton>
      </div>
    </UForm>
  </BaseModal>
</template>
