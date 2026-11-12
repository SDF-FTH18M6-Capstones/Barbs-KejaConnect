export default function AuthLayout({ children }) {
  return (
    <main className="min-h-screen bg-bg text-text lg:grid lg:grid-cols-2">
      {/* Left branding section */}
      <section className="flex flex-col justify-between bg-primary px-8 py-10 text-white sm:px-12 lg:px-16">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">KejaConnect</h1>

          <div className="mt-20 max-w-lg">
            <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
              One unit. One listing. Verified posters only.
            </h2>

            <p className="mt-6 text-base leading-relaxed text-white/80">
              Find your next home with confidence. Connect with verified
              property posters and discover genuine rental listings.
            </p>
          </div>
        </div>
        <div className="mt-12 space-y-4">
          <p className="font-semibold">Your trust matters to us.</p>

          <ul className="space-y-3 text-sm text-white/85">
            <li>✓ Posters are checked by an admin</li>
            <li>✓ Duplicate listings are blocked</li>
            <li>✓ A safer way to find your next home</li>
          </ul>
        </div>
      </section>
      <section className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}