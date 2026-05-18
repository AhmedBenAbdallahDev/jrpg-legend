import Header from "@/components/Admin/Header"
import { getGameById, getGameCategories } from "@/lib/adminQueries";
import GameForm from "@/app/(admin)/dashboard/game/(form)/form";

export default async function Page({params}) {
  const resolvedParams = await params;
  const gameId = resolvedParams.slug;
  const [gameData, categories] = await Promise.all([
    getGameById(parseInt(gameId)),
    getGameCategories()
  ]);

  return (
    <>
      <Header />

      <div className="container mx-auto mb-8 px-4 min-h-[50rem] pb-8 relative mt-10">
      {/* {JSON.stringify(gameData, null, 2)} */}
        <a href="/dashboard" className="text-sm">&#8592; Back</a>
        <div className="flex justify-between gap-4 mb-4">
          <h1 className="font-display">Update Game</h1>
          <a href={`/game/slug-of-the-game`}
            className="text-sm border border-accent py-2 px-3 rounded-xl"
          >
            View Game &rarr;
          </a>
        </div>

        <GameForm categories={categories} game={gameData} />

      </div>
    
    </>
  )
}