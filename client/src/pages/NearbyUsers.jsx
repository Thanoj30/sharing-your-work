function NearbyUsers() {
  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase text-teal-700">Nearby Users</p>
        <h2 className="mt-1 text-3xl font-bold text-slate-950">Nearby users placeholder</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          This page is reserved for location-based discovery after map or location permissions are added.
        </p>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="grid min-h-80 place-items-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
          <div>
            <p className="text-lg font-bold text-slate-900">Nearby discovery coming next</p>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              Future versions can show users near the current location, campus area, or saved address.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NearbyUsers;

