import { cn } from "@/utils/clx";

const ROLE_STYLES: Record<string, string> = {
  admin: "bg-indigo-100 text-indigo-700",
  moderator: "bg-amber-100 text-amber-700",
  user: "bg-gray-100 text-gray-600",
  banned: "bg-red-100 text-red-600",
};

interface UserRoleBadgeProps {
  role: string;
}

export default function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const normalized = role?.toLowerCase() ?? "user";
  const style = ROLE_STYLES[normalized] ?? ROLE_STYLES.user;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize",
        style
      )}
    >
      {normalized}
    </span>
  );
}