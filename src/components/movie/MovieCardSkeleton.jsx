export default function MovieCardSkeleton({ large = false }) {
  return (
    <div className="animate-pulse">
      <div
        className={`bg-slate-700 rounded-xl mb-3 ${
          large ? "aspect-[9/12]" : "aspect-[2/3]"
        }`}
      />
      <div className="h-4 bg-slate-700 rounded w-3/4 mx-auto" />
    </div>
  );
}
