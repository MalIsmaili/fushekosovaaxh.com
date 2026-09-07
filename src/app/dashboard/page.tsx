import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth-helpers";

export default async function DashboardRouter() {
  const user = await requireSession();

  switch (user.role) {
    case "COACH":
      redirect("/coach");
    case "STUDENT":
      redirect("/student");
    case "PARENT":
      redirect("/parent");
    default:
      redirect("/onboarding");
  }
}
