"use client";

import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function NavLink({ href, children, className = "" }: Props) {
  return (
    <Link
      href={href}
      className={
        "rounded-xl bg-accent text-white font-medium px-6 py-4 shadow-sm active:opacity-90 btn-primary " +
        className
      }
    >
      {children}
    </Link>
  );
}
