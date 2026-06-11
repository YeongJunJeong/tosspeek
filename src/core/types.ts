/** 소스(증권사)가 만들어내는 정규화된 계좌 스냅샷 */
export interface PortfolioSnapshot {
  /** 현재 평가금액 (KRW) */
  totalValue: number;
  /** 총 매입금액 (KRW) */
  totalCost: number;
  /** 당일 등락률 (%) */
  dayChangePct: number;
  /** 당일 손익 (KRW) */
  dayPnl: number;
  /** 장중 여부 */
  marketOpen: boolean;
  /** 측정 시각 */
  at: Date;
}

export type Mood =
  | "gazua" // 당일 +5% 이상
  | "cruise" // +1 ~ +5%
  | "flat" // -1 ~ +1%
  | "dip" // -1 ~ -5%
  | "mullim" // -5% 이하
  | "deepsea" // 누적 -20% 이하 (당일 등락 무관)
  | "rest"; // 장 마감

export interface RGB {
  r: number;
  g: number;
  b: number;
}

/** 코어가 만들어내는, 모든 싱크가 알아듣는 공용어 */
export interface Signal {
  mood: Mood;
  dayChangePct: number;
  totalPnlPct: number;
  dayPnl: number;
  color: RGB;
  /** 0..1 */
  brightness: number;
  effect: "solid" | "pulse" | "blink";
  emoji: string;
  message: string;
  /** 퇴근 판정: 당일 손익이 출근 후 누적 시급을 넘었는가 */
  offDuty: boolean;
  /** ISO 8601 */
  at: string;
}

export interface Source {
  name: string;
  fetch(): Promise<PortfolioSnapshot>;
}

export interface Sink {
  name: string;
  /** 연결 수립. 실패해도 다른 싱크는 계속 동작한다. */
  init?(): Promise<void>;
  apply(signal: Signal): Promise<void>;
  close?(): Promise<void>;
}
