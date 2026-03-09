import * as conversations from '../models/conversation.server.model';
import Logger from "../../config/logger";
import {Request, Response} from "express";

/**
 * GET method. Returns all conversations stored in the DB
 *
 * @param req
 * @param res
 */
const list = async (req: Request, res: Response): Promise<void> => {
    Logger.http('GET all conversations of conversations');
    try {
        const result = await conversations.getAll();
        res.status(200).send(result);
    } catch (err) {
        res.status(500)
            .send(`Error getting conversations ${err}`);
    }
}

/**
 * POST method. Creates a new conversation to the DB
 *
 * @param req
 * @param res
 */
const create = async (req: Request, res: Response): Promise<void> => {
    Logger.http(`POST create a conversation with name ${req.body.convo_name}`);
    if ( ! req.body.hasOwnProperty("convo_name") ) {
        res.status(400).send('Please provide conversation field');
        return;
    }
    const convoName = req.body.convo_name;
    const created_on = new Date();
    try {
        const insertId = await conversations.insert(convoName, created_on)
        res.status(201).send({"convo_id": insertId});
    } catch (err) {
        res.status(500)
            .send(`Error creating conversation ${convoName}: ${err}`);
    }
}

/**
 * GET method. Returns a conversation based on ID
 *
 * @param req
 * @param res
 */
const read = async (req: Request, res: Response): Promise<void> => {
    Logger.http(`GET single conversation id: ${req.params.id}`)
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    try {
        const result = await conversations.getOne(parseInt(id, 10));
        if (result.length === 0) {
            res.status(404).send(`User Not Found`);
        } else {
            res.status(200).send( result[0] );
        }
    } catch (err) {
        res.status(500)
        .send(`Error reading conversation id: ${id}: ${err}`);
    }
}

/**
 * PUT method. updates a conversation in the DB
 *
 * @param req
 * @param res
 */
const update = async (req: Request, res: Response): Promise<void> => {
    Logger.http(`PUT single conversation with name ${req.body.convo_name}`);
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const numericId = parseInt(id, 10);

    // Invalid input
    if ( ! req.body.hasOwnProperty("convo_name") ) {
        res.status(400).send('Please provide new conversation name field');
        return;
    }

    const newConvoName = req.body.convo_name;

    try {
        const updatedConversation = await conversations.alter(newConvoName, numericId);

        if (updatedConversation === 0) {
            res.status(404).send(`Conversation Not Found`);
            return;
        }

        res.status(200).send(`Successfully changed conversation name to: ${newConvoName}`);
    } catch (err) {
        res.status(500)
            .send(`ERROR updating user ${id}: ${err}`);
    }
}

/**
 * DELETE method. Deletes a specific book from the DB
 *
 * @param req
 * @param res
 */
const remove = async (req: Request, res: Response): Promise<void> => {
    Logger.http(`DELETE single conversation id ${req.params.id}`);

    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const numericId = parseInt(id, 10);

    try {
        const deletedConvo = await conversations.remove(numericId);

        if (deletedConvo === 0) {
            res.status(404).send(`User Not Found`);
            return;
        }

        res.status(200)
            .send(`Deleted conversation: ${id}`);
    } catch (err) {
        res.status(500)
            .send(`Error deleting conversation ${id}: ${err}`);
    }

}

export { list, create, read, update, remove };