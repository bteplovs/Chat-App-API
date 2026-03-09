import {getPool} from '../../config/db';
import Logger from '../../config/logger';
import {ResultSetHeader, RowDataPacket} from 'mysql2'


/**
 * Retrieves all messages from the database.
 *
 * Executes a SQL query on `lab2_messages`, converts each returned row
 * into a `Conversation` object, and returns the results as an array.
 *
 * @returns Promise<Message[]> A promise resolving to a list of messages.
 */
const getAll = async (conversation_id: number): Promise<Message[]> => {
    Logger.info('Getting all messages of conversation ${conversation_id}');
    const conn = await getPool().getConnection();
    const query = 'select * from lab2_messages where convo_id = ?';
    const [ rows ] = await conn.query<RowDataPacket[]>(query, [conversation_id]);
    conn.release();
    return rows.map(row => ({
        user_id: row.user_id,
        message: row.message,
        message_id: row.message_id,
        convo_id: row.convo_id,
        sent_time: row.sent_time
    }))
}

/**
 * Retrieves a conversation from the database.
 *
 * Executes a SQL query on `lab2_messages`, converts each returned row
 * into a `Message` object, and returns the results as an array. This will return a single item array
 * as there should only be one matching entry to the id
 *
 * @returns Promise<Message[]> A promise resolving to a list of messages.
 */
const getOne = async (messageId: number, convoId:number): Promise<Message[]> => {
    Logger.info(`Getting message ${messageId} from the database`);
    const conn = await getPool().getConnection();
    const query = 'select * from lab2_messages where message_id = ? and convo_id = ?';
    const [rows] = await conn.query<RowDataPacket[]>(query, [messageId, convoId]);
    conn.release();

    return rows.map(row => ({
        user_id: row.user_id,
        message: row.message,
        message_id: row.message_id,
        convo_id: row.convo_id,
        sent_time: row.sent_time
    }))
};

/**
 * Inserts new message into the database.
 *
 * Executes a SQL query on `lab2_messages`, inserting a new row
 *
 * @returns Promise<number> A promise resolving to an insert ID.
 */
const insert = async (convoId: number, userId: number, sentTime: Date, message_content: string): Promise<number> => {
    Logger.info(`Adding message from user ${userId} to the database`);
    const conn = await getPool().getConnection();

    const query = 'insert into lab2_messages (convo_id, user_id, sent_time, message) values (?, ?, ?, ?)';
    const [result] = await conn.query<ResultSetHeader>(query, [convoId, userId, sentTime, message_content]);
    conn.release();
    return result.insertId;
}

export {getAll, getOne, insert}