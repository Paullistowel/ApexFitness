import AuthForm from "../../components/AuthForm/AuthForm";
import AuthImagePanel from "../../components/AuthForm/AuthImagePanel";

export default function AuthPage() {
  return (
    <main className="h-screen bg-[#1a0f08] md:p-4">
      <section className="relative mx-auto flex h-full max-w-[1600px] overflow-hidden bg-[#1d1a17] shadow-[0_25px_80px_rgba(0,0,0,0.28)] rounded-3xl">
        <AuthImagePanel
          quote="Push yourself because no one else is going to do it for you."
          animate
        />

        {/* ── Right: Auth form ── */}
        <div className="relative flex w-full md:max-w-[430px] lg:max-w-[470px] items-center justify-center bg-[#1a0f08] px-4 py-10 sm:px-6 md:px-8 lg:px-10 overflow-y-auto">
          {/* angled join edge — only shown on md+ when the image panel is visible */}
          <div className="absolute inset-y-0 -left-20 hidden w-40 skew-x-[-12deg] bg-[#1a0f08] md:block" />
          <div className="relative z-10 w-full max-w-[420px]">
            <AuthForm />
          </div>
        </div>
      </section>
    </main>
  );
}
