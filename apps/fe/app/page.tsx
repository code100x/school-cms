import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-brand-50/60 to-transparent dark:from-brand-900/10">
      <header className="container-max flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-brand-600" />
          <span className="text-lg font-semibold">Code100x School</span>
        </div>
        <nav className="flex items-center gap-3">
          <Link className="btn btn-outline" href="/signin">Sign in</Link>
          <Link className="btn btn-primary" href="/dashboard">Open Dashboard</Link>
        </nav>
      </header>

      <section className="container-max grid gap-10 py-20 lg:grid-cols-2">
        <div className="flex flex-col justify-center gap-6">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
            Manage your courses, calendars & wallets in one place.
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            A clean dashboard for students to access course calendars (Notion) and track wallet activity.
          </p>
          <div className="flex gap-3">
            <Link href="/signin" className="btn btn-primary">Get Started</Link>
            <a href="https://turborepo.org" className="btn btn-outline" target="_blank" rel="noreferrer">
              Learn More
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 p-3 shadow-xl dark:border-gray-800">
          <div className="aspect-[16/10] w-full rounded-xl bg-gradient-to-br from-brand-200 to-brand-400/60 dark:from-brand-800 dark:to-brand-700" />
        </div>
      </section>
      <footer className="container-max py-10 text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} Code100x
      </footer>
    </main>
  );
}
