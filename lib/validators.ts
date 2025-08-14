/* eslint-disable @typescript-eslint/no-explicit-any */
export type ValidationError = { entity: string; row: number; column: string; message: string };

export function validateAll(clients: any[], workers: any[], tasks: any[]): ValidationError[] {
  const errors: ValidationError[] = [];

  
  const requiredClientCols = ["ClientID", "ClientName", "PriorityLevel", "RequestedTaskIDs", "AttributesJSON"];
  errors.push(...missingCols(clients, requiredClientCols, "clients"));
  errors.push(...duplicateIds(clients, "ClientID", "clients"));

  clients.forEach((row, i) => {
    
    const val = parseInt(row.PriorityLevel);
    if (isNaN(val) || val < 1 || val > 5)
      errors.push({ entity: "clients", row: i, column: "PriorityLevel", message: "Must be 1–5" });

    
    const reqTasks = row.RequestedTaskIDs?.split(",").map((x: string) => x.trim()) || [];
    reqTasks.forEach((tid: string) => {
      if (!tasks.some(t => t.TaskID === tid)) {
        errors.push({ entity: "clients", row: i, column: "RequestedTaskIDs", message: `Unknown task ID ${tid}` });
      }
    });

    
    if (row.AttributesJSON) {
      try {
        JSON.parse(row.AttributesJSON);
      } catch {
        errors.push({
          entity: "clients",
          row: i,
          column: "AttributesJSON",
          message: "Invalid JSON format"
        });
      }
    }
  });


  const requiredTaskCols = ["TaskID", "TaskName", "Duration", "RequiredSkills", "MaxConcurrent"];
  errors.push(...missingCols(tasks, requiredTaskCols, "tasks"));
  errors.push(...duplicateIds(tasks, "TaskID", "tasks"));

  tasks.forEach((row, i) => {
    const dur = parseInt(row.Duration);
    if (isNaN(dur) || dur < 1)
      errors.push({ entity: "tasks", row: i, column: "Duration", message: "Must be ≥1" });

    
    const skills = row.RequiredSkills?.split(",") || [];
    skills.forEach((skl: string) => {
      const hasWorker = workers.some(w =>
        w.Skills?.split(",").map((s: string) => s.trim()).includes(skl.trim())
      );
      if (!hasWorker) {
        errors.push({ entity: "tasks", row: i, column: "RequiredSkills", message: `No worker has skill ${skl}` });
      }
    });

    
    const qualifiedWorkers = workers.filter(w =>
      skills.every((skl: string) =>
        w.Skills?.split(",").map((s: string) => s.trim()).includes(skl.trim())
      )
    );
    const maxConc = parseInt(row.MaxConcurrent);
    if (!isNaN(maxConc) && maxConc > qualifiedWorkers.length) {
      errors.push({
        entity: "tasks",
        row: i,
        column: "MaxConcurrent",
        message: `MaxConcurrent ${maxConc} > qualified workers (${qualifiedWorkers.length})`
      });
    }
  });

  const requiredWorkerCols = ["WorkerID", "WorkerName", "Skills", "AvailableSlots", "MaxLoadPerPhase"];
  errors.push(...missingCols(workers, requiredWorkerCols, "workers"));
  errors.push(...duplicateIds(workers, "WorkerID", "workers"));

  workers.forEach((row, i) => {
    
    try {
      const slots = JSON.parse(row.AvailableSlots);
      if (!Array.isArray(slots) || slots.some(s => typeof s !== "number"))
        throw new Error();
    
      const maxLoad = parseInt(row.MaxLoadPerPhase);
      if (!isNaN(maxLoad) && slots.length < maxLoad) {
        errors.push({
          entity: "workers",
          row: i,
          column: "AvailableSlots",
          message: `Available slots (${slots.length}) less than MaxLoadPerPhase (${maxLoad})`
        });
      }
    } catch {
      errors.push({ entity: "workers", row: i, column: "AvailableSlots", message: "Must be JSON array of numbers" });
    }
  });

  
  const phaseSlots: Record<number, number> = {};
  workers.forEach(w => {
    try {
      JSON.parse(w.AvailableSlots).forEach((phase: number) => {
        phaseSlots[phase] = (phaseSlots[phase] || 0) + 1;
      });
    } catch {}
  });

  const phaseLoad: Record<number, number> = {};
  tasks.forEach(t => {
    try {
      JSON.parse(t.PreferredPhases || "[]").forEach((phase: number) => {
        phaseLoad[phase] = (phaseLoad[phase] || 0) + parseInt(t.Duration) || 0;
      });
    } catch {}
  });

  Object.keys(phaseLoad).forEach(phase => {
    const load = phaseLoad[Number(phase)];
    const slots = phaseSlots[Number(phase)] || 0;
    if (load > slots) {
      errors.push({
        entity: "tasks",
        row: -1,
        column: "PreferredPhases",
        message: `Phase ${phase}: load (${load}) exceeds available worker slots (${slots})`
      });
    }
  });



  return errors;
}


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
