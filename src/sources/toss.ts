import type { Config } from "../config.js";
import type { PortfolioSnapshot, Source } from "../core/types.js";

/**
 * 토스증권 공식 Open API 소스 — 조회 전용. 주문 카테고리는 영원히 사용하지 않는다.
 *
 * 연동 계획 (API 키 발급 대기 중):
 *   1. POST https://openapi.tossinvest.com/v1/oauth2/token (OAuth 2.0 Client Credentials)
 *   2. 계좌/보유주식 조회 — `Authorization: Bearer {token}` + `X-Tossinvest-Account` 헤더
 *   3. 평가금액/매입금액/당일손익을 PortfolioSnapshot으로 정규화
 */
export class TossSource implements Source {
  name = "toss";

  constructor(private cfg: Config["toss"]) {}

  async fetch(): Promise<PortfolioSnapshot> {
    if (!this.cfg.clientId || !this.cfg.clientSecret) {
      throw new Error(
        "토스증권 Open API 키가 설정되지 않았습니다. 키 발급 전까지는 source: \"mock\"으로 데모를 실행하세요.",
      );
    }
    throw new Error("TossSource는 아직 구현되지 않았습니다 (v0.3 예정).");
  }
}
