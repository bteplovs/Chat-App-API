import * as messages from '../models/message.server.model';
import Logger from "../../config/logger";
import {Request, Response} from "express";

/**
 * GET method. returns all messages of a specific conversation
 *
 * @param req
 * @param res
 */
const list = async (req: Request, res: Response): Promise<void> => {
    Logger.http(`GET all messages of conversation ${req.params.id}`);

    const conversation_id = parseInt(<string>req.params.id, 10);

    try {
        const result = await messages.getAll(conversation_id);

        if (result.length === 0) {
            res.status(404).send("No conversation with id " + conversation_id);
        }


        res.status(200).send(result);
    } catch (err) {
        res.status(500)
            .send(`Error getting conversations ${err}`);
    }
}

/**
 * POST method. creates a new message in the database
 *
 * @param req
 * @param res
 */
const create = async (req: Request, res: Response): Promise<void> => {
    Logger.http(`POST create a message from ${req.body.user_id}`)

    const message_content = req.body.message;
    const user_id = req.body.user_id;
    const conversation_id = parseInt(<string>req.params.id, 10);
    const created_on = new Date();

    // check convo id is valid aswell
    if (!req.body.hasOwnProperty("user_id") || !req.body.hasOwnProperty("message")) {
        res.status(400).send('Please provide id and message fields');
        return;
    }
    if (req.body.message.length === 0) {
        res.status(400).send('Message is required');
        return;
    }

    try {
        const insertId = await messages.insert(conversation_id, user_id, created_on, message_content);
        if ( !insertId ) {
            res.status(400).send('Invalid input');
            return;
        }
        res.status(201).send({"message_id": insertId});
    } catch (err) {
        res.status(500)
            .send(`Internal Server Error: ${err}`);
    }
}

/**
 * GET method. returns a single message from a convo
 *
 * @param req
 * @param res
 */
const read = async (req: Request, res: Response): Promise<void> => {
    Logger.http(`GET single message id: ${req.params.mid}`)
    const messageId = typeof req.params.mid === 'string' ? req.params.mid : req.params.mid[0];
    const convoId = typeof req.params.id === 'string' ? req.params.id : req.params.id[0]
    try {
        const result = await messages.getOne(parseInt(messageId, 10), parseInt(convoId, 10));
        if (result.length === 0) {
            res.status(404).send(`Conversation Not Found`);
        } else {
            res.status(200).send( result[0] );
        }
    } catch (err) {
        res.status(500)
            .send(`Error reading conversation id: ${messageId}: ${err}`);
    }
}

export { list, create, read };