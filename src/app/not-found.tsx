import Link from "next/link";
import { buttonClasses } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container-page flex flex-1 flex-col items-center justify-center py-32 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">404</p>
      <h1 className="mt-3 text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 max-w-md text-body">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className={`${buttonClasses({})} mt-8`}>
        Back to home
      </Link>
    </main>
  );
}
