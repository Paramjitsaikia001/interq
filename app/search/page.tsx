'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { mockQuestions, mockCompanies } from '@/lib/mock-data';
import { Search, HelpCircle, Building2, CheckCircle2, Star } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get('q') || '';
  const [query, setQuery] = React.useState(initialQuery);
  const [activeTab, setActiveTab] = React.useState<'all' | 'questions' | 'companies'>('all');

  const matchedQuestions = mockQuestions.filter((q) => 
    q.title.toLowerCase().includes(query.toLowerCase()) ||
    q.content.toLowerCase().includes(query.toLowerCase()) ||
    q.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
  );

  const matchedCompanies = mockCompanies.filter((c) => 
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.description.toLowerCase().includes(query.toLowerCase()) ||
    c.industry.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6 py-2 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Search Results</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search answers, questions, topics, or companies across interQ.
        </p>
      </div>

      {/* Global Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Type something to search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 h-11 text-base shadow-sm"
        />
      </div>

      {/* Tab selection */}
      <div className="flex border-b border-border">
        {(['all', 'questions', 'companies'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold capitalize border-b-2 -mb-px transition-all ${
              activeTab === tab
                ? 'border-primary text-primary font-bold'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab} (
            {tab === 'all' && matchedQuestions.length + matchedCompanies.length}
            {tab === 'questions' && matchedQuestions.length}
            {tab === 'companies' && matchedCompanies.length}
            )
          </button>
        ))}
      </div>

      <StateWrapper
        emptyTitle="No results match your search"
        emptyDescription="Please try different keywords or browse popular question lists."
      >
        <div className="space-y-6">
          {/* Companies Section */}
          {(activeTab === 'all' || activeTab === 'companies') && matchedCompanies.length > 0 && (
            <div className="space-y-3">
              {activeTab === 'all' && <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Companies</h3>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {matchedCompanies.map((c) => (
                  <Card key={c.id} className="p-4 hover:border-violet-500/20 transition-all flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.logo} alt={c.name} className="h-12 w-12 rounded-lg object-cover bg-muted" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <Link href={`/companies/${c.slug}`} className="font-semibold text-sm hover:text-primary truncate">
                          {c.name}
                        </Link>
                        <span className="text-[10px] text-muted-foreground font-semibold">{c.interviewDifficulty}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{c.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Questions Section */}
          {(activeTab === 'all' || activeTab === 'questions') && matchedQuestions.length > 0 && (
            <div className="space-y-3">
              {activeTab === 'all' && <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Questions</h3>}
              <div className="space-y-4">
                {matchedQuestions.map((q) => (
                  <Card key={q.id} className="hover:border-violet-500/20 transition-all">
                    <CardHeader className="p-5 pb-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold">{q.companyName}</Badge>
                        <Badge 
                          variant={
                            q.difficulty === 'Easy' ? 'success' : 
                            q.difficulty === 'Medium' ? 'warning' : 'destructive'
                          }
                        >
                          {q.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-base font-bold mt-2 hover:text-primary transition-colors">
                        <Link href={`/questions/${q.id}`}>{q.title}</Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-5 pb-4">
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{q.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Fallback empty view when query has matches but tab filtered them out */}
          {((activeTab === 'questions' && matchedQuestions.length === 0) ||
            (activeTab === 'companies' && matchedCompanies.length === 0) ||
            (matchedQuestions.length === 0 && matchedCompanies.length === 0)) && (
            <div className="p-12 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">
              No results found matching your search.
            </div>
          )}
        </div>
      </StateWrapper>
    </div>
  );
}

export default function SearchResults() {
  return (
    <React.Suspense fallback={
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <span className="text-sm text-muted-foreground">Loading search results...</span>
      </div>
    }>
      <SearchContent />
    </React.Suspense>
  );
}
