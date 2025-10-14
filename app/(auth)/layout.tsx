import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) redirect("/");
  return (
    <main className="auth-layout">
      <section className="auth-left-section scrollbar-hide-default">
        <Link href="/" className="auth-logo flex items-center gap-2">
          <Image
            src={"/logo.png"}
            alt="StockLens logo"
            width={140}
            height={140}
            className="h-9 w-auto cursor-pointer"
          />
        </Link>

        <div className="pb-6 lg:pb-8 flex-1">{children}</div>
      </section>

      <section className="auth-right-section">
        <div className="z-10 relative lg:mt-4 lg:mb-16">
          <blockquote className="auth-blockquote">
            <span className="text-indigo-300">StockLens</span> doesn’t just send
            alerts, it helps me see the market. It’s not luck anymore it’s
            strategy, thanks to{" "}
            <span className="text-indigo-300">StockLens</span>.
          </blockquote>
          <div className="flex items-center justify-between">
            <div>
              <cite className="auth-testimonial-author">- Robert J.</cite>
              <p className="max-md:text-xs text-gray-500">Retail Investor</p>
            </div>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Image
                  src="/assets/icons/star.svg"
                  alt="Star"
                  key={star}
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <Image
            src="/assets/images/dashboard.png"
            alt="Dashboard Preview"
            width={1440}
            height={1150}
            className="auth-dashboard-preview absolute top-0"
          />
        </div>
      </section>
    </main>
  );
};

export default Layout;
