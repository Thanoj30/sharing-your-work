function PlaceholderPage({ title, description }) {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase text-teal-700">Sharing Your Work</p>
        <h2 className="mt-1 text-3xl font-bold text-slate-950">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="grid min-h-64 place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
          <div>
            <p className="text-lg font-bold text-slate-900">{title}</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              This section is ready for the next feature implementation step.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PlaceholderPage;

