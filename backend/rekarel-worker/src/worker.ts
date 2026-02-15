import { redis } from "./redis"
import {RuntimeErrorCodes, compile, World } from "@rekarel/core"
import { loadTestcases } from "./loader/testcases"
import { compareOutput } from "./evaluator/compare"
import { SubmissionJob, SubmissionUpdate } from "./types"
import { DOMParser } from "@xmldom/xmldom" 
import { updateSubmissionStatus } from "./db"
import { start } from "node:repl"

const ERRORCODES = {
    "WALL": 'Karel ha chocado con un muro!',
    "WORLDUNDERFLOW": 'Karel intentó tomar zumbadores en una posición donde no había!',
    "BAGUNDERFLOW": 'Karel intentó dejar un zumbador pero su mochila estaba vacía!',
    "INSTRUCTION": 'Karel ha superado el límite de instrucciones!',
    "STACK": 'La pila de karel se ha desbordado!',
};

function decodeRuntimeError(error: string):string {
    if (error === "INSTRUCTION") {
        return "Karel ha superado el límite de instrucciones!";
    }
    if (error === "INSTRUCTION_LEFT") {
        return "Karel ha superado el límite de gira izquierda (turnleft)!";
    }
    if (error === "INSTRUCTION_FORWARD") {
        return "Karel ha superado el límite de avanza (move)!";
    }
    if (error === "INSTRUCTION_PICKBUZZER") {
        return "Karel ha superado el límite de coge-zumbador (pickbeeper)!";    
    }
    if (error === "INSTRUCTION_LEAVEBUZZER") {
        return "Karel ha superado el límite de deja-zumbador (putbeeper)!";
    }
    if (error === "STACK") {
        return "La pila de karel se ha desbordado!"
    }
    if (error === "CALLMEMORY") {
        return "Límite de parámetros superados!";
    }
    if (error === "STACKMEMORY") {
        return "El límite de memoria del stack ha sido superado.";
    }
    if (error === "INTEGEROVERFLOW") {
        return "Se superó el límite superior numérico de 999,999,999.";
    }
    if (error === "INTEGERUNDERFLOW") {
        return "Se superó el límite inferior numérico de -999,999,999.";
    }
    if (error === "WORLDOVERFLOW") {
        return "Se superó el límite de zumbadores en una casilla, no debe haber más de 999,999,999 zumbadores.";
    }
    if (error in ERRORCODES) {
        return ERRORCODES[error as keyof typeof ERRORCODES]
    }
    else {
        return `Karel tuvo un error de ejecución desconocido: ${error}`;
    }
}

export async function startWorker() {
  console.log("Worker iniciado - Esperando envíos de Karel...");

  while (true) {
    try {
      const jobData = await redis.brPop("submission_queue", 0);
      if (!jobData) continue;

      const job: SubmissionJob = JSON.parse(jobData.element);
      console.log(`⚙️ Evaluando: ${job.submissionId}`);

      // 1. Cambiar estado a JUDGING en Postgres
      await updateSubmissionStatus(job.submissionId, { status: 'judging' });

      let verdict: 'AC' | 'WA' | 'TLE' | 'RE' | 'CE' = "AC";
      let failCase: string | undefined;
      let error: string | undefined;

      // 2. Compilar código
      const [program] = compile(job.sourceCode, false);
      let maxRuntimeMs = 0;
      let maxMemoryMb = 0.0;
      let runtimeMs = 0;
      const startEval = Date.now();

      if (!program) {
        verdict = "CE"; // Compilation Error
        error = "Error de sintaxis: Revisa tu código Rekarel Java.";
      } else {
        // 3. Evaluar casos de prueba
        const testcases = await loadTestcases(job.problemId);

        for (const tc of testcases) {
          const start = Date.now();
          const xml = new DOMParser().parseFromString(tc.input, "text/xml");
          const world = new World(1, 1);
          world.load(xml);
          
          const runtime = world.runtime;
          runtime.load(program);

          while (runtime.step()) {
            maxMemoryMb = Math.max(maxMemoryMb, runtime.state.stack.byteLength / (1024 * 1024));
            if (maxMemoryMb > job.memoryLimitMb) break;
          }

          maxRuntimeMs = Math.max(maxRuntimeMs, Date.now() - start);

          if (runtime.state.error) {
            // TLE si el código de error indica límite de instrucciones
            verdict = RuntimeErrorCodes[runtime.state.error] >= 48 ? "TLE" : "RE";
            error = decodeRuntimeError(runtime.state.error);
            failCase = tc.name;
            break;
          }

          if (maxRuntimeMs > job.timeLimitMs) {
            verdict = "TLE";
            error = "Karel excedió el tiempo límite de ejecución.";
            failCase = tc.name;
            break;
          }

          if (maxMemoryMb > job.memoryLimitMb) {
            verdict = "RE";
            error = "Karel excedió el límite de memoria.";
            failCase = tc.name;
            break;
          }

          if (!compareOutput(world.output(), tc.expected)) {
            verdict = "WA";
            failCase = tc.name;
            break;
          }
        }
      }

      runtimeMs = Date.now() - startEval;
      // 4. Actualización FINAL en la Base de Datos
      await updateSubmissionStatus(job.submissionId, {
        status: 'completed',
        verdict: verdict,
        runtime_ms: maxRuntimeMs,
        error_message: error || null,
        failed_testcase: failCase || null
      });

      console.log(`✅ Finalizado: ${verdict} en ${runtimeMs}ms`);

    } catch (err) {
      console.error("❌ Error crítico en el loop del worker:", err);
    }
  }
}