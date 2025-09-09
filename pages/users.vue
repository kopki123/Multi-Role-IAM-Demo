<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui';
import type { User, Role } from '~/types/user';
import UserSearchBar from '~/components/users/UserSearchBar.vue';
import CreateUserModal from '~/components/users/CreateUserModal.vue';
import EditUserModal from '~/components/users/EditUserModal.vue';
import ConfirmModal from '~/components/base/ConfirmModal.vue';
import { getRoleColor } from '~/utils/role';
import { PAGINATION } from '~/utils/constants';

const UBadge = resolveComponent('UBadge');
const overlay = useOverlay();
const table = useTemplateRef('table');

const createUserModal = overlay.create(CreateUserModal);
const editUserModal = overlay.create(EditUserModal);
const deleteUserConfirmModal = overlay.create(ConfirmModal);

const usersStore = useUsersStore();

const isLoading = ref(false);
const searchQuery = ref({
  name: '',
  email: '',
});

const range = computed(() => {
  const { pageIndex, pageSize } = usersStore.pagination;
  const total = usersStore.total;
  const start = (pageIndex - 1) * pageSize + 1;
  const end = Math.min(pageIndex * pageSize, total);

  return { start, end, total };
})

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
    },
  },
  { id: 'action', header: 'Actions' },
];

async function handleFetchUsers() {
  isLoading.value = true;

  try {
    const response = await usersStore.fetchUsers({
      ...searchQuery.value,
      ...usersStore.pagination,
    });

    if (response?.status === 'error') {
      useAppToast().error(response.message);
      throw new Error(response.message);
    }

    if (response.data?.items.length === 0 && usersStore.pagination.pageIndex > 1) {
      usersStore.setPagination(usersStore.pagination.pageIndex - 1);
      return handleFetchUsers();
    }

    return response;
  } catch (error) {
    throw error;
  } finally {
    isLoading.value = false;
  }
}

async function handleSearch(value: { name: string, email: string }) {
  const previousPageIndex = usersStore.pagination.pageIndex;
  const previousSearchQuery = { ...searchQuery.value };

  try {
    usersStore.setPagination();
    searchQuery.value = { ...value };

    await handleFetchUsers();
  } catch (error) {
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
  if (newPageIndex === usersStore.pagination.pageIndex) {
    return;
  }

  const previousPageIndex = usersStore.pagination.pageIndex;

  try {
    usersStore.setPagination(newPageIndex);
    await handleFetchUsers();
  } catch (error) {
    usersStore.setPagination(previousPageIndex);
  }
}

async function openCreateUserModal() {
  createUserModal.open({
    isLoading: isLoading.value,
    onSubmit: async (user) => {
      if (isLoading.value) {
        return;
      }

      try {
        isLoading.value = true;
        createUserModal.patch({ isLoading: isLoading.value });

        const response = await usersStore.createUser(user as Omit<User, 'id'>);

        if (response?.status === 'error') {
          useAppToast().error(response.message);
          return;
        }

        usersStore.setPagination();
        useAppToast().success(response?.message);
        createUserModal.close();

        await handleFetchUsers();
      } finally {
        isLoading.value = false;
        createUserModal.patch({ isLoading: isLoading.value });
      }
    },
  });
}

async function openEditUserModal(user: User) {
  editUserModal.open({
    user,
    isLoading: isLoading.value,
    onSubmit: async (updatedUser) => {
      if (isLoading.value) {
        return;
      }

      try {
        isLoading.value = true;
        editUserModal.patch({ isLoading: isLoading.value });

        const response = await usersStore.updateUser(user.id, updatedUser);

        if (response?.status === 'error') {
          useAppToast().error(response.message);
          return;
        }

        useAppToast().success(response?.message);
        editUserModal.close();

        await handleFetchUsers();
      } finally {
        isLoading.value = false;
        editUserModal.patch({ isLoading: isLoading.value });
      }
    },
  });
}

async function openDeleteUserModal(user: User) {
  deleteUserConfirmModal.open({
    confirmColor: 'error',
    onConfirm: async () => {
      if (isLoading.value) {
        return;
      }

      try {
        isLoading.value = true;
        deleteUserConfirmModal.patch({ isLoading: isLoading.value });

        const response = await usersStore.deleteUser(user.id);

        if (response?.status === 'error') {
          useAppToast().error(response.message);
          return;
        }

        useAppToast().success(response?.message);
        deleteUserConfirmModal.close();

        await handleFetchUsers();
      } finally {
        isLoading.value = false;
        deleteUserConfirmModal.patch({ isLoading: isLoading.value });
      }
    },
  });
}

onMounted(() => {
  handleFetchUsers();
});
</script>

<template>
  <div class="max-h-full flex flex-col space-y-6">
    <h1 class="mb-4 text-2xl font-bold">
      User Management
    </h1>

    <UserSearchBar
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
      :loading="isLoading"
      loading-animation="swing"
      loading-color="secondary"
      class="flex-1"
    >
      <template #action-cell="{ row }">
        <div class="flex items-center gap-2">
          <UButton
            icon="material-symbols:edit"
            color="secondary"
            variant="ghost"
            @click="openEditUserModal(row.original)"
          />

          <UButton
            icon="material-symbols:delete"
            color="error"
            variant="ghost"
            @click="openDeleteUserModal(row.original)"
          />
        </div>
      </template>
    </UTable>

    <div class="flex items-center justify-between mt-8">
      <div class="text-sm text-muted">
        Showing {{ range.start }} to {{ range.end }} of {{ range.total }} results
      </div>

      <UPagination
        color="secondary"
        active-color="secondary"
        :default-page="PAGINATION.DEFAULT_PAGE"
        :page="usersStore.pagination.pageIndex"
        :items-per-page="usersStore.pagination.pageSize"
        :total="usersStore.total"
        @update:page="(page: number) => handlePageChange(page)"
      />
    </div>
  </div>
</template>
