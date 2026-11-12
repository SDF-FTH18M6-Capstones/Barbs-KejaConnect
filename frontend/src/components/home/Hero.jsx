export default function Hero({ unitCount, areaCount }) {
  return (
    <section className="bg-primary text-text-on-primary">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3.5 px-6 pb-10 pt-12">
        <h1 className="max-w-[720px] font-display text-[32px] font-bold leading-[1.15] sm:text-[40px]">
          Find a house in Nairobi, listed once, by someone verified.
        </h1>

        <p className="min-h-[26px] text-[17px] text-brand-tint">
          {unitCount != null &&
            areaCount > 0 &&
            `${unitCount} available units across ${areaCount} areas.`}
        </p>
      </div>
    </section>
  );
}
