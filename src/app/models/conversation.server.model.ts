import {getPool} from '../../config/db';
import Logger from '../../config/logger';
import {ResultSetHeader, RowDataPacket} from 'mysql2'

/**
 * Retrieves all conversations from the database.
 *
 * Executes a SQL query on `lab2_conversations`, converts each returned row
 * into a `Conversation` object, and returns the results as an array.
 *
 * @returns Promise<Conversation[]> A promise resolving to a list of conversations.
 */
const getAll = async (): Promise<Conversation[]> => {
    Logger.info('Getting all conversations from database');
    const conn = await getPool().getConnection();
    const query = 'select * from lab2_conversations';
    const [rows] = await conn.query<RowDataPacket[]>(query);
    conn.release();
    return rows.map(row => ({
        convo_id: row.convo_id,
        convo_name: row.convo_name,
        created_on: row.created_on,
    }))
}

/**
 * Retrieves a conversation from the database.
 *
 * Executes a SQL query on `lab2_conversations`, converts each returned row
 * into a `Conversation` object, and returns the results as an array. This will return a single item array
 * as there should only be one matching entry to the id
 *
 * @returns Promise<Conversation[]> A promise resolving to a list of conversations.
 */
const getOne = async (id: number): Promise<Conversation[]> => {
    Logger.info(`Getting conversation ${id} from the database`)
    const conn = await getPool().getConnection();
    const query = 'select * from lab2_conversations where convo_id = ?';
    const [rows] = await conn.query<RowDataPacket[]>(query, [id]);
    conn.release();

    // Possible to return the single conversation object?!
    return rows.map(row => ({
        convo_id: row.convo_id,
        convo_name: row.convo_name,
        created_on: row.created_on,
    }))
};

/**
 * Inserts new conversation into the database.
 *
 * Executes a SQL query on `lab2_conversations`, inserting a new row
 *
 * @returns Promise<number> A promise resolving to a number.
 */
const insert = async (convo_name: string, created: Date): Promise<number> => {
    Logger.info(`Adding conversation ${convo_name} to the database`);
    const conn = await getPool().getConnection();
    const query = 'insert into lab2_conversations (convo_name, created_on) values (?, ?)';
    const [result] = await conn.query<ResultSetHeader>(query, [convo_name, created]);
    conn.release();
    return result.insertId;
}

/**
 * Alters conversation in the database.
 *
 * Executes a SQL query on `lab2_conversations`, updating a pre-existing entry in the DB
 *
 * @returns Promise<number> A promise resolving to a number.
 */
const alter = async (newConvoName: string, convo_id: number): Promise<number> => {
    Logger.info(`Updating conversation ${convo_id} to ${newConvoName}`)
    const conn = await getPool().getConnection();

    const query = 'update lab2_conversations set convo_name=? where convo_id = ?';

    const [result] = await conn.query<ResultSetHeader>(query, [newConvoName, convo_id]);
    conn.release();

    return result.affectedRows;
}

/**
 * Removes a conversation from the database.
 *
 * Executes a SQL query on `lab2_conversations`, deleting a pre-existing row
 *
 * @returns Promise<number> A promise resolving to a number.
 */
const remove = async (convo_id: number): Promise<number> => {
    Logger.info(`Removing conversation ${convo_id} from the database`);
    const conn = await getPool().getConnection();

    try {
        // Delete all messages associated with the conversation
        await conn.query('DELETE FROM lab2_messages WHERE convo_id = ?', [convo_id]);

        // Delete the conversation
        const [result] = await conn.query<ResultSetHeader>(
            'DELETE FROM lab2_conversations WHERE convo_id = ?',
            [convo_id]
        );

        return result.affectedRows;
    } finally {
        conn.release();
    }
}

export {getAll, getOne, insert, alter, remove}