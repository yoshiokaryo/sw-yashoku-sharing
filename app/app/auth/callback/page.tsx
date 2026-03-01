import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function AuthCallbackPage() {
  const session = await auth();
  if (session) redirect("/app");
  redirect("/auth/login");
}
