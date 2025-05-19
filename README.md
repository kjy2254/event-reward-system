# 🎯 이벤트 보상 관리 시스템

NestJS 기반의 MSA(Microservice Architecture) 구조로 구축된 **이벤트/보상 관리 플랫폼**입니다. 이 시스템은 유저가 조건을 만족하면 보상을 받을 수 있도록 구성되어 있으며, JWT 인증/인가, 역할 기반 접근 제어, 이벤트 조건 검증, 보상 요청 이력 조회 등의 기능을 포함합니다.

---

## 🧱 기술 스택

| 항목         | 내용                             |
| ------------ | -------------------------------- |
| 언어         | TypeScript                       |
| 프레임워크   | NestJS(Node.js v18)              |
| DB           | MongoDB                          |
| 인증/인가    | JWT + Passport + Role 기반 Guard |
| 배포 및 실행 | Docker + docker-compose          |

---

## 🚀 실행 방법

### 1. 로컬 실행 (Docker 기반)

```bash
# 루트 디렉토리에서
$ docker-compose up --build
```

### 2. 서버 포트

| 서비스                                                               | 주소                                            |
| -------------------------------------------------------------------- | ----------------------------------------------- |
| Gateway                                                              | [http://localhost:3000](http://localhost:3000/) |
| Auth                                                                 | 내부 서비스용                                   |
| (API Docs: [http://localhost:3001/docs](http://localhost:3001/docs)) |                                                 |
| Event                                                                | 내부 서비스용                                   |
| (API Docs: [http://localhost:3002/docs](http://localhost:3002/docs)) |                                                 |
| MongoDB                                                              | localhost:27017                                 |
| (테스트용, 컨테이너 내부에선 mongo로 접근)                           |                                                 |

> 모든 요청은 반드시 Gateway를 통해 이루어집니다.

---

## 🧩 주요 기능

### ✅ 인증 및 역할 기반 접근 제어

- `USER`, `OPERATOR`, `AUDITOR`, `ADMIN` 역할 정의
- `JwtAuthGuard`, `RolesGuard`로 역할 제어
- Gateway에서 JWT 인증 후 역할에 따라 적절한 라우팅 수행

### ✅ 이벤트 등록

**_POST /event/events_**

- `OPERATOR` 또는 `ADMIN`만 생성 가능
- 이벤트 명, 달성 조건, 이벤트 기간, 설명을 포함하여 이벤트 생성
- 사전 정의된 이벤트 목표 달성 조건 목록을 활용

### ✅ 이벤트 조회

**_GET /event/events_**

- 이벤트 조회는 누구나 가능
- 이벤트 활성 여부는 이벤트 기간 내일 경우 `ACTIVE`

### ✅ 보상 등록

**_POST /event/rewards_**

- `OPERATOR` 또는 `ADMIN`만 생성 가능
- 이벤트에 연결된 보상을 등록 가능
- 하나의 이벤트에 여러 개 보상 등록 가능
- 보상 명, 보상 타입, 수량을 body에 포함

### ✅ 보상 조회

**_GET /event/rewards_**

- 보상 조회는 누구나 가능
- 이벤트 ID를 쿼리로 전달하여 해당 이벤트의 보상을 조회

### ✅ 보상 요청

**_POST /event/requests_**

- 유저가 특정 이벤트에 대해 보상 요청
- 시스템은 다음 항목을 검증:
  1. 이벤트 유효 기간 여부
  2. 중복 보상 수령 여부
  3. 이벤트에 정의된 조건 충족 여부
- 보상 요청 기록을 컬렉션에 저장

### ✅ 보상 요청 이력 조회

**_GET /event/requests_**

- `USER`: 자신의 요청 이력 조회(GET /event/requests/me)
- `OPERATOR`, `AUDITOR`, `ADMIN`: 전체 유저의 요청 이력 조회
- `eventId`, `status` 기준 선택적 필터링 가능(쿼리)
- `status`: `REWARDED`, `CONDITION_NOT_MET`, `ALREADY_REWARDED`, `EVENT_NOT_ACTIVE`

### ✅ 조건 등록 및 검증 구조

- `conditions` 컬렉션에 조건을 미리 등록(GET /event/conditions로 확인)
- 이벤트는 해당 키만 사용할 수 있음
- `ConditionCheckerService`를 통해 조건 검사 함수 자동 매핑
- 현재 5월 5일 접속(`login_on_0505`), 데스티니 해방 퀘스트 완료 여부(`destiny_quest_clear`)를 검사하는 함수만 구현
- 조건과 함수를 `ConditionCheckerService`에 추가하여 확장 가능한 구조

---

## 📦 API Documents

<aside>

**Auth**

[http://localhost:3001/docs](http://localhost:3001/docs)

</aside>

<aside>

**Event**

[http://localhost:3002/docs](http://localhost:3002/docs)

</aside>

> docker-compose up 후 접속

---

## 💬 구현 중 고민 및 해결

### 1. 인증과 라우팅 위치 문제

- 처음에는 각 서비스에서 Guard를 적용했으나, 요구사항에 따라 Gateway 단에서 일괄 인증/인가 처리
- 이후 하위 서비스는 `x-user-id`, `x-user-role` 등을 header로 받아 처리하는 구조로 수정

### 2. 이벤트 조건의 동적 설계

- 이벤트 보상 조건을 컬렉션으로 관리하고, 이미 존재하는 조건만 API로 확인 후 이벤트에 추가가 가능하게 하고자 함
- 이에 따라 `conditions` 컬렉션 기반 설계와 동적 함수 매핑 구조 도입
- 추후, `ConditionCheckerService`의 조건과 매핑 함수를 추가하여 손쉽게 확장 가능한 구조로 설계

---

## 🧑‍💻 디렉토리 구조 (Monorepo)

```
apps/
  gateway/
  auth/
  event/
libs/
  common/
    decorators/
    interfaces/
```
