export default function ResultsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-blue">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-navy">
          Your AI Readiness Report
        </h1>
        <p className="mt-2 text-gray-600">
          Session: {params.id}
        </p>
        <p className="mt-4 text-sm text-gray-400">
          Results page coming in Day 5
        </p>
      </div>
    </div>
  );
}
