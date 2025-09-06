<script setup lang="ts">

const emit = defineEmits<{
  (e: 'search', value: { name: string, email: string }): void
  (e: 'reset'): void
}>();

const form = ref({
  name: '',
  email: '',
});

function handleSearch(event: Event) {
  event.preventDefault();

  emit('search', form.value);
}

function handleReset() {
  form.value = {
    name: '',
    email: '',
  };

  emit('reset');
}

</script>

<template>
  <UForm
    class="
      flex gap-2
      p-4
      border-1 border-secondary-200
      rounded-lg
    "
    :state="form"
    @submit="handleSearch"
  >
    <UFormField name="name">
      <UInput
        v-model="form.name"
        placeholder="Search by name"
        icon="material-symbols:person"
      />
    </UFormField>

    <UFormField name="email">
      <UInput
        v-model="form.email"
        placeholder="Search by email"
        icon="material-symbols:mail"
      />
    </UFormField>

    <UButton
      type="submit"
      icon="material-symbols:search-rounded"
      color="secondary"
    >
      Search
    </UButton>

    <UButton
      color="secondary"
      @click="handleReset"
    >
      Reset
    </UButton>
  </UForm>
</template>
