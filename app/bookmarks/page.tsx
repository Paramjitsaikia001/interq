import type { Metadata } from 'next';
import Bookmarklists from './Bookmarklists';

export const metadata: Metadata = {
  title: 'Bookmarked Questions',
  description: 'View your bookmarked interview questions.',
  alternates: {
    canonical: '/bookmarks',
  },
};

export default function BookmarksPage() {
  return (
    <div className="flex-1 flex flex-col">
      <Bookmarklists />
    </div>
  );
}
