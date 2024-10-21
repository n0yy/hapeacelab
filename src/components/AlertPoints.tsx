"use client";

import { Alert } from "flowbite-react";
import Link from "next/link";

export default function AlertPoints() {
  return (
    <div className="mb-10">
      <Alert color="failure">You don't have enoght points.</Alert>
    </div>
  );
}
