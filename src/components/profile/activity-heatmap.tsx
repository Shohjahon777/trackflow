"use client";

import { useMemo } from "react";

type ActivityDay = {
  date: string;
  count: number;
};

type ActivityHeatmapProps = {
  data: ActivityDay[];
};

const CELL_SIZE = 11;
const GAP = 2;
const WEEKS = 52;
const DAYS = 7;
const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

const levelColors = [
  "bg-fog dark:bg-[#1A1A18]",
  "bg-[#C7C7E2] dark:bg-[#353764]",
  "bg-[#8E8EC5] dark:bg-[#4B4E84]",
  "bg-[#6366A0] dark:bg-[#6366A0]",
  "bg-[#353764] dark:bg-[#8E8EC5]",
];

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const grid = useMemo(() => {
    // Build a map of date -> count
    const countMap = new Map<string, number>();
    for (const d of data) {
      countMap.set(d.date, d.count);
    }

    // Build 52 weeks × 7 days grid ending today
    const today = new Date();
    const cells: { date: string; count: number; week: number; day: number }[] = [];

    // Find the most recent Saturday (end of last complete week) or today
    const todayDay = today.getDay(); // 0=Sun
    const endDate = new Date(today);

    // Go back 52 weeks * 7 days from the end
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (WEEKS * 7 - 1));

    // Adjust start to Sunday
    const startDay = startDate.getDay();
    if (startDay !== 0) {
      startDate.setDate(startDate.getDate() - startDay);
    }

    const cursor = new Date(startDate);
    let week = 0;
    let day = 0;

    while (cursor <= endDate) {
      const dateStr = cursor.toISOString().split("T")[0];
      const count = countMap.get(dateStr) ?? 0;
      cells.push({ date: dateStr, count, week, day });

      day++;
      if (day === 7) {
        day = 0;
        week++;
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    return cells;
  }, [data]);

  const totalWeeks = Math.ceil(grid.length / 7);
  const totalContributions = data.reduce((sum, d) => sum + d.count, 0);

  // Month labels
  const months = useMemo(() => {
    const labels: { label: string; week: number }[] = [];
    let lastMonth = -1;

    for (const cell of grid) {
      if (cell.day === 0) {
        const d = new Date(cell.date);
        const month = d.getMonth();
        if (month !== lastMonth) {
          labels.push({
            label: d.toLocaleDateString("en-US", { month: "short" }),
            week: cell.week,
          });
          lastMonth = month;
        }
      }
    }
    return labels;
  }, [grid]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.04em] text-text-tertiary">
          Activity
        </h2>
        <span className="font-mono text-[11px] text-text-tertiary">
          {totalContributions} contributions in the last year
        </span>
      </div>

      <div className="overflow-x-auto rounded-md border-[0.5px] border-border bg-surface p-4">
        {/* Month labels */}
        <div className="flex" style={{ marginLeft: 28 }}>
          {months.map((m, i) => (
            <span
              key={`${m.label}-${i}`}
              className="text-[10px] text-text-tertiary"
              style={{
                position: "relative",
                left: m.week * (CELL_SIZE + GAP),
                width: 0,
                whiteSpace: "nowrap",
              }}
            >
              {m.label}
            </span>
          ))}
        </div>

        <div className="mt-1 flex gap-0">
          {/* Day labels */}
          <div
            className="flex shrink-0 flex-col"
            style={{ gap: GAP, width: 28 }}
          >
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                className="text-[10px] text-text-tertiary"
                style={{ height: CELL_SIZE, lineHeight: `${CELL_SIZE}px` }}
              >
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div
            className="grid"
            style={{
              gridTemplateRows: `repeat(7, ${CELL_SIZE}px)`,
              gridAutoFlow: "column",
              gridAutoColumns: `${CELL_SIZE}px`,
              gap: GAP,
            }}
          >
            {grid.map((cell) => (
              <div
                key={cell.date}
                className={`rounded-[2px] ${levelColors[getLevel(cell.count)]}`}
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
                title={`${cell.date}: ${cell.count} contributions`}
              />
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-2 flex items-center justify-end gap-1">
          <span className="mr-1 text-[10px] text-text-tertiary">Less</span>
          {levelColors.map((color, i) => (
            <div
              key={i}
              className={`rounded-[2px] ${color}`}
              style={{ width: CELL_SIZE, height: CELL_SIZE }}
            />
          ))}
          <span className="ml-1 text-[10px] text-text-tertiary">More</span>
        </div>
      </div>
    </div>
  );
}
