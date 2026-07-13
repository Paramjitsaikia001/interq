'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSimulationStore } from '@/lib/state-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ChevronUp,
  MessageSquare,
  Bookmark,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Filter,
  RefreshCw,
  Search,
  BookOpen
} from 'lucide-react';

export default function QuestionsListing() {
  const searchParams = useSearchParams();

  const initialSearch =
    searchParams.get("search") ?? '';
  const router = useRouter();
  const { authToken, currentUser } = useSimulationStore();

  // State
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [companies, setCompanies] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Filters State
  const [search, setSearch] = React.useState(initialSearch);
  const [selectedCompanyId, setSelectedCompanyId] = React.useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState('all');
  const [selectedTag, setSelectedTag] = React.useState('all');
  const [selectedRole, setSelectedRole] = React.useState('all');
  const [selectedExperience, setSelectedExperience] = React.useState('all');
  const [selectedRound, setSelectedRound] = React.useState('all');
  const [selectedYear, setSelectedYear] = React.useState('all');

  // Sort state
  const [sortBy, setSortBy] = React.useState<'recent' | 'popular' | 'validated'>('recent');

  // Pagination state
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  // Accordion open/close state
  const [collapsedSections, setCollapsedSections] = React.useState<{ [key: string]: boolean }>({
    company: false,
    role: false,
    experience: false,
    round: false,
    difficulty: false,
    year: false,
    tags: false,
  });

  // Mobile filters drawer state
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  // Track bookmarked question IDs
  const [bookmarkedIds, setBookmarkedIds] = React.useState<string[]>([]);
  // Track self-voted question IDs
  const [votedIds, setVotedIds] = React.useState<string[]>([]);
  // Track self-asked question IDs
  const [askedIds, setAskedIds] = React.useState<string[]>([]);

  // Toggle Accordion section
  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Keep search state in sync with URL
  React.useEffect(() => {
    setSearch(searchParams.get('search') ?? '');
  }, [searchParams]);

  // Debounced URL update on search change
  React.useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (search.trim()) {
        params.set('search', search);
      } else {
        params.delete('search');
      }

      const next = params.toString();
      router.replace(next ? `/questions?${next}` : '/questions', {
        scroll: false,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [search, router, searchParams]);

  // Fetch Companies on mount
  React.useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch('/api/v1/companies');
        if (res.ok) {
          const data = await res.json();
          setCompanies(data || []);
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
      }
    }
    fetchCompanies();
  }, []);

  // Fetch bookmarks after authentication
  React.useEffect(() => {
    if (!authToken) return;
    async function fetchBookmarks() {
      try {
        const res = await fetch('/api/v1/bookmark', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setBookmarkedIds(
            data.map((bookmark: any) => bookmark.questionId)
          );
        }
      } catch (err) {
        console.error('Error fetching bookmarks:', err);
      }
    }
    fetchBookmarks();
  }, [authToken]);
  // Fetch Questions when filter states change
  const fetchQuestions = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (selectedCompanyId !== 'all') queryParams.append('companyId', selectedCompanyId);
      if (selectedDifficulty !== 'all') queryParams.append('difficulty', selectedDifficulty);
      if (selectedTag !== 'all') queryParams.append('tag', selectedTag);
      queryParams.append('sort', sortBy);
      queryParams.append('page', page.toString());
      queryParams.append('limit', '10');

      const res = await fetch(`/api/v1/questions?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        console.log("questions",data)
        setQuestions(data.data || []);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
        }
      } else {
        setError('Failed to fetch questions. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, selectedCompanyId, selectedDifficulty, selectedTag, sortBy, page]);

  React.useEffect(() => {
    const timer = setTimeout(fetchQuestions, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [fetchQuestions, search]);

  // Reset page when filters change
  React.useEffect(() => {
    setPage(1);
  }, [search, selectedCompanyId, selectedDifficulty, selectedTag, selectedRole, selectedExperience, selectedRound, selectedYear, sortBy]);

  // Extracted lists for custom dropdown filters based on fetched questions
  const availableRoles = React.useMemo(() => {
    const roles = questions.map(q => q.role).filter(Boolean);
    return Array.from(new Set(roles));
  }, [questions]);

  const availableRounds = React.useMemo(() => {
    const rounds = questions.map(q => q.interviewRound || q.round).filter(Boolean);
    return Array.from(new Set(rounds));
  }, [questions]);

  const availableYears = React.useMemo(() => {
    const years = questions.map(q => q.askedYear || q.year).filter(Boolean);
    return Array.from(new Set(years));
  }, [questions]);

  const availableTags = React.useMemo(() => {
    const tags = questions.flatMap(q => q.tags || []);
    return Array.from(new Set(tags));
  }, [questions]);

  // Client-side filtering for attributes not supported by the backend
  const filteredQuestions = React.useMemo(() => {
    return questions.filter(q => {
      // Role Filter
      if (selectedRole !== 'all' && q.role !== selectedRole) return false;
      // Experience Filter
      if (selectedExperience !== 'all' && q.experienceLevel !== selectedExperience) return false;
      // Interview Round Filter
      const round = q.interviewRound || q.round;
      if (selectedRound !== 'all' && round !== selectedRound) return false;
      // Year Filter
      const year = q.askedYear || q.year;
      if (selectedYear !== 'all' && String(year) !== selectedYear) return false;
      return true;
    });
  }, [questions, selectedRole, selectedExperience, selectedRound, selectedYear]);

  // Upvote Question
  const handleQuestionVote = async (qId: string) => {
    if (!authToken) {
      router.push('/auth/login');
      return;
    }
    const targetQ = questions.find(q => q.id === qId);
    if (targetQ && targetQ.userId === currentUser?.id) {
      alert('You cannot upvote your own question.');
      return;
    }

    // Optimistic UI toggle
    const isVoted = votedIds.includes(qId);
    if (isVoted) {
      setVotedIds(prev => prev.filter(id => id !== qId));
    } else {
      setVotedIds(prev => [...prev, qId]);
    }

    try {
      const res = await fetch(`/api/v1/questions/${qId}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setQuestions(prev => prev.map(q => {
          if (q.id === qId) {
            return { ...q, upvotes: data.upvotesCount };
          }
          return q;
        }));
      }
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  // Bookmark Toggle
  const handleBookmarkToggle = async (qId: string) => {
    if (!authToken) {
      router.push('/auth/login');
      return;
    }

    const isBookmarked = bookmarkedIds.includes(qId);
    if (isBookmarked) {
      setBookmarkedIds(prev => prev.filter(id => id !== qId));
    } else {
      setBookmarkedIds(prev => [...prev, qId]);
    }

    try {
      const res = await fetch(`/api/v1/bookmark/${qId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.isBookmarked) {
          setBookmarkedIds(prev => [...prev.filter(id => id !== qId), qId]);
        } else {
          setBookmarkedIds(prev => prev.filter(id => id !== qId));
        }
      }
    } catch (err) {
      console.error('Error toggling bookmark:', err);
    }
  };

  // Toggle "I Was Asked This"
  const handleAskedToggle = async (qId: string) => {
    if (!authToken) {
      router.push('/auth/login');
      return;
    }

    const hasAsked = askedIds.includes(qId);
    if (hasAsked) {
      setAskedIds(prev => prev.filter(id => id !== qId));
      setQuestions(prev => prev.map(q => {
        if (q.id === qId) {
          return { ...q, askedCount: Math.max(0, q.askedCount - 1) };
        }
        return q;
      }));
    } else {
      setAskedIds(prev => [...prev, qId]);
      setQuestions(prev => prev.map(q => {
        if (q.id === qId) {
          return { ...q, askedCount: q.askedCount + 1 };
        }
        return q;
      }));
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearch('');
    setSelectedCompanyId('all');
    setSelectedDifficulty('all');
    setSelectedTag('all');
    setSelectedRole('all');
    setSelectedExperience('all');
    setSelectedRound('all');
    setSelectedYear('all');
  };

  // Format Relative Time Helper
  const formatRelativeTime = (dateString: string) => {
    const diff = Date.now() - new Date(dateString).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'today';
    if (days === 1) return '1d ago';
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w ago`;
  };

  // Helper for rendering Company Pill background/text color dynamically
  const getCompanyColor = (companyName: string) => {
    const name = companyName.toUpperCase();
    if (name.includes('GOOGLE')) return 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300';
    if (name.includes('META')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    if (name.includes('STRIPE')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
    return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full">

      {/* Left Sidebar Filter Section (Desktop only) */}
      <aside className="hidden lg:flex lg:w-64 flex-col gap-4 border-r border-border/40 pr-8">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <h2 className="text-sm font-bold font-mono tracking-wider uppercase text-foreground flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" /> Filters
          </h2>
          <button
            onClick={resetFilters}
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
          >
            <RefreshCw className="h-3 w-3" /> Reset
          </button>
        </div>

        {/* Sidebar Accordion Filters */}
        <div className="space-y-2">

          {/* Company Filter */}
          <div className="border-b border-border/40 py-2">
            <button
              onClick={() => toggleSection('company')}
              className="flex items-center justify-between w-full text-xs font-bold font-mono text-muted-foreground uppercase tracking-wide py-1"
            >
              <span>Company</span>
              {collapsedSections.company ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {!collapsedSections.company && (
              <div className="mt-2 space-y-1.5 pl-1">
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setSelectedCompanyId(e.target.value)}
                  className="w-full text-xs bg-background border border-border rounded-lg p-2 outline-none focus:border-primary transition-colors font-mono"
                >
                  <option value="all">All Companies</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Role Filter */}
          <div className="border-b border-border/40 py-2">
            <button
              onClick={() => toggleSection('role')}
              className="flex items-center justify-between w-full text-xs font-bold font-mono text-muted-foreground uppercase tracking-wide py-1"
            >
              <span>Role</span>
              {collapsedSections.role ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {!collapsedSections.role && (
              <div className="mt-2 space-y-1.5 pl-1">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full text-xs bg-background border border-border rounded-lg p-2 outline-none focus:border-primary transition-colors font-mono"
                >
                  <option value="all">All Roles</option>
                  {availableRoles.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Experience Filter */}
          <div className="border-b border-border/40 py-2">
            <button
              onClick={() => toggleSection('experience')}
              className="flex items-center justify-between w-full text-xs font-bold font-mono text-muted-foreground uppercase tracking-wide py-1"
            >
              <span>Experience</span>
              {collapsedSections.experience ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {!collapsedSections.experience && (
              <div className="mt-2 pl-1">
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full text-xs bg-background border border-border rounded-lg p-2 outline-none focus:border-primary transition-colors font-mono"
                >
                  <option value="all">All Levels</option>
                  <option value="entry">Entry</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            )}
          </div>

          {/* Interview Round Filter */}
          <div className="border-b border-border/40 py-2">
            <button
              onClick={() => toggleSection('round')}
              className="flex items-center justify-between w-full text-xs font-bold font-mono text-muted-foreground uppercase tracking-wide py-1"
            >
              <span>Interview Round</span>
              {collapsedSections.round ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {!collapsedSections.round && (
              <div className="mt-2 pl-1">
                <select
                  value={selectedRound}
                  onChange={(e) => setSelectedRound(e.target.value)}
                  className="w-full text-xs bg-background border border-border rounded-lg p-2 outline-none focus:border-primary transition-colors font-mono"
                >
                  <option value="all">All Rounds</option>
                  {availableRounds.map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Difficulty Filter */}
          <div className="border-b border-border/40 py-2">
            <button
              onClick={() => toggleSection('difficulty')}
              className="flex items-center justify-between w-full text-xs font-bold font-mono text-muted-foreground uppercase tracking-wide py-1"
            >
              <span>Difficulty</span>
              {collapsedSections.difficulty ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {!collapsedSections.difficulty && (
              <div className="mt-2 pl-1">
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full text-xs bg-background border border-border rounded-lg p-2 outline-none focus:border-primary transition-colors font-mono"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            )}
          </div>

          {/* Year Filter */}
          <div className="border-b border-border/40 py-2">
            <button
              onClick={() => toggleSection('year')}
              className="flex items-center justify-between w-full text-xs font-bold font-mono text-muted-foreground uppercase tracking-wide py-1"
            >
              <span>Year</span>
              {collapsedSections.year ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {!collapsedSections.year && (
              <div className="mt-2 pl-1">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full text-xs bg-background border border-border rounded-lg p-2 outline-none focus:border-primary transition-colors font-mono"
                >
                  <option value="all">All Years</option>
                  {availableYears.map(y => (
                    <option key={y} value={String(y)}>{y}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Tags Filter */}
          <div className="py-2">
            <button
              onClick={() => toggleSection('tags')}
              className="flex items-center justify-between w-full text-xs font-bold font-mono text-muted-foreground uppercase tracking-wide py-1"
            >
              <span>Tags</span>
              {collapsedSections.tags ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            {!collapsedSections.tags && (
              <div className="mt-2 pl-1">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full text-xs bg-background border border-border rounded-lg p-2 outline-none focus:border-primary transition-colors font-mono"
                >
                  <option value="all">All Tags</option>
                  {availableTags.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

        </div>
      </aside>

      {/* Mobile Drawer for Filters */}
      {mobileFiltersOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-80 max-w-[90vw] overflow-y-auto bg-background border-r border-border shadow-xl lg:hidden p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Filters</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileFiltersOpen(false)}
              >
                ✕
              </Button>
            </div>
            {/* Mobile copy of sidebar filter controls */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h2 className="text-sm font-bold font-mono tracking-wider uppercase text-foreground flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" /> Filters
                </h2>
                <button
                  onClick={resetFilters}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 font-medium"
                >
                  <RefreshCw className="h-3 w-3" /> Reset
                </button>
              </div>
              <div className="space-y-2">
                {/* Company Filter */}
                <div className="border-b border-border/40 py-2">
                  <button
                    onClick={() => toggleSection('company')}
                    className="flex items-center justify-between w-full text-xs font-bold font-mono text-muted-foreground uppercase tracking-wide py-1"
                  >
                    <span>Company</span>
                    {collapsedSections.company ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                  {!collapsedSections.company && (
                    <div className="mt-2 space-y-1.5 pl-1">
                      <select
                        value={selectedCompanyId}
                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                        className="w-full text-xs bg-background border border-border rounded-lg p-2 outline-none focus:border-primary transition-colors font-mono"
                      >
                        <option value="all">All Companies</option>
                        {companies.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                {/* Role Filter */}
                <div className="border-b border-border/40 py-2">
                  <button
                    onClick={() => toggleSection('role')}
                    className="flex items-center justify-between w-full text-xs font-bold font-mono text-muted-foreground uppercase tracking-wide py-1"
                  >
                    <span>Role</span>
                    {collapsedSections.role ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                  {!collapsedSections.role && (
                    <div className="mt-2 space-y-1.5 pl-1">
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full text-xs bg-background border border-border rounded-lg p-2 outline-none focus:border-primary transition-colors font-mono"
                      >
                        <option value="all">All Roles</option>
                        {availableRoles.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                {/* Experience Filter */}
                <div className="border-b border-border/40 py-2">
                  <button
                    onClick={() => toggleSection('experience')}
                    className="flex items-center justify-between w-full text-xs font-bold font-mono text-muted-foreground uppercase tracking-wide py-1"
                  >
                    <span>Experience</span>
                    {collapsedSections.experience ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                  {!collapsedSections.experience && (
                    <div className="mt-2 pl-1">
                      <select
                        value={selectedExperience}
                        onChange={(e) => setSelectedExperience(e.target.value)}
                        className="w-full text-xs bg-background border border-border rounded-lg p-2 outline-none focus:border-primary transition-colors font-mono"
                      >
                        <option value="all">All Levels</option>
                        <option value="entry">Entry</option>
                        <option value="mid">Mid</option>
                        <option value="senior">Senior</option>
                        <option value="staff">Staff</option>
                      </select>
                    </div>
                  )}
                </div>
                {/* Interview Round Filter */}
                <div className="border-b border-border/40 py-2">
                  <button
                    onClick={() => toggleSection('round')}
                    className="flex items-center justify-between w-full text-xs font-bold font-mono text-muted-foreground uppercase tracking-wide py-1"
                  >
                    <span>Interview Round</span>
                    {collapsedSections.round ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                  {!collapsedSections.round && (
                    <div className="mt-2 pl-1">
                      <select
                        value={selectedRound}
                        onChange={(e) => setSelectedRound(e.target.value)}
                        className="w-full text-xs bg-background border border-border rounded-lg p-2 outline-none focus:border-primary transition-colors font-mono"
                      >
                        <option value="all">All Rounds</option>
                        {availableRounds.map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                {/* Difficulty Filter */}
                <div className="border-b border-border/40 py-2">
                  <button
                    onClick={() => toggleSection('difficulty')}
                    className="flex items-center justify-between w-full text-xs font-bold font-mono text-muted-foreground uppercase tracking-wide py-1"
                  >
                    <span>Difficulty</span>
                    {collapsedSections.difficulty ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                  {!collapsedSections.difficulty && (
                    <div className="mt-2 pl-1">
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full text-xs bg-background border border-border rounded-lg p-2 outline-none focus:border-primary transition-colors font-mono"
                      >
                        <option value="all">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                  )}
                </div>
                {/* Year Filter */}
                <div className="border-b border-border/40 py-2">
                  <button
                    onClick={() => toggleSection('year')}
                    className="flex items-center justify-between w-full text-xs font-bold font-mono text-muted-foreground uppercase tracking-wide py-1"
                  >
                    <span>Year</span>
                    {collapsedSections.year ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                  {!collapsedSections.year && (
                    <div className="mt-2 pl-1">
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full text-xs bg-background border border-border rounded-lg p-2 outline-none focus:border-primary transition-colors font-mono"
                      >
                        <option value="all">All Years</option>
                        {availableYears.map(y => (
                          <option key={y} value={String(y)}>{y}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                {/* Tags Filter */}
                <div className="py-2">
                  <button
                    onClick={() => toggleSection('tags')}
                    className="flex items-center justify-between w-full text-xs font-bold font-mono text-muted-foreground uppercase tracking-wide py-1"
                  >
                    <span>Tags</span>
                    {collapsedSections.tags ? <ChevronRight className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                  {!collapsedSections.tags && (
                    <div className="mt-2 pl-1">
                      <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="w-full text-xs bg-background border border-border rounded-lg p-2 outline-none focus:border-primary transition-colors font-mono"
                      >
                        <option value="all">All Tags</option>
                        {availableTags.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content Area */}
      <main className="flex-1 space-y-6">

        {/* Header and Sort Controls Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-heading">
              Interview Questions
            </h1>
          </div>

          {/* Stitch Style Sort Group */}
          <div className="border border-border rounded-xl p-1 bg-background flex items-center text-xs font-mono font-bold select-none shadow-sm">
            <button
              onClick={() => setSortBy('recent')}
              className={`px-3 py-1.5 rounded-lg transition-all ${sortBy === 'recent'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1.5 rounded-lg transition-all ${sortBy === 'popular'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Trending
            </button>
            <button
              onClick={() => setSortBy('validated')}
              className={`px-3 py-1.5 rounded-lg transition-all ${sortBy === 'validated'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              Most Asked
            </button>
          </div>
        </div>

        {/* Mobile Filters Button */}
        <div className="lg:hidden flex justify-end">
          <Button
            variant="outline"
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Search Input for Mobile/Tablet or Main Listing */}
        <div className="relative w-full block lg:hidden">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-center text-sm font-medium">
            {error}
          </div>
        )}

        {/* Questions Cards List */}
        <div className="space-y-4">
          {loading ? (
            // Loading Skeleton States
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse flex items-start gap-4 border border-border bg-card rounded-2xl p-6">
                <div className="w-10 h-14 bg-muted rounded-lg" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-muted rounded w-1/4" />
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                  <div className="h-6 bg-muted rounded w-1/3 mt-2" />
                </div>
              </div>
            ))
          ) : filteredQuestions.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl bg-card/40">
              <BookOpen className="h-10 w-10 text-muted-foreground/60 mb-3" />
              <h3 className="text-base font-bold text-foreground">No questions found</h3>
              <p className="text-xs mt-1">Try resetting the filters or tweaking your search query.</p>
              <Button size="sm" onClick={resetFilters} className="mt-4">
                Reset All Filters
              </Button>
            </div>
          ) : (
            // Question Cards
            filteredQuestions.map((q) => {
              const isBookmarked = bookmarkedIds.includes(q.id);
              const isVoted = votedIds.includes(q.id);
              const hasAsked = askedIds.includes(q.id);

              return (
                <div
                  key={q.id}
                  className="flex items-start gap-4 border border-border bg-card rounded-2xl p-6 hover:border-primary/50 hover:shadow-sm transition-all relative group"
                >
                  {/* Left Column: Vote Counter */}
                  <div className="flex flex-col items-center justify-start pt-1 min-w-[2.5rem] text-center">
                    <button
                      onClick={() => handleQuestionVote(q.id)}
                      className={`p-1.5 rounded-lg transition-colors hover:bg-primary/10 ${isVoted ? 'text-primary' : 'text-muted-foreground'}`}
                      aria-label="Upvote question"
                    >
                      <ChevronUp className="h-5 w-5" />
                    </button>
                    <span className="text-sm font-black text-foreground mt-0.5">{q.upvotes}</span>
                  </div>

                  {/* Right Column: Card Content */}
                  <div className="flex-1 space-y-3">

                    {/* Header: Company, Role, Relative Time, Bookmark */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] tracking-wide font-black font-mono uppercase ${getCompanyColor(q.company?.name || '')}`}>
                          {q.company?.name || 'Company'}
                        </span>
                        <span className="font-semibold text-foreground/80 font-sans">{q.role}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(q.createdAt)}</span>
                      </div>

                      {/* Bookmark Toggle */}
                      <button
                        onClick={() => handleBookmarkToggle(q.id)}
                        className={`text-muted-foreground hover:text-primary transition-colors focus:outline-none p-1 rounded-md ${isBookmarked ? 'text-primary' : ''}`}
                        aria-label="Bookmark question"
                      >
                        <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
                      </button>
                    </div>

                    {/* Question Title & Content Preview */}
                    <div className="space-y-1">
                      <h2 className="text-lg font-bold text-foreground leading-snug hover:text-primary transition-colors font-heading font-sans">
                        <Link href={`/questions/${q.id}`}>
                          {q.title}
                        </Link>
                      </h2>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {q.content}
                      </p>
                    </div>

                    {/* Footer stats: Answer count, Asked count, and Users Stack */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/40 text-xs">

                      {/* Stats & validations */}
                      <div className="flex items-center gap-4 text-muted-foreground font-mono font-bold">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" /> {q.answersCount} answers
                        </span>
                        <button
                          onClick={() => handleAskedToggle(q.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-full border transition-all ${hasAsked
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                              : 'border-border hover:bg-muted text-muted-foreground'
                            }`}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          "I was asked this" ({q.askedCount})
                        </button>
                      </div>

                      {/* Overlapping User Avatars list (mock stack from Stitch) */}
                      <div className="flex items-center -space-x-1.5 select-none">
                        <div className="h-5 w-5 rounded-full border border-card bg-indigo-500 text-white flex items-center justify-center text-[7px] font-bold">A</div>
                        <div className="h-5 w-5 rounded-full border border-card bg-emerald-500 text-white flex items-center justify-center text-[7px] font-bold">B</div>
                        <div className="h-5 w-5 rounded-full border border-card bg-amber-500 text-white flex items-center justify-center text-[7px] font-bold">C</div>
                        <div className="h-5 w-5 rounded-full border border-card bg-slate-800 text-[8px] text-white flex items-center justify-center text-[7px] font-bold px-1 min-w-[20px] font-mono">
                          +{q.askedCount > 3 ? q.askedCount - 3 : 12}
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Stitch-style Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors"
              aria-label="Previous page"
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isCurrent = pageNum === page;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`h-8 w-8 flex items-center justify-center rounded-lg text-xs font-mono font-bold transition-all ${isCurrent
                      ? 'bg-primary text-white shadow-sm'
                      : 'border border-border hover:bg-muted text-muted-foreground'
                    }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-8 w-8 flex items-center justify-center rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors"
              aria-label="Next page"
            >
              &gt;
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
