"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <section className="flex min-h-screen items-center justify-center">
      <div className="scale-90 md:scale-100 w-[400px] h-[450px] bg-primary shadow-neo rounded-xl p-10">
        <h1 className="text-2xl font-semibold text-slate-800">Login</h1>
        <p className="text-slate-700">Welcome, have a nice day!</p>
        <div className="mt-20">
          <span
            onClick={() => {
              signIn("google", { callbackUrl: "/" });
            }}
            className="cursor-pointer border border-black mt-7 w-full py-1.5 rounded-lg flex items-center justify-start pl-7 space-x-3"
          >
            <Image src="/google.png" width={20} height={22} alt="google" />
            <span>Continue with Google</span>
          </span>
          <div className="flex items-center justify-center mt-5">
            <hr className="border-t border-gray-300 flex-grow mr-3" />
            <p className="text-slate-700 text-sm">OR</p>
            <hr className="border-t border-gray-300 flex-grow ml-3" />
          </div>
          <span className="cursor-pointer border border-black/25 mt-5 w-full py-1.5 rounded-lg flex items-center justify-start pl-7 space-x-3">
            <Image src="/fb.png" width={20} height={22} alt="google" />
            <span>Continue with Facebook</span>
          </span>
          <span className="cursor-pointer border border-black/25 mt-3 w-full py-1.5 rounded-lg flex items-center justify-start pl-7 space-x-3">
            <Image src="/apple.png" width={20} height={22} alt="google" />
            <span>Continue with Apple</span>
          </span>
        </div>
        <Link
          href="/"
          className="underline text-sm mt-5 block text-center text-slate-600"
        >
          back to home
        </Link>
      </div>
    </section>
  );
}