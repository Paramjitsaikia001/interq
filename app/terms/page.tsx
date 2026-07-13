import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function TermsOfService() {
  return (
    <div className="py-4 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mt-1">Last Updated: July 10, 2026</p>
      </div>

      <Card className="border-border/80 bg-card p-6 md:p-8 space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Acceptance of Terms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By accessing or using the interQ platform, you agree to comply with and be bound by these terms. If you do not agree, you must not use our services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. Content Submission</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You retain ownership of any questions or answers you submit. However, you grant interQ a non-exclusive, worldwide, royalty-free license to host, display, and distribute this content. You agree that you will not post content that violates NDAs (Non-Disclosure Agreements) or confidential intellectual property of third-party companies.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. Conduct Guidelines</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We reserve the right to moderate, flag, or delete any content that is abusive, spammy, or inaccurate. Impersonation of other developers or companies is strictly prohibited.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">4. Liability</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            interQ is provided "as is". We are not responsible for the accuracy of questions, answer scripts, or any outcomes of your job application or interview process.
          </p>
        </section>
      </Card>
    </div>
  );
}
