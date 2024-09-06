"use client";

import { Alert } from "flowbite-react";
import Link from "next/link";

export default function AlertPoints(setShowAlert: any) {
  return (
    <div className="mb-10">
      <Alert color="failure" onDismiss={() => setShowAlert(false)}>
        You don't have enoght points. Please buy more points.{" "}
        <Link href="/#pricing" className="underline">
          Click Me
        </Link>
      </Alert>
    </div>
  );
}
