/* eslint-disable @typescript-eslint/no-explicit-any */
export type ValidationError = { entity: string; row: number; column: string; message: string };

export function validateAll(clients: any[], workers: any[], tasks: any[]): ValidationError[] {
  const errors: ValidationError[] = [];

  // === Clients ===
  const requiredClientCols = ["ClientID", "ClientName", "PriorityLevel", "RequestedTaskIDs"];
  errors.push(...missingCols(clients, requiredClientCols, "clients"));

  errors.push(...duplicateIds(clients, "ClientID", "clients"));

  clients.forEach((row, i) => {
    const val = parseInt(row.PriorityLevel);
    if (isNaN(val) || val < 1 || val > 5)
      errors.push({ entity: "clients", row: i, column: "PriorityLevel", message: "Must be 1–5" });

    const reqTasks = row.RequestedTaskIDs?.split(",").map((x: string) => x.trim()) || [];
    reqTasks.forEach((tid: any) => {
      if (!tasks.some(t => t.TaskID === tid)) {
        errors.push({ entity: "clients", row: i, column: "RequestedTaskIDs", message: `Unknown task ID ${tid}` });
      }
    });
  });

  // === Tasks ===
  const requiredTaskCols = ["TaskID", "TaskName", "Duration", "RequiredSkills", "MaxConcurrent"];
  errors.push(...missingCols(tasks, requiredTaskCols, "tasks"));
  errors.push(...duplicateIds(tasks, "TaskID", "tasks"));

  tasks.forEach((row, i) => {
    if (parseInt(row.Duration) < 1)
      errors.push({ entity: "tasks", row: i, column: "Duration", message: "Must be ≥1" });
    const skills = row.RequiredSkills?.split(",") || [];
    skills.forEach((skl: string) => {
      if (!workers.some(w => w.Skills?.split(",").map((s: string) => s.trim()).includes(skl.trim()))) {
        errors.push({ entity: "tasks", row: i, column: "RequiredSkills", message: `No worker has skill ${skl}` });
      }
    });
  });

  // === Workers ===
  const requiredWorkerCols = ["WorkerID", "WorkerName", "Skills", "AvailableSlots", "MaxLoadPerPhase"];
  errors.push(...missingCols(workers, requiredWorkerCols, "workers"));
  errors.push(...duplicateIds(workers, "WorkerID", "workers"));

  workers.forEach((row, i) => {
    try {
      const slots = JSON.parse(row.AvailableSlots);
      if (!Array.isArray(slots) || slots.some(s => typeof s !== "number"))
        throw new Error();
    } catch {
      errors.push({ entity: "workers", row: i, column: "AvailableSlots", message: "Must be JSON array of numbers" });
    }
  });

  return errors;
}

// === helpers ===
function missingCols(data: any[], needed: string[], entity: string): ValidationError[] {
  const errs: ValidationError[] = [];
  if (!data[0]) return needed.map(col => ({ entity, row: -1, column: col, message: `Missing required column` }));
  needed.forEach(col => {
    if (!(col in data[0])) {
      errs.push({ entity, row: -1, column: col, message: `Missing required column` });
    }
  });
  return errs;
}

function duplicateIds(data: any[], key: string, entity: string): ValidationError[] {
  const seen = new Set();
  const errs: ValidationError[] = [];
  data.forEach((r, i) => {
    if (seen.has(r[key])) {
      errs.push({ entity, row: i, column: key, message: `Duplicate ${key}` });
    }
    seen.add(r[key]);
  });
  return errs;
}
