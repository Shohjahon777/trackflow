import type { LeagueSlug } from "@/lib/xp";

type Props = {
  league: LeagueSlug;
  tier: 1 | 2 | 3;
  size?: number;
  fullName: string;
};

// Badge shape evolves with league index — shield → laurel-shield → hex → hex+star
// → laurel-crown → 8-point star → gem-inlaid star. Tier shown as 1–3 pip dots
// below the emblem (III = 3 pips, I = 1 pip).
export function LeagueBadge({ league, tier, size = 56, fullName }: Props) {
  const accent = `var(--color-league-${league}-accent)`;
  const light = `var(--color-league-${league}-light)`;
  const border = `var(--color-league-${league}-border)`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 80"
      width={size}
      height={size * (80 / 64)}
      role="img"
      aria-label={fullName}
      style={{ display: "block" }}
    >
      <title>{fullName}</title>
      <Emblem league={league} accent={accent} light={light} border={border} />
      <Pips tier={tier} accent={accent} border={border} />
    </svg>
  );
}

function Emblem({
  league,
  accent,
  light,
  border,
}: {
  league: LeagueSlug;
  accent: string;
  light: string;
  border: string;
}) {
  const common = { stroke: border, strokeWidth: 0.5, fill: light };

  switch (league) {
    case "bronze":
    case "silver":
      // Basic shield.
      return (
        <g>
          <path
            d="M32 4 L56 12 V32 Q56 50 32 60 Q8 50 8 32 V12 Z"
            {...common}
          />
          <circle cx="32" cy="30" r="8" fill={accent} opacity="0.85" />
        </g>
      );
    case "gold":
      // Shield with laurel base.
      return (
        <g>
          <path
            d="M32 4 L56 12 V32 Q56 50 32 60 Q8 50 8 32 V12 Z"
            {...common}
          />
          <circle cx="32" cy="28" r="9" fill={accent} opacity="0.9" />
          <path
            d="M18 52 Q24 58 32 58 Q40 58 46 52"
            stroke={accent}
            strokeWidth="1.5"
            fill="none"
          />
        </g>
      );
    case "crystal":
      // Hexagonal gem cut.
      return (
        <g>
          <path
            d="M32 4 L54 18 V42 L32 56 L10 42 V18 Z"
            {...common}
          />
          <path
            d="M32 14 L44 22 V38 L32 46 L20 38 V22 Z"
            fill={accent}
            opacity="0.85"
          />
          <path
            d="M32 14 L44 22 L32 30 Z"
            fill={accent}
            opacity="0.55"
          />
        </g>
      );
    case "master":
      // Hex with inner 4-point star.
      return (
        <g>
          <path
            d="M32 4 L54 18 V42 L32 56 L10 42 V18 Z"
            {...common}
          />
          <path
            d="M32 14 L38 28 L52 30 L38 32 L32 46 L26 32 L12 30 L26 28 Z"
            fill={accent}
            opacity="0.9"
          />
        </g>
      );
    case "champion":
      // Hex + laurel crown.
      return (
        <g>
          <path
            d="M32 4 L54 18 V42 L32 56 L10 42 V18 Z"
            {...common}
          />
          <path
            d="M32 16 L38 30 L50 32 L38 34 L32 48 L26 34 L14 32 L26 30 Z"
            fill={accent}
            opacity="0.9"
          />
          <path
            d="M14 14 Q20 6 32 6 Q44 6 50 14"
            stroke={accent}
            strokeWidth="1.5"
            fill="none"
          />
        </g>
      );
    case "titan":
      // 8-point star.
      return (
        <g>
          <path
            d="M32 4 L38 22 L56 16 L44 30 L60 40 L40 38 L42 58 L32 44 L22 58 L24 38 L4 40 L20 30 L8 16 L26 22 Z"
            {...common}
            fill={accent}
            opacity="0.92"
          />
          <circle cx="32" cy="32" r="6" fill={light} stroke={border} strokeWidth="0.5" />
        </g>
      );
    case "legend":
      // 8-point star with gem inlay.
      return (
        <g>
          <path
            d="M32 2 L38 22 L58 14 L46 32 L62 42 L40 40 L42 62 L32 46 L22 62 L24 40 L2 42 L18 32 L6 14 L26 22 Z"
            stroke={border}
            strokeWidth="0.5"
            fill={accent}
            opacity="0.95"
          />
          <path
            d="M32 22 L38 32 L32 42 L26 32 Z"
            fill={light}
            stroke={border}
            strokeWidth="0.5"
          />
          <circle cx="32" cy="32" r="2.5" fill={accent} />
        </g>
      );
  }
}

function Pips({
  tier,
  accent,
  border,
}: {
  tier: 1 | 2 | 3;
  accent: string;
  border: string;
}) {
  const count = tier === 1 ? 1 : tier === 2 ? 2 : 3;
  const spacing = 6;
  const startX = 32 - ((count - 1) * spacing) / 2;
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => (
        <circle
          key={i}
          cx={startX + i * spacing}
          cy={70}
          r="2"
          fill={accent}
          stroke={border}
          strokeWidth="0.5"
        />
      ))}
    </g>
  );
}
