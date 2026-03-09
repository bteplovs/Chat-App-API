import { getPool } from '../../config/db';
import Logger from '../../config/logger';
import {ResultSetHeader, RowDataPacket} from 'mysql2'

/**
 * Retrieves all Users from the database.
 *
 * Executes a SQL query on `lab2_users`, converts each returned row
 * into a `User` object, and returns the results as an array.
 *
 * @returns Promise<Conversation[]> A promise resolving to a list of Users.
 */
const getAll = async (): Promise<User[]> => {
    Logger.info('Getting all users from the database')
    const conn = await getPool().getConnection()
    const query = 'select * from lab2_users';
    const [ rows ] = await conn.query<RowDataPacket[]>( query );
    conn.release();
    return rows.map(row => ({
        user_id: row.user_id,
        username: row.username,
        email: row.email
    }));
}

/**
 * Retrieves a single User from the database.
 *
 * Executes a SQL query on `lab2_users`, converts each returned row
 * into a `User` object, and returns the results as an array. This will return a single item array
 * as there should only be one matching entry to the id
 *
 * @returns Promise<Conversation[]> A promise resolving to a list of User.
 */
const getOne = async (id: number): Promise<User[]> => {
    Logger.info(`Getting user ${id} from the database`)
    const conn = await getPool().getConnection()
    const query = 'select * from lab2_users where user_id = ?';
    const [ rows ] = await conn.query<RowDataPacket[]>( query, [ id ] );
    conn.release();
    return rows.map(row => ({
        user_id: row.user_id,
        username: row.username,
        email: row.email
    }));
};

/**
 * Inserts new user into the database.
 *
 * Executes a SQL query on `lab2_users`, inserting a new row
 *
 * @returns Promise<number> A promise resolving to a number.
 */
const insert = async (username: string): Promise<number> => {
    Logger.info(`Adding user ${username} to the database`);
    const conn = await getPool().getConnection()
    const query = 'insert into lab2_users (username) values ( ? )';
    const [ result ] = await conn.query<ResultSetHeader>(query, [ username ]);
    conn.release();
    return result.insertId;
}

/**
 * Alters User in the database.
 *
 * Executes a SQL query on `lab2_users`, updating a pre-existing entry in the DB
 *
 * @returns Promise<number> A promise resolving to a number of affected rows.
 */
const alter = async (newUsername: string, id: number): Promise<number> => {
    Logger.info(`Updating username of user ${id} to: ${newUsername}`);
    const conn = await getPool().getConnection()

    const query = 'update lab2_users set `username` = ? where user_id = ?'

    const [ result ] = await conn.query<ResultSetHeader>( query, [newUsername, id ] );
    conn.release();

    return result.affectedRows;
}

/**
 * Removes a user from the database.
 *
 * Executes a SQL query on `lab2_users`, deleting a pre-existing row
 *
 * @returns Promise<number> A promise resolving to a number of affected rows.
 */
const remove = async (id: number): Promise<number> => {
    Logger.info(`Removing user ${id} from the database`);
    const conn = await getPool().getConnection()

    const query = 'delete from lab2_users where user_id = ?';

    const [ result ] = await conn.query<ResultSetHeader>( query, [ id ] );
    conn.release();

    return result.affectedRows;
}

export { getAll, getOne, insert, alter, remove }