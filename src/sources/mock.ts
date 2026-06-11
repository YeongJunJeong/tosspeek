import type { PortfolioSnapshot, Source } from "../core/types.js";

/**
 * 랜덤워크 데모 소스. API 키 없이 전체 파이프라인을 굴려볼 수 있다.
 * 2% 확률로 급락 이벤트가 온다. 현실 고증.
 */
export class MockSource implements Source {
  name = "mock";

  private readonly cost = 10_000_000;
  private readonly prevClose: number;
  private value: number;

  constructor(private opts: { alwaysOpen?: boolean; volatility?: number } = {}) {
    // 누적 손익이 어느 정도 쌓인 상태(-15% ~ +15%)에서 시작
    this.prevClose = this.cost * (1 + (Math.random() * 0.3 - 0.15));
    this.value = this.prevClose;
  }

  async fetch(): Promise<PortfolioSnapshot> {
    const vol = this.opts.volatility ?? 0.0015;
    let step = (Math.random() * 2 - 1) * vol;
    if (Math.random() < 0.02) step -= 0.015; // 급락 이벤트
    this.value *= 1 + step;

    const now = new Date();
    return {
      totalValue: this.value,
      totalCost: this.cost,
      dayChangePct: (this.value / this.prevClose - 1) * 100,
      dayPnl: this.value - this.prevClose,
      marketOpen: this.opts.alwaysOpen ? true : isKrxOpen(now),
      at: now,
    };
  }
}

/** KRX 정규장: 평일 09:00 ~ 15:30 (로컬 시각이 KST라고 가정. 휴장일 미반영) */
export function isKrxOpen(d: Date): boolean {
  const day = d.getDay();
  if (day === 0 || day === 6) return false;
  const mins = d.getHours() * 60 + d.getMinutes();
  return mins >= 9 * 60 && mins < 15 * 60 + 30;
}
