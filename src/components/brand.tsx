import Link from "next/link";
import { HeartPulse } from "lucide-react";

export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="Swasthloop home">
      <span className="brand-mark" aria-hidden="true">
        <HeartPulse size={21} strokeWidth={2.2} />
      </span>
      <span className="brand-name">swasthloop</span>
    </Link>
  );
}
