'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { useSimulationStore } from '@/lib/state-store';
import { ShieldCheck, UserMinus, ShieldAlert, Check } from 'lucide-react';

interface DBUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
  reputation: number;
  createdAt: string;
  deletedAt: string | null;
}

export default function UserManagement() {
  const { authToken } = useSimulationStore();
  const [users, setUsers] = React.useState<DBUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchUsers = React.useCallback(async () => {
    if (!authToken) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/v1/admin/users?includeBanned=true', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleUserAction = async (userId: string, action: 'toggle_role' | 'ban' | 'unban') => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/v1/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ userId, action })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update user');
      }

      // Refresh list
      await fetchUsers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          User Management
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Promote users, assign admin policies, or disable accounts.
        </p>
      </div>

      <StateWrapper>
        {loading && (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Loading users...
          </div>
        )}
        {error && (
          <div className="p-4 text-center text-xs text-red-600 bg-red-500/10 rounded-xl border border-red-500/20">
            {error}
          </div>
        )}
        {!loading && !error && (
          <Card className="border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold text-xs uppercase tracking-wider">
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Reputation</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-xs text-muted-foreground">
                        No users registered in the database yet.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => {
                      const isBanned = user.deletedAt !== null;
                      return (
                        <tr key={user.id} className={`hover:bg-muted/10 ${isBanned ? 'opacity-60 bg-red-500/[0.02]' : ''}`}>
                          <td className="p-4 flex items-center gap-3">
                            <Avatar fallback={user.name} src={user.avatarUrl || undefined} className="h-8 w-8" />
                            <div>
                              <p className="font-semibold text-foreground text-xs sm:text-sm flex items-center gap-1.5">
                                {user.name}
                                {isBanned && (
                                  <Badge variant="destructive" className="text-[8px] py-0 px-1 font-bold">
                                    Banned
                                  </Badge>
                                )}
                              </p>
                              <p className="text-[10px] text-muted-foreground">{user.email}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'} className="capitalize text-[10px] py-0 px-2 font-bold">
                              {user.role}
                            </Badge>
                          </td>
                          <td className="p-4 font-semibold text-xs">{user.reputation} pts</td>
                          <td className="p-4 text-xs text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
                          </td>
                          <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                            <Button 
                              variant="outline" 
                              size="xs" 
                              onClick={() => handleUserAction(user.id, 'toggle_role')}
                              className="text-xs"
                              disabled={isBanned}
                            >
                              {user.role === 'admin' ? 'Demote' : 'Make Admin'}
                            </Button>
                            {isBanned ? (
                              <Button 
                                variant="outline" 
                                size="xs"
                                onClick={() => handleUserAction(user.id, 'unban')}
                                className="text-xs border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10"
                              >
                                <Check className="h-3 w-3 mr-1" /> Unban
                              </Button>
                            ) : (
                              <Button 
                                variant="destructive" 
                                size="xs"
                                onClick={() => handleUserAction(user.id, 'ban')}
                                className="text-xs"
                              >
                                <UserMinus className="h-3 w-3 mr-1" /> Ban
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </StateWrapper>
    </div>
  );
}
