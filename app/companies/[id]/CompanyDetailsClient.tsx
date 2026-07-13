'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { mockCompanies, mockQuestions } from '@/lib/mock-data';
import { ArrowLeft, MapPin, Globe, Users, Star, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export default function CompanyDetails() {
  const params = useParams();
  
  // Find company matching slug/id, fallback to first
  const companySlug = typeof params?.id === 'string' ? params.id : 'google';
  const company = mockCompanies.find((c) => c.slug === companySlug || c.id === companySlug) || mockCompanies[0];
  const companyQuestions = mockQuestions.filter((q) => q.companyId === company.id);

  return (
    <div className="space-y-6 py-2">
      {/* Back button */}
      <div>
        <Link href="/companies" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to companies
        </Link>
      </div>

      <StateWrapper
        emptyTitle="Company Profile Not Found"
        emptyDescription="We could not find the profile you were looking for."
      >
        {/* Company Header Block */}
        <div className="border border-border bg-card rounded-xl p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-start md:items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={company.logo} alt={company.name} className="h-20 w-20 rounded-xl object-cover bg-muted border border-border" />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">{company.name}</h1>
                  <Badge 
                    variant={
                      company.interviewDifficulty === 'Easy' ? 'success' : 
                      company.interviewDifficulty === 'Medium' ? 'warning' : 'destructive'
                    }
                  >
                    {company.interviewDifficulty} Interview
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {company.location}</span>
                  <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {company.employeeCount}</span>
                  <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> {company.industry}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto border-t md:border-t-0 border-border/40 pt-4 md:pt-0">
              <div className="text-center bg-muted/30 border border-border/60 p-3 rounded-xl flex-1 md:flex-none min-w-[90px]">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">Rating</p>
                <div className="flex items-center justify-center text-amber-500 font-bold text-lg mt-0.5 gap-0.5">
                  <Star className="h-4 w-4 fill-amber-500" />
                  <span>{company.rating}</span>
                </div>
              </div>
              <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none">
                <Button variant="outline" className="w-full">
                  Visit Website <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border/40 space-y-2">
            <h3 className="text-sm font-semibold text-foreground">About {company.name}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-4xl">{company.description}</p>
          </div>
        </div>

        {/* Company Interview Questions List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Interview Questions ({companyQuestions.length})</h2>
          
          <div className="space-y-4">
            {companyQuestions.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                No questions have been posted for {company.name} yet.
              </div>
            ) : (
              companyQuestions.map((q) => (
                <Card key={q.id} className="hover:border-primary/30 transition-all rounded-2xl">
                  <CardHeader className="p-5 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{q.role}</span>
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
                  <CardContent className="px-5 pb-3">
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{q.content}</p>
                  </CardContent>
                  <CardFooter className="px-5 py-3 border-t border-border/30 bg-muted/10 flex items-center justify-between mt-0 rounded-b-xl">
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">
                        <CheckCircle2 className="h-3 w-3" /> {q.askedCount} asked
                      </span>
                      <span>{q.answersCount} answers</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground">{new Date(q.createdAt).toLocaleDateString()}</span>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </div>
      </StateWrapper>
    </div>
  );
}
