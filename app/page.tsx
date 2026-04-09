'use client';

import Link from 'next/link';

const verticals = [
  {
    slug: 'dental',
    name: 'Dental Practices',
    description: 'Patient records, imaging archives, and claim histories',
    icon: '🦷',
  },
  {
    slug: 'mortgage',
    name: 'Mortgage & Lending',
    description: 'Loan origination files, underwriting logs, and pipeline data',
    icon: '🏠',
  },
  {
    slug: 'healthcare_saas',
    name: 'Healthcare SaaS',
    description: 'EHR data, prior auth histories, and outcome records',
    icon: '🏥',
  },
  {
    slug: 'fintech',
    name: 'Fintech',
    description: 'Transaction histories, KYC records, and behavioral data',
    icon: '💳',
  },
  {
    slug: 'b2c',
    name: 'B2C / DTC Brands',
    description: 'Customer behavior, purchase histories, and content archives',
    icon: '🛍️',
  },
] as const;

const steps = [
  {
    number: '01',
    title: 'Answer 30 Questions',
    description: 'Answer 30 questions across 6 dimensions of AI readiness',
  },
  {
    number: '02',
    title: 'Data Asset Audit',
    description: 'We audit your proprietary data assets by vertical',
  },
  {
    number: '03',
    title: 'Get Your Report',
    description: 'Get a personalized AI readiness report with prioritized next steps',
  },
];

const trustItems = [
  'No account required',
  'No email required',
  '~10 minutes',
  'Your answers are private',
];

function VerticalCard({ slug, name, description, icon }: (typeof verticals)[number]) {
  return (
    <Link
      href={`/assess/${slug}/1`}
      className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-blue hover:-translate-y-0.5"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-navy group-hover:text-blue transition-colors">
        {name}
      </h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{description}</p>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-navy to-blue px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            Find out if your business is AI&#8209;ready&nbsp;&mdash; and what your data is actually worth.
          </h1>
          <p className="mt-6 text-lg text-blue-100 leading-relaxed sm:text-xl">
            Most businesses aren&rsquo;t missing AI tools. They&rsquo;re missing a clear picture of
            the proprietary data they already have. Take the 10&#8209;minute assessment.
          </p>
          <div className="mt-8 inline-block rounded-lg bg-white/10 px-6 py-4 backdrop-blur">
            <p className="text-sm leading-relaxed text-blue-50">
              <span className="font-bold text-white">Only 3%</span> of SMBs have fully integrated
              AI.{' '}
              <span className="font-bold text-white">60%</span> of businesses that haven&rsquo;t
              cite lack of in&#8209;house expertise&nbsp;&mdash; not cost.
            </p>
          </div>
        </div>
      </section>

      {/* Vertical Selector */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
            Choose Your Vertical
          </h2>
          <p className="mt-3 text-center text-gray-600">
            Select your industry to get a tailored AI readiness assessment
          </p>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {verticals.map((v) => (
              <VerticalCard key={v.slug} {...v} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-light-blue px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-navy sm:text-3xl">
            How It Works
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.number} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy text-white font-bold text-sm">
                  {s.number}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-gray-100 px-6 py-8">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 sm:gap-10">
          {trustItems.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-blue">&#10003;</span>
              {item}
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-navy sm:text-3xl">Ready to Find Out?</h2>
          <p className="mt-3 text-gray-600">
            Pick your vertical above, or start with our most popular assessment.
          </p>
          <Link
            href="/assess/dental/1"
            className="mt-8 inline-block rounded-lg bg-navy px-8 py-4 text-lg font-semibold text-white shadow transition-colors hover:bg-blue"
          >
            Start Assessment
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} ProdAgentCo. AI Readiness Scorecard &mdash; SMB &amp;
        Mid&#8209;Market Edition.
      </footer>
    </div>
  );
}
