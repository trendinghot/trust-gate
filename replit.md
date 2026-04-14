# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (ESM bundle)

## Services

### API Server (`artifacts/api-server`)
- General-purpose API server at `/api`
- Port 8080

### Trust Gate (`artifacts/trust-gate`)
- Standalone deterministic enforcement layer for autonomous systems
- Validates action and recovery claims, returns VALID / REJECTED / UNKNOWN verdicts
- Independent service at `/trust-gate` on port 8082
- Validation pipeline: input normalization → signature check → context reconstruction → signal evaluation → confidence assessment → decision engine → evidence packaging → DB write
- Rule engine with modular rules: schema-completeness, timestamp-freshness, action-type-allowlist, state-diff
- Decision logic: any REJECTED → REJECTED; low confidence → UNKNOWN; all VALID + high confidence → VALID
- Evidence stored in PostgreSQL (`validation_evidence` table) with SHA-256 input hashes
- Endpoints:
  - POST /trust-gate/validate-action
  - POST /trust-gate/validate-recovery
  - GET /trust-gate/evidence/:id
  - GET /trust-gate/metrics/validations
  - GET /trust-gate/healthz

## Database Schema

### validation_evidence
- id (uuid, PK)
- verdict (enum: VALID, REJECTED, UNKNOWN)
- confidence (enum: HIGH, LOW)
- reason (text)
- input_hash (text, SHA-256)
- action_type (text)
- caller_id (text, nullable)
- request_payload (jsonb)
- rule_results (jsonb)
- pipeline_context (jsonb, nullable)
- created_at (timestamptz)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally
- `pnpm --filter @workspace/trust-gate run dev` — run Trust Gate locally
- `pnpm --filter @workspace/scripts run trust-gate-demo` — run Trust Gate demo scenario

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
