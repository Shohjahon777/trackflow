export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-[24px] font-medium leading-[1.25] text-text-primary">
          <span className="font-mono">TRACK</span>
          <span className="font-mono text-accent">FLOW</span>
        </h1>
        <p className="max-w-sm text-[14px] leading-[1.6] text-text-secondary">
          The multi-project command center for anyone who ships.
        </p>
      </div>
    </div>
  );
}
