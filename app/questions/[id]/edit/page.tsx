'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input, Textarea, Select } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StateWrapper } from '@/components/ui/state-wrapper';
import { mockQuestions, mockCompanies } from '@/lib/mock-data';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

export default function EditQuestion() {
  const params = useParams();
  const router = useRouter();

  const questionId = typeof params?.id === 'string' ? params.id : 'q1';
  const question = mockQuestions.find((q) => q.id === questionId) || mockQuestions[0];

  const [title, setTitle] = React.useState(question.title);
  const [content, setContent] = React.useState(question.content);
  const [role, setRole] = React.useState(question.role);
  const [companyId, setCompanyId] = React.useState(question.companyId);
  const [difficulty, setDifficulty] = React.useState(question.difficulty);
  const [tags, setTags] = React.useState(question.tags.join(', '));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/questions/${question.id}`);
  };

  return (
    <div className="py-4 max-w-2xl mx-auto space-y-6">
      <div>
        <Link href={`/questions/${question.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-2">
          <ArrowLeft className="h-4 w-4" /> Cancel edit
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight">Edit Question</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Update the title, content, or tags for this interview question.
        </p>
      </div>

      <StateWrapper>
        <Card className="border-border bg-card">
          <form onSubmit={handleSave}>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Question Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Target Company</label>
                  <Select
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    options={mockCompanies.map(c => ({ label: c.name, value: c.id }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Job Role Title</label>
                  <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Interview Difficulty</label>
                  <Select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                    options={[
                      { label: 'Easy', value: 'Easy' },
                      { label: 'Medium', value: 'Medium' },
                      { label: 'Hard', value: 'Hard' }
                    ]}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Topics / Tags (comma separated)</label>
                  <Input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Question Content & Context</label>
                <Textarea
                  className="min-h-[140px]"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 mt-2 flex justify-between items-center border-t border-border/40">
              <span className="text-[10px] text-muted-foreground">
                Only questions you authored or admin moderators can edit.
              </span>
              <Button type="submit" className="bg-primary text-primary-foreground font-semibold flex items-center gap-1.5">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </CardFooter>
          </form>
        </Card>
      </StateWrapper>
    </div>
  );
}
