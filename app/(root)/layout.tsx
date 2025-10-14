import Header from "@/components/Header";
import { auth } from "@/lib/better-auth/auth";
import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  // Retrieve the current session by passing request headers to the auth API
  const session = await auth.api.getSession({ headers: await headers() });
  // If no valid session or user is found, redirect to the sign-in page
  if (!session?.user) redirect("/sign-in");
  // Extract key user details from the session
  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };
  // Render the main app layout for authenticated users
  return (
    <main className="min-h-screen text-gray-400">
      <Header user={user} />
      {/* Main content container where page components will be rendered */}
      <div className="container py-10">{children}</div>
    </main>
  );
};

export default Layout;
