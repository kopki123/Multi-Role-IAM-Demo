import { promises as fs } from 'fs';
import path from 'path';
import type { User } from '~/types/user';

const filePath = path.resolve('server/mock/users.json');

export async function readUsersFile(): Promise<{ users: User[] }> {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
}

export async function writeUsersFile(users: User[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify({ users }, null, 2), 'utf-8');
}
