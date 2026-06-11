import type { Signal, Sink } from "../core/types.js";

/** 데모/디버그용 싱크: 무드 색 블록과 한 줄 메시지를 터미널에 찍는다. */
export class TerminalSink implements Sink {
  name = "terminal";

  async apply(sig: Signal): Promise<void> {
    const { r, g, b } = sig.color;
    const block = `\x1b[38;2;${r};${g};${b}m${"█".repeat(16)}\x1b[0m`;
    const pct = `${sig.dayChangePct >= 0 ? "+" : ""}${sig.dayChangePct.toFixed(2)}%`;
    const total = `(누적 ${sig.totalPnlPct >= 0 ? "+" : ""}${sig.totalPnlPct.toFixed(1)}%)`;
    const alarm = sig.effect === "blink" ? "  🚨 공습경보" : "";
    const offDuty = sig.offDuty ? "  🏃 오늘 주식이 너 대신 벌었다. 퇴근해라." : "";
    console.log(`${block}  ${sig.emoji} ${pct} ${total}  ${sig.message}${alarm}${offDuty}`);
  }
}
