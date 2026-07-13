'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { useSimulationStore } from '@/lib/state-store';
import { Building2, Plus, Edit2, Trash2, RotateCcw, AlertTriangle, ExternalLink } from 'lucide-react';

interface DBCompany {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string;
  website: string;
  industry: string;
  location: string;
  employeeCount: string;
  rating: string;
  createdAt: string;
  deletedAt: string | null;
  _count?: {
    questions: number;
  };
}

export default function CompanyManagement() {
  const { authToken } = useSimulationStore();
  const [companies, setCompanies] = React.useState<DBCompany[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingCompany, setEditingCompany] = React.useState<DBCompany | null>(null);

  // Form Fields
  const [name, setName] = React.useState('');
  const [industry, setIndustry] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [website, setWebsite] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [employeeCount, setEmployeeCount] = React.useState('1,000+');
  const [logoUrl, setLogoUrl] = React.useState('');

  const fetchCompanies = React.useCallback(async () => {
    if (!authToken) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/v1/admin/companies?includeDeleted=true', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
      }
      const data = await res.json();
      setCompanies(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  React.useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;
    try {
      const res = await fetch('/api/v1/admin/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          name,
          industry,
          location: location || 'Global',
          website: website || 'https://domain.com',
          description: description || 'New company profile.',
          employeeCount,
          logoUrl: logoUrl || undefined
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create company');
      }

      resetForm();
      setShowAddForm(false);
      await fetchCompanies();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !editingCompany) return;
    try {
      const res = await fetch('/api/v1/admin/companies', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          companyId: editingCompany.id,
          name,
          industry,
          location,
          website,
          description,
          employeeCount,
          logoUrl
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update company');
      }

      resetForm();
      setEditingCompany(null);
      await fetchCompanies();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSoftDelete = async (companyId: string) => {
    if (!authToken) return;
    if (!confirm('Are you sure you want to soft-delete this company? Newly posted questions will not be able to reference it.')) return;
    try {
      const res = await fetch('/api/v1/admin/companies', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          companyId,
          action: 'soft_delete'
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete company');
      }

      await fetchCompanies();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleRestore = async (companyId: string) => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/v1/admin/companies', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          companyId,
          action: 'restore'
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to restore company');
      }

      await fetchCompanies();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const startEdit = (company: DBCompany) => {
    setEditingCompany(company);
    setShowAddForm(false);
    setName(company.name);
    setIndustry(company.industry);
    setLocation(company.location);
    setWebsite(company.website);
    setDescription(company.description);
    setEmployeeCount(company.employeeCount);
    setLogoUrl(company.logoUrl || '');
  };

  const resetForm = () => {
    setName('');
    setIndustry('');
    setLocation('');
    setWebsite('');
    setDescription('');
    setEmployeeCount('1,000+');
    setLogoUrl('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Company Profiles</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Add, update, or soft-delete company details and industry segments.
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={() => {
            resetForm();
            setEditingCompany(null);
            setShowAddForm(!showAddForm);
          }} 
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Company
        </Button>
      </div>

      <StateWrapper>
        {/* Add/Edit Form Card */}
        {(showAddForm || editingCompany) && (
          <Card className="p-4 border-border bg-card/60 backdrop-blur-sm animate-in slide-in-from-top-4 duration-200">
            <form onSubmit={editingCompany ? handleUpdate : handleCreate} className="space-y-4">
              <h3 className="text-sm font-bold text-foreground">
                {editingCompany ? `Edit Company: ${editingCompany.name}` : 'Add New Company'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-semibold">Company Name</label>
                  <Input 
                    placeholder="e.g. Acme Corp" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-semibold">Industry Sector</label>
                  <Input 
                    placeholder="e.g. Fintech" 
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-semibold">Location / HQ</label>
                  <Input 
                    placeholder="e.g. San Francisco, CA" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-semibold">Website URL</label>
                  <Input 
                    type="url"
                    placeholder="https://example.com" 
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-semibold">Logo URL</label>
                  <Input 
                    placeholder="https://domain/logo.png" 
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground font-semibold">Employee Count</label>
                  <Input 
                    placeholder="e.g. 5,000 - 10,000" 
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs text-muted-foreground font-semibold">Description</label>
                  <textarea 
                    className="w-full text-xs rounded-lg border border-border bg-card p-2 text-foreground h-20 focus:outline-none focus:ring-1 focus:ring-ring"
                    placeholder="Describe company operations..." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-border/40">
                <Button size="xs" variant="ghost" type="button" onClick={() => {
                  setShowAddForm(false);
                  setEditingCompany(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
                <Button size="xs" type="submit">
                  {editingCompany ? 'Save Changes' : 'Create Profile'}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {loading && (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Loading companies...
          </div>
        )}
        {error && (
          <div className="p-4 text-center text-xs text-red-600 bg-red-500/10 rounded-xl border border-red-500/20">
            {error}
          </div>
        )}
        {!loading && !error && (
          <div className="space-y-3">
            {companies.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No companies registered.
              </div>
            ) : (
              companies.map((c) => {
                const isDeleted = c.deletedAt !== null;
                return (
                  <Card key={c.id} className={`p-4 hover:border-violet-500/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isDeleted ? 'opacity-60 bg-red-500/[0.01]' : ''}`}>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={c.logoUrl || 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150'} alt={c.name} className="h-10 w-10 rounded-lg object-cover bg-muted" />
                      <div>
                        <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                          {c.name}
                          {isDeleted && (
                            <Badge variant="destructive" className="text-[8px] py-0 px-1 font-bold">
                              Deleted
                            </Badge>
                          )}
                          <a href={c.website} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </h4>
                        <p className="text-xs text-muted-foreground">{c.industry} • {c.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <span className="text-xs font-semibold bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                        {c._count?.questions ?? 0} Questions
                      </span>
                      
                      <div className="flex gap-1">
                        {!isDeleted ? (
                          <>
                            <Button variant="outline" size="icon-sm" onClick={() => startEdit(c)}>
                              <Edit2 className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="destructive" size="icon-sm" onClick={() => handleSoftDelete(c.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="xs" 
                            onClick={() => handleRestore(c.id)}
                            className="border-blue-500/20 text-blue-600 hover:bg-blue-500/10 flex items-center gap-1"
                          >
                            <RotateCcw className="h-3.5 w-3.5" /> Restore
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </StateWrapper>
    </div>
  );
}
