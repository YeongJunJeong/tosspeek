import type { Config } from "../config.js";
import type { RGB, Signal, Sink } from "../core/types.js";

/**
 * Philips Hue 로컬 브리지 싱크. 외부 의존성 없이 내장 fetch로 동작한다.
 * 브리지 IP와 API 키 발급: https://developers.meethue.com/develop/get-started-2/
 */
export class HueSink implements Sink {
  name = "hue";

  constructor(private cfg: Config["sinks"]["hue"]) {}

  async init(): Promise<void> {
    if (!this.cfg.bridgeIp || !this.cfg.apiKey) {
      throw new Error("hue 싱크에 bridgeIp/apiKey가 필요합니다.");
    }
  }

  async apply(sig: Signal): Promise<void> {
    const { h, s } = rgbToHs(sig.color);
    const body = JSON.stringify({
      on: true,
      bri: Math.round(sig.brightness * 254),
      hue: Math.round((h / 360) * 65535),
      sat: Math.round(s * 254),
      // lselect = 15초간 깜빡임 (공습경보)
      alert: sig.effect === "blink" ? "lselect" : "none",
    });
    await Promise.allSettled(
      this.cfg.lightIds.map((id) =>
        fetch(`http://${this.cfg.bridgeIp}/api/${this.cfg.apiKey}/lights/${id}/state`, {
          method: "PUT",
          body,
        }),
      ),
    );
  }
}

function rgbToHs({ r, g, b }: RGB): { h: number; s: number } {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s };
}
