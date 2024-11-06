// scheduler.js
import cron from "node-cron";
import { anadirAutomaticoUser } from "../controllers/listaDeEspera.controller.js";


// Programar la tarea para que se ejecute cada hora
cron.schedule("0 * * * *", () => {
  console.log("Verificando lista de espera...");
  verificarListaDeEspera();
});
