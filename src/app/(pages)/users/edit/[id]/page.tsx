// UUID: users-edit-page-uuid-009
// Edit user page with form

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, updateUser } from '@/presentation/actions/user/actions';
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditUserPage(props: Props) {
  const [params, setParams] = useState<{ id: string }>({ id: '' });
  const [paramsLoaded, setParamsLoaded] = useState(false);

  useEffect(() => {
    props.params.then((p) => {
      setParams(p);
      setParamsLoaded(true);
    });
  }, [props.params]);
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!paramsLoaded) return;

    const loadUser = async () => {
      try {
        const result = await getUser({ id: params.id });
        
        if (result.success && result.data) {
          setFormData({
            name: result.data.name,
            email: result.data.email
          });
        } else {
          setError('User not found');
        }
      } catch {
        setError('Failed to load user');
      } finally {
        setInitialLoading(false);
      }
    };

    loadUser();
  }, [params.id, paramsLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await updateUser({
        id: params.id,
        ...formData
      });
      
      if (result.success) {
        router.push('/users');
      } else {
        setError(result.error || 'Failed to update user');
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Edit User</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter user name"
        />

        <Input
          label="Email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter email address"
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="flex space-x-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Updating...' : 'Update User'}
          </Button>
          <Link href="/users">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

