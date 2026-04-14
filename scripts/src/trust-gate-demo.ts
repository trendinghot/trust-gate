const BASE_URL = process.env.TRUST_GATE_URL ?? "http://localhost:80/trust-gate";

async function demo() {
  console.log("=== Trust Gate Demo ===\n");

  console.log("1. Sending VALID action claim (fresh, allowed action type, complete schema)...\n");
  const validAction = await fetch(`${BASE_URL}/validate-action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      actionType: "service-restart",
      systemId: "realityos-node-1",
      callerId: "demo-runner",
      timestamp: new Date().toISOString(),
      payload: {
        service: "web-frontend",
        reason: "memory leak detected",
        pid: 12345,
      },
    }),
  });
  const validResult = await validAction.json();
  console.log("Response:", JSON.stringify(validResult, null, 2));
  console.log(`Status: ${validResult.status}\n`);

  console.log("---\n");

  console.log("2. Sending FALSE recovery claim (before/after states identical — nothing changed)...\n");
  const falseRecovery = await fetch(`${BASE_URL}/validate-recovery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      actionType: "service-restart",
      systemId: "realityos-node-1",
      callerId: "demo-runner",
      timestamp: new Date().toISOString(),
      beforeState: {
        status: "unhealthy",
        errorCount: 42,
        lastCheck: "2025-01-01T00:00:00Z",
      },
      afterState: {
        status: "unhealthy",
        errorCount: 42,
        lastCheck: "2025-01-01T00:00:00Z",
      },
      payload: {
        service: "web-frontend",
        claimedFix: "restarted service",
      },
    }),
  });
  const falseResult = await falseRecovery.json();
  console.log("Response:", JSON.stringify(falseResult, null, 2));
  console.log(`Status: ${falseResult.status}\n`);

  console.log("---\n");

  console.log("3. Sending STALE action claim (timestamp 10 minutes ago)...\n");
  const staleTime = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const staleAction = await fetch(`${BASE_URL}/validate-action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      actionType: "service-restart",
      systemId: "realityos-node-1",
      callerId: "demo-runner",
      timestamp: staleTime,
      payload: { service: "api-server" },
    }),
  });
  const staleResult = await staleAction.json();
  console.log("Response:", JSON.stringify(staleResult, null, 2));
  console.log(`Status: ${staleResult.status}\n`);

  console.log("---\n");

  console.log("4. Sending VALID recovery claim (real state change)...\n");
  const validRecovery = await fetch(`${BASE_URL}/validate-recovery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      actionType: "service-restart",
      systemId: "realityos-node-1",
      callerId: "demo-runner",
      timestamp: new Date().toISOString(),
      beforeState: {
        status: "unhealthy",
        errorCount: 42,
        uptime: 0,
      },
      afterState: {
        status: "healthy",
        errorCount: 0,
        uptime: 5,
      },
      payload: {
        service: "web-frontend",
        fix: "restarted and verified",
      },
    }),
  });
  const validRecoveryResult = await validRecovery.json();
  console.log("Response:", JSON.stringify(validRecoveryResult, null, 2));
  console.log(`Status: ${validRecoveryResult.status}\n`);

  console.log("---\n");

  console.log("5. Checking metrics...\n");
  const metrics = await fetch(`${BASE_URL}/metrics/validations`);
  const metricsResult = await metrics.json();
  console.log("Metrics:", JSON.stringify(metricsResult, null, 2));

  console.log("\n=== Demo Complete ===");
}

demo().catch((err) => {
  console.error("Demo failed:", err);
  process.exit(1);
});
