import { getGamesByCategory, getCategoryBySlug } from '@/lib/gameQueries';
import CategoryContent from './CategoryContent';

export default async function CategoryPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page) || 1;
  // Load the online games and category from the server
  const { games, totalPages, currentPage } = await getGamesByCategory(resolvedParams.slug, page);
  const category = await getCategoryBySlug(resolvedParams.slug);

  return (
    <CategoryContent 
      slug={resolvedParams.slug}
      initialOnlineGames={games || []}
      totalPages={totalPages || 1}
      currentPage={currentPage || 1}
      initialCategory={category || { 
        title: resolvedParams.slug.replace(/-/g, ' '),
        slug: resolvedParams.slug
      }}
      page={page}
    />
  );
}