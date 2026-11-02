// خانة بحث برقم الآية. هي نموذج GET عادي: عند الإرسال يضيف الرابط ?q=62
export default function VerseSearch({ activeDay, query }) {
  return (
    <form className="mb-4 flex max-w-md gap-2">
      {activeDay ? <input type="hidden" name="day" value={activeDay} /> : null}
      <input
        type="search"
        name="q"
        defaultValue={query}
        inputMode="numeric"
        placeholder="رقم آية، مثل ٦٢"
        aria-label="ابحث برقم آية"
        className="w-full rounded-xl border border-line bg-card px-3 py-2"
      />
      <button type="submit" className="btn btn-primary">
        بحث
      </button>
    </form>
  );
}
