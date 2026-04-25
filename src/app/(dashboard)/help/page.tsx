import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TopNav } from "@/components/layout/top-nav";
import { Mail, LifeBuoy } from "lucide-react";

export default async function HelpPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const emails = ["bibekg2029@gmail.com", "grishma.neupana@selu.edu"];

  return (
    <div className="flex flex-col min-h-full">
      <TopNav title="Help" subtitle="Support and contact" />

      <div className="flex-1 overflow-y-auto p-6">
        <div
          className="rounded-2xl p-6 max-w-3xl"
          style={{
            background: "rgba(14,36,25,0.72)",
            border: "1px solid rgba(249,250,251,0.10)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(249,250,251,0.06)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
              style={{ background: "rgba(16,185,129,0.16)", border: "1px solid rgba(16,185,129,0.26)" }}
            >
              <LifeBuoy className="h-5 w-5" style={{ color: "#10B981" }} />
            </div>

            <div className="flex-1">
              <h1 className="text-xl font-extrabold text-white leading-tight">Help</h1>
              <p className="text-sm mt-1" style={{ color: "rgba(249,250,251,0.70)" }}>
                Need a hand with DollarPilot? Email us and we’ll get back to you.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(249,250,251,0.48)" }}>
              Contact
            </p>

            <div className="mt-3 grid gap-2">
              {emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="group flex items-center gap-2 rounded-xl px-3 py-2 transition-all hover:-translate-y-px active:translate-y-0 active:scale-[0.99]"
                  style={{
                    background: "rgba(6,20,13,0.55)",
                    border: "1px solid rgba(249,250,251,0.08)",
                  }}
                >
                  <Mail className="h-4 w-4" style={{ color: "rgba(249,250,251,0.72)" }} />
                  <span className="text-sm font-semibold text-white group-hover:text-white">{email}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: "rgba(249,250,251,0.48)" }}>
              Quick Notes
            </p>
            <ul className="mt-2 text-sm space-y-1" style={{ color: "rgba(249,250,251,0.70)" }}>
              <li>Include screenshots and your browser/device for faster troubleshooting.</li>
              <li>For account issues, email from the address you used to sign in.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

