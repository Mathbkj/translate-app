import type { IProfile } from "@/types/IProfile";
import { User } from "lucide-react";

export function Profile({ username }: IProfile) {
  return (
    <div className="h-8 flex [&_svg]:size-full [&_span]:text-sm text-gray-dark gap-2 px-4 py-2">
      <User />
      <span>{username}</span>
    </div>
  );
}
