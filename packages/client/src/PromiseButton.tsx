import React from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
  promise: () => Promise<unknown>;
};

export function PromiseButton({
  disabled,
  className,
  children,
  promise,
}: Props) {
  const [pending, setPending] = React.useState(false);
  const onClick = async () => {
    if (pending) return;

    setPending(true);

    try {
      await promise();
    } catch (e) {
      console.error(e);
    } finally {
      setPending(false);
    }
  };

  return (
    <button
      disabled={disabled || pending}
      className={twMerge(
        "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded",
        className
      )}
      onClick={onClick}
    >
      {pending ? "Pending..." : children}
    </button>
  );
}
