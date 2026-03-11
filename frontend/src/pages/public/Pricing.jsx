export default function Pricing() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-10">Pricing Plans</h1>

      <div className="grid md:grid-cols-3 gap-8">

        <div className="bg-[#0f172a] p-6 rounded-2xl border border-white/10">
          <h2 className="text-2xl font-bold mb-4">Free</h2>
          <p>200 requests/month</p>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-2xl border border-purple-500">
          <h2 className="text-2xl font-bold mb-4">Pro</h2>
          <p>2,000 requests/month</p>
        </div>

        <div className="bg-[#0f172a] p-6 rounded-2xl border border-pink-500">
          <h2 className="text-2xl font-bold mb-4">Enterprise</h2>
          <p>10,000 requests/month</p>
        </div>

      </div>
    </div>
  );
}