// src/config/dayjsConfig.js
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

// Cargar los plugins de dayjs
dayjs.extend(utc);
dayjs.extend(timezone);

// Configurar la zona horaria de Chile
dayjs.tz.setDefault("America/Santiago");

export default dayjs;
