type TopNavProps = {
  user?: {
    email?: string | null;
    username?: string | null;
  } | null;
};

export function TopNav({ user }: TopNavProps) {
  return (
    <header className="flex h-[48px] items-center justify-between border-b border-border bg-background px-4">
      <div />
      {user && (
        <span className="text-[12px] text-text-tertiary">
          {user.username ? (
            <span className="font-mono text-accent">@{user.username}</span>
          ) : (
            user.email
          )}
        </span>
      )}
    </header>
  );
}
