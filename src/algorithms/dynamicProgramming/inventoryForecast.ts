/**
 * Dynamic Programming — multi-day demand forecasting with weekday/weekend states.
 * Business: Forecast page tomorrow revenue & inventory restock planning.
 *
 * dp[d][s] = max expected revenue pattern ending day d in state s (weekday/weekend)
 */

export interface ForecastInput {
  dailyRevenue: number[];
  isWeekend: boolean[];
}

export interface ForecastOutput {
  predicted: number[];
  tomorrow: number;
  confidence: number;
}

export function forecastDemandDP(input: ForecastInput): ForecastOutput {
  const { dailyRevenue, isWeekend } = input;
  const n = dailyRevenue.length;
  if (n === 0) return { predicted: [], tomorrow: 0, confidence: 0 };

  const states = 2;
  const dp: number[][] = Array.from({ length: n }, () => [0, 0]);

  dp[0][isWeekend[0] ? 1 : 0] = dailyRevenue[0];

  for (let d = 1; d < n; d++) {
    const s = isWeekend[d] ? 1 : 0;
    const prev = isWeekend[d - 1] ? 1 : 0;
    const observed = dailyRevenue[d];
    dp[d][s] = Math.max(
      0.55 * dp[d - 1][prev] + 0.45 * observed,
      0.4 * dp[d - 1][1 - prev] + 0.6 * observed
    );
  }

  const last = dp[n - 1];
  const tomorrowWeekend = isWeekend[n - 1];
  const tomorrow =
    Math.round(
      tomorrowWeekend
        ? Math.max(last[1], last[0] * 1.15) * 1.08
        : Math.max(last[0], last[1] * 0.92)
    ) || dailyRevenue[n - 1];

  const predicted = dp.map((row, i) =>
    Math.round(Math.max(row[0], row[1]) || dailyRevenue[i])
  );

  const variance =
    dailyRevenue.reduce((s, v, i) => s + Math.abs(v - predicted[i]), 0) / n;
  const confidence = Math.max(0.6, Math.min(0.95, 1 - variance / (tomorrow || 1)));

  return { predicted, tomorrow, confidence };
}

/** Time: O(n · states) = O(n) | Space: O(n · states) */
