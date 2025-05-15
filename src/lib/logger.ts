/**
 * Sistema de logging para la aplicación de formularios artísticos
 * Permite registrar eventos, información y errores
 */

// Niveles de logging
export enum LogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG'
}

// Interfaz para un evento de log
export interface LogEvent {
  timestamp: string;
  level: LogLevel;
  message: string;
  details?: any;
}

// Clase principal del logger
export class Logger {
  private static instance: Logger;
  private logs: LogEvent[] = [];
  private maxLogSize = 1000; // Número máximo de logs en memoria

  // Constructor privado para singleton
  private constructor() {
    // Inicializamos logs
    this.logs = [];
    console.log('Logger inicializado');
  }

  // Obtener instancia única
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  // Método principal para registrar logs
  public log(level: LogLevel, message: string, details?: any): void {
    const logEvent: LogEvent = {
      timestamp: new Date().toISOString(),
      level,
      message,
      details
    };

    // Añadir al array de logs
    this.logs.push(logEvent);

    // Limitar el tamaño del array de logs
    if (this.logs.length > this.maxLogSize) {
      this.logs.shift();
    }

    // Imprimir en consola
    this.printToConsole(logEvent);

    // Si es un error, guardar en "disco" (simulado)
    if (level === LogLevel.ERROR) {
      this.saveToFile(logEvent);
    }
  }

  // Métodos específicos para cada nivel
  public info(message: string, details?: any): void {
    this.log(LogLevel.INFO, message, details);
  }

  public warning(message: string, details?: any): void {
    this.log(LogLevel.WARNING, message, details);
  }

  public error(message: string, details?: any): void {
    this.log(LogLevel.ERROR, message, details);
  }

  public debug(message: string, details?: any): void {
    this.log(LogLevel.DEBUG, message, details);
  }

  // Imprimir en consola
  private printToConsole(logEvent: LogEvent): void {
    const { timestamp, level, message, details } = logEvent;
    const detailsStr = details ? JSON.stringify(details) : '';
    
    switch (level) {
      case LogLevel.INFO:
        console.info(`${timestamp} [${level}] ${message}`, details || '');
        break;
      case LogLevel.WARNING:
        console.warn(`${timestamp} [${level}] ${message}`, details || '');
        break;
      case LogLevel.ERROR:
        console.error(`${timestamp} [${level}] ${message}`, details || '');
        break;
      case LogLevel.DEBUG:
        console.debug(`${timestamp} [${level}] ${message}`, details || '');
        break;
    }
  }

  // Simular guardado en archivo
  private saveToFile(logEvent: LogEvent): void {
    // En un entorno real, escribiríamos al sistema de archivos
    // o enviaríamos a un servicio de logs como Sentry, LogRocket, etc.
    
    const logEntry = `${logEvent.timestamp} [${logEvent.level}] ${logEvent.message} ${
      logEvent.details ? JSON.stringify(logEvent.details) : ''
    }\n`;
    
    console.log('Guardando error en archivo de logs:', logEntry);
    
    // En un entorno Svelte normal, utilizaríamos una API REST o
    // un endpoint específico para guardar logs en el servidor
    try {
      localStorage.setItem('lastErrorLog', logEntry);
      
      // Obtener logs existentes
      const existingLogs = localStorage.getItem('errorLogs') || '';
      
      // Añadir nuevo log y guardar
      localStorage.setItem('errorLogs', existingLogs + logEntry);
    } catch (e) {
      // En caso de error, al menos aseguramos que quede en consola
      console.error('Error al guardar log en localStorage:', e);
    }
  }

  // Obtener todos los logs
  public getLogs(): LogEvent[] {
    return [...this.logs];
  }

  // Obtener logs filtrados por nivel
  public getLogsByLevel(level: LogLevel): LogEvent[] {
    return this.logs.filter(log => log.level === level);
  }

  // Obtener logs de errores
  public getErrorLogs(): LogEvent[] {
    return this.getLogsByLevel(LogLevel.ERROR);
  }

  // Limpiar logs
  public clearLogs(): void {
    this.logs = [];
  }
}

// Exportar una instancia del logger para usar en toda la aplicación
export const logger = Logger.getInstance(); 