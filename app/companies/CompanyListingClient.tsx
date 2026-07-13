'use client';

import * as React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input, Select } from '@/components/ui/input';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { mockCompanies } from '@/lib/mock-data';
import { Building2, Search, Star, ExternalLink, MapPin } from 'lucide-react';

export default function CompanyListing() {
  const [search, setSearch] = React.useState('');
  const [industry, setIndustry] = React.useState('all');

  const filteredCompanies = mockCompanies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.location.toLowerCase().includes(search.toLowerCase());
    const matchesInd = industry === 'all' || c.industry.toLowerCase().includes(industry.toLowerCase());
    return matchesSearch && matchesInd;
  });

  const industries = Array.from(new Set(mockCompanies.map((c) => c.industry.split(' / ')[0])));

  return (
    <div className="space-y-6 py-2">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Explore Companies</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse interview difficulties, stats, and real questions asked by top-tier employers.
        </p>
      </div>

      {/* Search & Filters */}
      <Card className="p-4 bg-card/60 backdrop-blur-sm border-border/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies by name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div>
            <Select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              options={[
                { label: 'All Industries', value: 'all' },
                ...industries.map(ind => ({ label: ind, value: ind }))
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Companies Grid */}
      <StateWrapper
        emptyTitle="No companies matched your query"
        emptyDescription="Please check your spelling or clear your filters to explore all companies."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCompanies.map((c) => (
            <Card key={c.id} className="hover:border-primary/30 transition-all flex flex-col justify-between rounded-2xl">
              <CardHeader className="p-6 pb-2">
                <div className="flex items-start gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={c.logo} alt={c.name} className="h-14 w-14 rounded-xl object-cover bg-muted border border-border/60" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <Link href={`/companies/${c.slug}`} className="font-bold text-lg text-foreground hover:text-primary transition-colors truncate">
                        {c.name}
                      </Link>
                      <div className="flex items-center text-xs text-amber-500 font-bold gap-0.5 bg-amber-500/5 px-2 py-0.5 rounded-full border border-amber-500/10">
                        <Star className="h-3 w-3 fill-amber-500" />
                        <span>{c.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{c.location}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="px-6 py-2 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {c.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="secondary" className="text-[10px]">{c.industry}</Badge>
                  <Badge variant="outline" className="text-[10px]">{c.employeeCount} employees</Badge>
                </div>
              </CardContent>
              
              <CardFooter className="p-6 pt-3 border-t border-border/30 bg-muted/10 rounded-b-2xl flex items-center justify-between mt-0">
                <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-3 py-1 rounded-md">
                  {c.questionCount} Questions
                </span>
                
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Difficulty:</span>
                  <Badge 
                    variant={
                      c.interviewDifficulty === 'Easy' ? 'success' : 
                      c.interviewDifficulty === 'Medium' ? 'warning' : 'destructive'
                    }
                  >
                    {c.interviewDifficulty}
                  </Badge>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </StateWrapper>
    </div>
  );
}
