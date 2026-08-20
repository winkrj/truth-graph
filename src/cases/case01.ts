import type { CaseDefinition } from "../game/types";

export const case01 = {
  id: "case-01-missing-demo-laptop",
  title: "심사 3분 전",
  eyebrow: "CASE 01 · 사라진 데모 노트북",
  hook: "팀의 유일한 데모 노트북이 사라졌다.",
  mission: "책상 위 기록을 풀어 중앙 방화 보관함을 여세요.",
  instruction: "두 개의 첫 단서를 찾고, 그 정보를 다음 물건에 사용해 세 개의 잠금을 해제하세요.",
  knownFacts: [
    { id: "fact-last-seen", label: "마지막 확인", value: "14:12 · 팀 테이블" },
    { id: "fact-offline", label: "연결 끊김", value: "14:18 · 노트북 오프라인" },
    { id: "fact-deadline", label: "심사 시작", value: "3분 후" }
  ],
  puzzles: [
    {
      id: "thermal-scan",
      kind: "THERMAL_SCAN",
      eyebrow: "기기 진단",
      title: "열화상 기록",
      objectLabel: "진단 태블릿",
      prompt: "구역을 스캔해 가장 높은 온도가 남은 셀을 판독하세요.",
      unlockRequires: [],
      cells: [
        { id: "a1", label: "A1", reading: 48, heat: 0.34 },
        { id: "a2", label: "A2", reading: 63, heat: 0.56 },
        { id: "a3", label: "A3", reading: 52, heat: 0.39 },
        { id: "b1", label: "B1", reading: 59, heat: 0.47 },
        { id: "b2", label: "B2", reading: 74, heat: 0.72 },
        { id: "b3", label: "B3", reading: 82, heat: 0.82 },
        { id: "c1", label: "C1", reading: 44, heat: 0.28 },
        { id: "c2", label: "C2", reading: 68, heat: 0.63 },
        { id: "c3", label: "C3", reading: 57, heat: 0.45 }
      ],
      solutionCellId: "b3",
      reward: {
        label: "최고 온도",
        value: "82°C",
        detail: "14:17 · 배터리 안전 종료 직전"
      },
      hints: [
        "잔열이 강한 구역은 주변 셀보다 밝고, 충전 회로의 오른쪽에 있습니다.",
        "중단 오른쪽 B3 셀을 다른 구역과 비교해 보세요."
      ]
    },
    {
      id: "message-recovery",
      kind: "MESSAGE_ORDER",
      eyebrow: "삭제 대화",
      title: "메시지 복원",
      objectLabel: "팀 휴대폰",
      prompt: "끊어진 세 문장을 자연스러운 순서로 복원하세요.",
      unlockRequires: [],
      fragments: [
        { id: "fragment-red", text: "빨간 탭의" },
        { id: "fragment-seven", text: "7조부터 확인해." },
        { id: "fragment-warning", text: "온도 경고가 뜨면" }
      ],
      solutionFragmentIds: ["fragment-warning", "fragment-red", "fragment-seven"],
      reward: {
        label: "메시지 키워드",
        value: "안전 규정 7조",
        detail: "유진이 남긴 마지막 점검 지시"
      },
      hints: [
        "문장은 상황이 먼저, 가리키는 대상이 다음, 행동 지시가 마지막입니다.",
        "`온도 경고가 뜨면`으로 시작해 `7조부터 확인해`로 끝납니다."
      ]
    },
    {
      id: "protocol-overlay",
      kind: "PROTOCOL_DIAL",
      eyebrow: "운영 물품 대장",
      title: "안전 규정 오버레이",
      objectLabel: "규정 대장",
      prompt: "발견한 조항과 온도에 맞춰 두 개의 다이얼을 정렬하세요.",
      unlockRequires: ["thermal-scan", "message-recovery"],
      ruleOptions: [4, 7, 9],
      thresholdOptions: [60, 80, 90],
      solutionRule: 7,
      solutionThreshold: 80,
      reward: {
        label: "격리 위치",
        value: "방화 보관실 B-3",
        detail: "80°C 초과 기기 긴급 격리 구역"
      },
      hints: [
        "휴대폰에서 얻은 조항 번호와 열화상 최고 온도를 함께 사용하세요.",
        "7조에서 82°C가 넘는 가장 가까운 기준값은 80°C입니다."
      ]
    },
    {
      id: "route-trace",
      kind: "ROUTE_TRACE",
      eyebrow: "출입 판독기",
      title: "유진의 마지막 동선",
      objectLabel: "출입증 지도",
      prompt: "시간이 증가하는 연결 지점을 따라 발견한 보관 위치까지 동선을 복원하세요.",
      unlockRequires: ["protocol-overlay"],
      nodes: [
        { id: "team-table", label: "팀 테이블", time: "14:12", x: 15, y: 70, kind: "START" },
        { id: "east-hall", label: "동쪽 복도", time: "14:19", x: 42, y: 28, kind: "DISTRACTOR" },
        { id: "west-reader", label: "서쪽 판독기", time: "14:18", x: 43, y: 70, kind: "PATH" },
        { id: "outside-exit", label: "외부 출구", time: "기록 없음", x: 72, y: 22, kind: "DISTRACTOR" },
        { id: "b2", label: "보관실 B-2", time: "14:23", x: 72, y: 53, kind: "DISTRACTOR" },
        { id: "b3", label: "방화실 B-3", time: "14:24", x: 78, y: 79, kind: "DESTINATION" }
      ],
      connections: [
        ["team-table", "east-hall"],
        ["team-table", "west-reader"],
        ["east-hall", "outside-exit"],
        ["west-reader", "b2"],
        ["west-reader", "b3"]
      ],
      solutionNodeIds: ["team-table", "west-reader", "b3"],
      reward: {
        label: "확정 동선",
        value: "14:24 · B-3 입실",
        detail: "외부 출구 통과 기록 없음"
      },
      hints: [
        "기록이 없는 출구는 제외하고, 14:12 이후 시간이 증가하는 선만 따라가세요.",
        "팀 테이블 → 서쪽 판독기 → 방화실 B-3 순서입니다."
      ]
    }
  ],
  conclusion: {
    eyebrow: "LOCKER B-3 · OPEN",
    headline: "찾았다. 노트북은 방화 보관함 안에 있었다.",
    explanation:
      "유진은 82°C까지 과열된 노트북을 안전 규정 7조에 따라 B-3에 격리했습니다. 절도가 아니라 긴급 조치였지만, 인수인계 기록을 남기지 않은 실수는 분명합니다.",
    timeline: [
      { time: "14:17", label: "82°C 감지" },
      { time: "14:18", label: "긴급 이동" },
      { time: "14:24", label: "B-3 격리" }
    ]
  }
} satisfies CaseDefinition;
