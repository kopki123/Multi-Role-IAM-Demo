<script setup lang="ts">
import { PAGINATION } from '~/utils/constants';
import type { TableColumn } from '@nuxt/ui';
import type { User, Role } from '~/types/user';
import { getRoleColor } from '~/utils/role';
import SearchBar from '~/components/users/SearchBar.vue';
import CreateUserModal from '~/components/users/CreateUserModal.vue';
import EditUserModal from '~/components/users/EditUserModal.vue';
import ConfirmModal from '~/components/base/ConfirmModal.vue';

const UBadge = resolveComponent('UBadge');
const overlay = useOverlay();
const toast = useToast();
const table = useTemplateRef('table');

const createUserModal = overlay.create(CreateUserModal);
const editUserModal = overlay.create(EditUserModal);
const confirmModal = overlay.create(ConfirmModal);

const usersStore = useUsersStore();

const loading = ref(false);

const searchQuery = ref({
  name: '',
  email: '',
});

const columns: TableColumn<User>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const role = row.getValue('role') as Role;
      const color = getRoleColor(role);

      return h(UBadge, { variant: 'subtle', color }, () => role);
    }
  },
  { id: 'action', header: 'Actions' }
];

async function handleFetchUsers() {
  loading.value = true;

  try {
    const response = await usersStore.fetchUsers({ ...searchQuery.value, ...usersStore.pagination });

    loading.value = false;

    if (response?.status === 'error') {
      toast.add({ title: 'Error', description: response.message, color: 'error' });
      throw new Error(response.message);
    }

    if (response.data?.items.length === 0 && usersStore.pagination.pageIndex > 1) {
      usersStore.setPagination(usersStore.pagination.pageIndex - 1);
      return handleFetchUsers();
    }

    return response;
  } catch (error) {
    loading.value = false;
    throw error;
  }
}

async function handleSearch(value: { name: string; email: string }) {
  const previousPageIndex = usersStore.pagination.pageIndex;
  const previousSearchQuery = searchQuery.value;

  usersStore.setPagination();
  searchQuery.value = value;

  try {
    await handleFetchUsers();
  } catch {
    usersStore.setPagination(previousPageIndex);
    searchQuery.value = previousSearchQuery;
  }
}

async function handleReset() {
  usersStore.setPagination();
  searchQuery.value = {
    name: '',
    email: '',
  };

  await handleFetchUsers();
}

async function handlePageChange(newPageIndex: number) {
  const previousPageIndex = usersStore.pagination.pageIndex;

  usersStore.setPagination(newPageIndex);

  try {
    await handleFetchUsers();
  } catch {
    usersStore.setPagination(previousPageIndex);
  }
}

async function openCreateUserModal() {
  createUserModal.open({
    onSubmit: async (user) => {
      const response = await usersStore.createUser(user as Omit<User, 'id'>);

      if (response?.status === 'error') {
        toast.add({ title: 'Error', description: response.message, color: 'error' });
        return;
      }

      usersStore.setPagination();
      toast.add({ title: 'Success', description: response?.message, color: 'success' });
      await handleFetchUsers();

      createUserModal.close();
    }
  });
}

async function openEditUserModal(user: User) {
  editUserModal.open({
    user,
    onSubmit: async (updatedUser) => {
      const response = await usersStore.updateUser(user.id, updatedUser);

      if (response?.status === 'error') {
        toast.add({ title: 'Error', description: response.message, color: 'error' });
        return;
      }

      toast.add({ title: 'Success', description: response?.message, color: 'success' });
      await handleFetchUsers();

      editUserModal.close();
    },
  });
}

async function openDeleteUserModal(user: User) {
  confirmModal.open({
    confirmColor: 'error',
    onConfirm: async () => {
      const response = await usersStore.deleteUser(user.id);

      if (response?.status === 'error') {
        toast.add({ title: 'Error', description: response.message, color: 'error' });
        return;
      }

      toast.add({ title: 'Success', description: response?.message, color: 'success' });
      await handleFetchUsers();

      confirmModal.close();
    }
  });
}

onMounted(() => {
  handleFetchUsers();
});

</script>

<template>
  <div class="max-h-full flex flex-col">
    <h1 class="mb-4 text-2xl font-bold">
      User Management
    </h1>

    <SearchBar
      @search="handleSearch"
      @reset="handleReset"
    />

    <UButton
      icon="i-lucide-plus"
      color="secondary"
      class="self-end my-4"
      @click="openCreateUserModal"
    >
      Add User
    </UButton>

    <UTable
      ref="table"
      v-model:pagination="usersStore.pagination"
      sticky
      :data="usersStore.users"
      :columns="columns"
      :loading="loading"
      loading-animation="swing"
      loading-color="secondary"
      class="flex-1"
    >
      <template #action-cell="{ row }">
        <div class="flex items-center gap-2">
          <UButton
            icon="material-symbols:edit"
            color="neutral"
            variant="ghost"
            @click="openEditUserModal(row.original)"
          />

          <UButton
            icon="material-symbols:delete"
            color="neutral"
            variant="ghost"
            @click="openDeleteUserModal(row.original)"
          />
        </div>
      </template>
    </UTable>

    <div class="flex justify-end mt-8">
      <UPagination
        color="secondary"
        active-color="secondary"
        :default-page="PAGINATION.DEFAULT_PAGE"
        :page="usersStore.pagination.pageIndex"
        :items-per-page="usersStore.pagination.pageSize"
        :total="usersStore.pagination.total"
        @update:page="(page: number) => handlePageChange(page)"
      />
    </div>
  </div>
</template>
