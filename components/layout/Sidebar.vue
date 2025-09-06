<script setup lang="ts">

const menu = [
  {
    label: 'Dashboard',
    path: '/',
    icon: 'material-symbols:dashboard'
  },
  {
    label: 'User Management',
    path: '/users',
    icon: 'material-symbols:person'
  },
];

const is_expanded = ref(true);

function ToggleMenu() {
  is_expanded.value = !is_expanded.value;
}

</script>

<template>
  <aside
    :class="[
      `
        overflow-hidden
        flex-shrink-0
        flex flex-col
        min-h-screen
        p-4
        border-r border-gray-200
        transition-all duration-200
      `,
      is_expanded ? 'w-64' : 'w-14'
    ]"
  >
    <div
      class="
        relative top-0
        flex justify-end
        mb-2
        transition-all duration-200
      "
    >
      <button
        class="
          transition-transform duration-200
          hover:text-secondary hover:cursor-pointer
        "
        @click="ToggleMenu"
      >
        <Icon
          name="material-symbols:table-rows-narrow"
          size="24"
        />
      </button>
    </div>

    <NuxtLink
      v-for="({ path, label, icon }) in menu"
      :key="path"
      :to="path"
      class="space-y-1 flex items-center h-16 -mx-4 px-4 py-2 transition-colors duration-200"
      :class="{
        'bg-gray-100 border-r-4 border-secondary text-secondary': $route.path === path
      }"
    >
      <Icon
        :name="icon"
        size="24"
        class="flex-shrink-0 mr-4"
      />

      <span
        class="transition-opacity duration-200"
        :class="is_expanded ? 'opacity-100' : 'opacity-0'"
      >
        {{ label }}
      </span>
    </NuxtLink>
  </aside>
</template>