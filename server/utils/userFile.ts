import usersData from '../mock/users.json';
import type { User } from '~/types/user';

let runtimeUsers: { users: User[] } | null = null;

export async function readUsersFile(): Promise<{ users: User[] }> {
  return runtimeUsers || (usersData as { users: User[] });
}

export async function writeUsersFile(users: User[]): Promise<void> {
  runtimeUsers = { users };
}