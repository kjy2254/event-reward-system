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

| 서비스  | 주소                                                       |
| ------- | ---------------------------------------------------------- |
| Gateway | [http://localhost:3000](http://localhost:3000)             |
| Auth    | 내부 서비스용                                              |
| Event   | 내부 서비스용                                              |
| MongoDB | localhost:27017 (테스트용, 컨테이너 내부에선 mongo로 접근) |

> 모든 요청은 반드시 Gateway를 통해 이루어집니다.

---

## 🧩 주요 기능

### ✅ 인증 및 역할 기반 접근 제어

- `USER`, `OPERATOR`, `AUDITOR`, `ADMIN` 역할 정의
- `JwtAuthGuard`, `RolesGuard`로 역할 제어
- Gateway에서 JWT 인증 후 역할에 따라 적절한 라우팅 수행

### ✅ 이벤트 등록 및 조회

- OPERATOR 또는 ADMIN만 생성 가능
- 이벤트 조건 목록, 시작/종료 날짜, 활성 여부(이벤트 기간 확인)

### ✅ 보상 등록 및 조회

- 이벤트에 연결된 보상을 등록 가능
- 하나의 이벤트에 여러 개 보상 등록 가능

### ✅ 조건 기반 보상 요청

- 유저가 특정 이벤트에 대해 보상 요청
- 시스템은 다음 항목을 검증:

  1. 이벤트 유효 기간 여부
  2. 중복 보상 수령 여부
  3. 이벤트에 정의된 조건 충족 여부

### ✅ 조건 등록 및 검증 구조

- `conditions` 컬렉션에 조건을 미리 등록
- 이벤트는 해당 키만 사용할 수 있음
- `ConditionCheckerService`를 통해 조건 검사 함수 자동 매핑
- 현재 5월 5일 접속(`login_on_0505`), 데스티니 해방 퀘스트 완료 여부(`destiny_quest_clear`)를 검사하는 함수만 구현되어 있음

### ✅ 보상 요청 이력 조회

- `USER`: 자신의 요청 이력
- `OPERATOR`, `AUDITOR`, `ADMIN`: 전체 유저 이력 조회
- `eventId`, `status` 기준 선택적 필터링 가능

---

## 📦 API 구조

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
    guards/
    decorators/
    interfaces/
```

---

## 🏁 마무리

이 프로젝트는 NestJS의 모듈성, MSA 구조, 인증/인가 관리, 조건 기반 보상 시스템 설계의 실전 감각을 익히기 위한 과제로 시작되었으며, 실무에서의 아키텍처 설계와 API 보안/확장성을 고려하여 설계되었습니다.

필요 시, CI/CD, 테스트 코드, 관리자용 UI도 확장 가능합니다.
