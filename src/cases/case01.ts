import type { CaseDefinition } from "../game/types";

export const case01 = {
  id: "case-01-proof-of-fun-v2",
  eyebrow: "사건 01 · 추리 프로토타입",
  title: "사라진 E-17",
  briefing:
    "비상 상황이 끝난 뒤 E-17이 사라졌습니다. 흩어진 증거의 원인과 결과를 연결해 실제 사건을 재구성하세요.",
  instruction:
    "첫 번째 증거를 원인으로, 두 번째 증거를 결과로 선택하세요.",
  evidenceCards: [
    {
      id: "inventory-0850",
      title: "08:50 재고 확인",
      detail: "E-17이 보관 중인 것을 확인했다.",
      kind: "기록",
      source: "재고 관리 시스템",
      time: "08:50",
      position: { x: 60, y: 150 },
      relevance: "CONTEXT"
    },
    {
      id: "generator-failure-0937",
      title: "산소 발생기 2번 고장",
      detail: "압력 조절기 이상으로 산소 공급이 중단됐다.",
      kind: "사건",
      source: "장애 감시 로그",
      time: "09:37",
      position: { x: 60, y: 350 },
      relevance: "CORE"
    },
    {
      id: "jun-emergency-response",
      title: "준의 긴급 대응",
      detail: "정비 담당자 준이 고장 현장에 투입됐다.",
      kind: "인물",
      source: "정비 보고서",
      time: "09:37 직후",
      position: { x: 315, y: 230 },
      relevance: "CORE"
    },
    {
      id: "storage-access-0942",
      title: "09:42 창고 출입",
      detail: "정비 권한으로 장비 창고가 열렸다.",
      kind: "출입 기록",
      source: "출입 통제 기록",
      time: "09:42",
      position: { x: 570, y: 150 },
      relevance: "CORE"
    },
    {
      id: "e17-missing",
      title: "E-17 보관 이탈",
      detail: "09:42 출입 직후 E-17이 보관 위치에서 사라졌다.",
      kind: "대상",
      source: "재고 상태 대조",
      time: "09:42 이후",
      position: { x: 570, y: 350 },
      relevance: "CORE"
    },
    {
      id: "system-stabilized-0948",
      title: "09:48 시스템 안정화",
      detail: "보조 전원이 연결된 뒤 산소 공급이 정상화됐다.",
      kind: "시스템",
      source: "산소 제어 로그",
      time: "09:48",
      position: { x: 930, y: 230 },
      relevance: "CORE"
    },
    {
      id: "no-withdrawal-record",
      title: "출고 기록 없음",
      detail: "E-17 반출을 승인하거나 기록한 내역이 없다.",
      kind: "기록",
      source: "재고 출고 기록",
      time: "09:42 이후",
      position: { x: 315, y: 450 },
      relevance: "CORE"
    }
  ],
  timelineMarkers: [
    { id: "timeline-0850", time: "08:50", label: "재고 확인", x: 100 },
    { id: "timeline-0937", time: "09:37", label: "발생기 고장", x: 320 },
    { id: "timeline-0942", time: "09:42", label: "창고 출입", x: 560 },
    { id: "timeline-0948", time: "09:48", label: "시스템 안정화", x: 790 },
    { id: "timeline-1005", time: "10:05", label: "분실 확인", x: 1050 }
  ],
  deductionRules: [
    {
      id: "failure-caused-response",
      fromEvidenceId: "generator-failure-0937",
      toEvidenceId: "jun-emergency-response",
      label: "긴급 대응 유발",
      labelPosition: { x: 215, y: 313 },
      requiresConfirmedDeductionIds: [],
      critical: false
    },
    {
      id: "response-led-to-access",
      fromEvidenceId: "jun-emergency-response",
      toEvidenceId: "storage-access-0942",
      label: "창고 접근으로 이어짐",
      labelPosition: { x: 520, y: 130 },
      requiresConfirmedDeductionIds: [],
      critical: false
    },
    {
      id: "access-led-to-e17-removal",
      fromEvidenceId: "storage-access-0942",
      toEvidenceId: "e17-missing",
      label: "E-17 반출로 이어짐",
      labelPosition: { x: 680, y: 313 },
      requiresConfirmedDeductionIds: [],
      critical: false
    },
    {
      id: "emergency-caused-missed-record",
      fromEvidenceId: "jun-emergency-response",
      toEvidenceId: "no-withdrawal-record",
      label: "기록 누락 유발",
      labelPosition: { x: 425, y: 403 },
      requiresConfirmedDeductionIds: [
        "failure-caused-response",
        "response-led-to-access"
      ],
      critical: false
    },
    {
      id: "e17-powered-stabilization",
      fromEvidenceId: "e17-missing",
      toEvidenceId: "system-stabilized-0948",
      label: "긴급 전원으로 사용",
      labelPosition: { x: 905, y: 375 },
      requiresConfirmedDeductionIds: [
        "failure-caused-response",
        "response-led-to-access",
        "access-led-to-e17-removal",
        "emergency-caused-missed-record"
      ],
      critical: true
    }
  ],
  conclusions: [
    {
      id: "conclusion-theft",
      label: "준이 E-17을 훔쳤다."
    },
    {
      id: "conclusion-system-error",
      label: "재고 시스템 오류로 E-17이 사라졌다."
    },
    {
      id: "conclusion-emergency-use",
      label: "E-17은 긴급 정비에 사용됐고 출고 기록이 누락됐다."
    }
  ],
  solution: {
    correctConclusionId: "conclusion-emergency-use"
  }
} satisfies CaseDefinition;
