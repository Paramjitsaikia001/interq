import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function PrivacyPolicy() {
  return (
    <div className="py-4 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-1">Last Updated: July 10, 2026</p>
      </div>

      <Card className="border-border/80 bg-card p-6 md:p-8 space-y-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">1. Information We Collect</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We collect information you provide directly to us when creating an account, posting interview questions, contributing answers, or validating question data. This includes your name, email address, profile description, and professional titles.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">2. How We Use Your Information</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your information is used to personalize your dashboard, notify you about replies or upvotes on your answers, maintain safety/integrity checks against spam, and compute community reputation scores.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">3. Information Sharing</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Any questions, answers, and validation actions you share on interQ are visible to the public (excluding guest users for answers if toggled). We do not sell your email or personal information to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-foreground">4. Contact Us</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If you have questions about this privacy policy or wish to request account/data deletion, contact us at privacy@interq.io.
          </p>
        </section>
      </Card>
    </div>
  );
}
