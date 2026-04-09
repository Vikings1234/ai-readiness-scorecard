'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getDimensions, calculateDimensionScore, DIMENSION_NAMES } from '@/lib/questions';
import type { Vertical } from '@/types/scorecard';
import type { Question } from '@/lib/questions';

const VALID_VERTICALS = ['dental', 'mortgage', 'healthcare_saas', 'fintech', 'b2c'];

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue h-2.5 rounded-full transition-all duration-300"
        style={{ width: `${(current / total) * 100}%` }}
      />
    </div>
  );
}

function RadioQuestionComponent({
  question,
  selectedIndex,
  onSelect,
}: {
  question: Question;
  selectedIndex: number | undefined;
  onSelect: (questionId: string, optionIndex: number) => void;
}) {
  return (
    <div className="mb-8">
      <p className="text-base font-medium text-navy mb-4">{question.text}</p>
      <div className="space-y-2">
        {question.options.map((option, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={idx}
              onClick={() => onSelect(question.id, idx)}
              className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all min-h-[44px] ${
                isSelected
                  ? 'border-blue bg-blue/10 text-navy font-medium'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-blue/40 hover:bg-blue/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    isSelected ? 'border-blue bg-blue' : 'border-gray-300'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
                <span className="text-sm sm:text-base">{option.label}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function AssessPage({
  params,
}: {
  params: { vertical: string; step: string };
}) {
  const router = useRouter();
  const vertical = params.vertical as Vertical;
  const step = parseInt(params.step, 10);

  const isValidVertical = VALID_VERTICALS.includes(vertical);
  const isValidStep = step >= 1 && step <= 6;

  // answers: { questionId: optionIndex }
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const dimensions = isValidVertical ? getDimensions(vertical) : [];
  const currentDimension = isValidStep ? dimensions[step - 1] : null;

  // Load session and any saved answers from localStorage
  useEffect(() => {
    if (!isValidVertical || !isValidStep) return;

    const storedSession = localStorage.getItem('scorecard_session_id');
    const storedVertical = localStorage.getItem('scorecard_vertical');

    if (step === 1 && storedVertical !== vertical) {
      // New assessment — create session
      fetch('/api/start-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vertical }),
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem('scorecard_session_id', data.session_id);
          localStorage.setItem('scorecard_vertical', vertical);
          // Clear any old dimension answers
          for (let i = 1; i <= 6; i++) {
            localStorage.removeItem(`scorecard_dim${i}_answers`);
          }
          setSessionId(data.session_id);
          setInitialized(true);
        });
    } else {
      setSessionId(storedSession);
      setInitialized(true);
    }

    // Restore saved answers for this dimension
    const savedAnswers = localStorage.getItem(`scorecard_dim${step}_answers`);
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers));
    } else {
      setAnswers({});
    }
  }, [step, vertical, isValidVertical, isValidStep]);

  const handleSelect = useCallback((questionId: string, optionIndex: number) => {
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: optionIndex };
      localStorage.setItem(`scorecard_dim${step}_answers`, JSON.stringify(next));
      return next;
    });
  }, [step]);

  if (!isValidVertical || !isValidStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-blue">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy">Invalid Assessment</h1>
          <p className="mt-2 text-gray-600">Please start from the home page.</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 bg-navy text-white rounded-lg hover:bg-blue transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const questions = currentDimension?.questions ?? [];
  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleNext = async () => {
    if (!allAnswered || !sessionId || !currentDimension) return;
    setSaving(true);

    // Calculate score: convert option indices to scores
    const scoreAnswers: Record<string, number> = {};
    for (const q of questions) {
      const optionIndex = answers[q.id];
      if (optionIndex !== undefined) {
        scoreAnswers[q.id] = q.options[optionIndex].score;
      }
    }
    const dimScore = calculateDimensionScore(questions, scoreAnswers);

    // Build response data for storage
    const responseData = questions.map((q) => ({
      question_id: q.id,
      question_text: q.text,
      selected_option: q.options[answers[q.id]]?.label,
      score: q.options[answers[q.id]]?.score ?? 0,
    }));

    try {
      await fetch('/api/save-dimension', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          dimension: step,
          responses: responseData,
          score: dimScore,
        }),
      });

      if (step < 6) {
        router.push(`/assess/${vertical}/${step + 1}`);
      } else {
        // Assessment complete — go to results
        router.push(`/results/${sessionId}`);
      }
    } catch {
      // Allow retry
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      router.push(`/assess/${vertical}/${step - 1}`);
    } else {
      router.push('/');
    }
  };

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light-blue">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy mx-auto" />
          <p className="mt-4 text-gray-600">Setting up your assessment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-blue">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue">
              Step {step} of 6
            </span>
            <span className="text-sm text-gray-500">
              {DIMENSION_NAMES[step - 1]}
            </span>
          </div>
          <ProgressBar current={step} total={6} />
        </div>
      </div>

      {/* Questions */}
      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-navy mb-2">
          {DIMENSION_NAMES[step - 1]}
        </h1>
        <p className="text-gray-500 mb-8 text-sm">
          Answer each question below. Select &ldquo;Not sure&rdquo; if a question doesn&rsquo;t apply.
        </p>

        {questions.map((q) => (
          <RadioQuestionComponent
            key={q.id}
            question={q}
            selectedIndex={answers[q.id]}
            onSelect={handleSelect}
          />
        ))}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 pb-8">
          <button
            onClick={handleBack}
            className="px-6 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors min-h-[44px]"
          >
            {step === 1 ? 'Home' : 'Back'}
          </button>
          <button
            onClick={handleNext}
            disabled={!allAnswered || saving}
            className={`px-8 py-3 text-sm font-semibold text-white rounded-lg min-h-[44px] transition-colors ${
              allAnswered && !saving
                ? 'bg-navy hover:bg-blue cursor-pointer'
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Saving...
              </span>
            ) : step === 6 ? (
              'Complete Assessment'
            ) : (
              'Next'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
