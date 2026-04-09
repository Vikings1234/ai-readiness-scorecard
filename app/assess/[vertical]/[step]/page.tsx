export default function AssessPage({
  params,
}: {
  params: { vertical: string; step: string };
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-blue">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-navy">
          Assessment: {params.vertical}
        </h1>
        <p className="mt-2 text-gray-600">
          Step {params.step} of 6
        </p>
        <p className="mt-4 text-sm text-gray-400">
          Questionnaire coming in Day 2
        </p>
      </div>
    </div>
  );
}
