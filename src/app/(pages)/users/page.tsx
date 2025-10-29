// UUID: users-list-page-uuid-007
// Users list page with table and actions

import { listUsers, deleteUser } from '@/presentation/actions/user/actions';
import Link from 'next/link';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/presentation/components/ui/table';
import { Button } from '@/presentation/components/ui/button';
import { redirect } from 'next/navigation';

// Force dynamic rendering to prevent build-time Firebase connection attempts
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Server action for deleting a user
 */
async function handleDeleteUser(formData: FormData) {
  'use server';
  const id = formData.get('id') as string;
  await deleteUser({ id });
  redirect('/users');
}

export default async function UsersPage() {
  const result = await listUsers();
  const users: User[] = result.success && result.data ? result.data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Users</h1>
        <Link href="/users/add">
          <Button>Add New User</Button>
        </Link>
      </div>

      {result.success ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Link href={`/users/edit/${user.id}`}>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <form action={handleDeleteUser} className="inline">
                    <input type="hidden" name="id" value={user.id} />
                    <Button variant="destructive" size="sm" type="submit">
                      Delete
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Failed to load users: {result.error}</p>
        </div>
      )}

      {result.success && users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No users found</p>
        </div>
      )}
    </div>
  );
}

