import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import googleLogo from "@/public/images/google-logo.svg";
import { API_URL } from "@/lib/api";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
      </div>
      <div className="grid gap-6">
        <Button
          type="button"
          variant="outline"
          className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90"
        >
          <a className={"flex"} href={`${API_URL}/api/auth/google`}>
            <Image
              className="mr-3"
              priority={true}
              src={googleLogo}
              alt="Google"
              width={20}
              height={20}
            />
            Continue with Google
          </a>
        </Button>
      </div>
    </form>
  );
}
