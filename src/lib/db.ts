import mysql from 'mysql2/promise';
import { logger, LogLevel } from './logger';

// Configuración de la conexión a la base de datos
const dbConfig = {
  host: process.env.MYSQL_HOST!,
  port: parseInt(process.env.MYSQL_PORT!),
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: { rejectUnauthorized: false },
  queueLimit: 0
};

// Pool de conexiones para reutilizar conexiones
const pool = mysql.createPool(dbConfig);

/**
 * Ejecuta una consulta SQL con parámetros
 * @param sql Consulta SQL
 * @param params Parámetros para la consulta
 * @returns Resultado de la consulta
 */
export async function query(sql: string, params?: any[]): Promise<any> {
  try {
    const [rows] = await pool.query(sql, params ?? []);
    return rows;
  } catch (error) {
    logger.error('Error en consulta a la base de datos', { sql, params, error });
    throw error;
  }
}

/**
 * Insertar datos y obtener el ID insertado
 * @param table Nombre de la tabla
 * @param data Objeto con los datos a insertar
 * @returns ID del registro insertado
 */
export async function insert(table: string, data: Record<string, any>): Promise<number> {
  try {
    const keys = Object.keys(data);
    const placeholders = Array(keys.length).fill('?').join(', ');
    const values = Object.values(data);
    
    const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
    const [result] = await pool.query(sql, values) as any;
    
    return result.insertId;
  } catch (error) {
    logger.error('Error al insertar datos', { table, data, error });
    throw error;
  }
}

/**
 * Actualizar datos en una tabla
 * @param table Nombre de la tabla
 * @param id ID del registro a actualizar
 * @param data Datos a actualizar
 * @returns Número de filas afectadas
 */
export async function update(table: string, id: number, data: Record<string, any>): Promise<number> {
  try {
    const keys = Object.keys(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];
    
    const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
    const [result] = await pool.query(sql, values) as any;
    
    return result.affectedRows;
  } catch (error) {
    logger.error('Error al actualizar datos', { table, id, data, error });
    throw error;
  }
}

/**
 * Obtener un registro por ID
 * @param table Nombre de la tabla
 * @param id ID del registro
 * @returns Registro encontrado o null
 */
export async function getById(table: string, id: number): Promise<any> {
  try {
    const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ?`, [id]) as any;
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    logger.error('Error al obtener registro por ID', { table, id, error });
    throw error;
  }
}

/**
 * Obtener registros por condiciones
 * @param table Nombre de la tabla
 * @param conditions Condiciones para filtrar (objeto de pares clave-valor)
 * @returns Lista de registros que cumplen las condiciones
 */
export async function getByConditions(table: string, conditions: Record<string, any>): Promise<any[]> {
  try {
    const keys = Object.keys(conditions);
    const whereClause = keys.map(key => `${key} = ?`).join(' AND ');
    const values = Object.values(conditions);
    
    const sql = `SELECT * FROM ${table} WHERE ${whereClause}`;
    const [rows] = await pool.query(sql, values) as any;
    
    return rows;
  } catch (error) {
    logger.error('Error al obtener registros por condiciones', { table, conditions, error });
    throw error;
  }
}

/**
 * Ejecutar transacción en la base de datos
 * @param callback Función que recibe la conexión y ejecuta operaciones dentro de la transacción
 * @returns Resultado de la transacción
 */
export async function transaction<T>(callback: (connection: mysql.Connection) => Promise<T>): Promise<T> {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    logger.error('Error en transacción de base de datos', { error });
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Insertar log en la base de datos
 * @param nivel Nivel del log
 * @param mensaje Mensaje del log
 * @param detalles Detalles adicionales
 * @param ip Dirección IP
 */
export async function insertLog(nivel: LogLevel, mensaje: string, detalles?: any, ip?: string): Promise<void> {
  try {
    const data = {
      nivel,
      mensaje,
      detalles: detalles ? JSON.stringify(detalles) : null,
      ip: ip || null
    };
    
    await insert('logs_sistema', data);
  } catch (error) {
    console.error('Error al guardar log en la base de datos:', error);
  }
}

// Verificar la conexión al inicializar
(async () => {
  try {
    const connection = await pool.getConnection();
    connection.release();
    logger.info('Conexión a la base de datos establecida');
  } catch (error) {
    logger.error('Error al conectar con la base de datos', { error });
  }
})(); 
