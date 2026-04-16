import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background px-6 py-12">
      <div className="mx-auto w-full max-w-sm">
        <Suspense
          fallback={
            <p className="text-center text-sm text-muted-foreground">
              Loading…
            </p>
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
