import * as users from '../models/user.server.model';
import Logger from "../../config/logger";
import {Request, Response} from "express";

/**
 * GET method. returns all users
 *
 * @param req
 * @param res
 */
const list = async (req: Request, res: Response): Promise<void> => {
    Logger.http('GET all users')
    try {
        const result = await users.getAll();
        res.status(200).send(result);
    } catch (err) {
        res.status(500)
            .send(`Error getting users ${err}`)
    }
}

/**
 * POST method. creates a new user in the DB
 *
 * @param req
 * @param res
 */
const create = async (req: Request, res: Response): Promise<void> => {
    Logger.http(`Post create a user with username ${req.body.username}`) // .body.<> body attribute must match req json key
    if ( ! req.body.hasOwnProperty("username") ) {
        res.status(400).send('Please provide username field');
        return;
    }
    const username = req.body.username;
    try {
        const insertId = await users.insert( username );
        res.status(201).send({"user_id": insertId});
    } catch (err) {
        res.status(500)
            .send(`ERROR creating user ${username}: ${err}`);
    }
}

/**
 * GET method. returns a specific user by ID from DB
 *
 * @param req
 * @param res
 */
const read = async (req: Request, res: Response): Promise<void> => {
    Logger.http(`GET single user id: ${req.params.id}`)
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    try {
        const result = await users.getOne(parseInt(id, 10));
        if (result.length === 0) {
            res.status(404).send(`User Not Found`);
        } else {
            res.status(200).send( result[0] );
        }
    } catch (err) {
        res.status(500)
            .send(`ERROR reading user ${id}: ${err}`);
    }
}

/**
 * PUT method. updates the users username
 *
 * @param req
 * @param res
 */
const update = async (req: Request, res: Response): Promise<void> => {
    Logger.http(`PUT single user with username ${req.body.username}`)
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const numericId = parseInt(id, 10);

    // Ensure request has new username attached
    if ( ! req.body.hasOwnProperty("username") ) {
        res.status(400).send('Please provide new username field');
        return;
    }

    const newUsername = req.body.username;

    try {
        const updatedName = await users.alter(newUsername, numericId);

        if (updatedName === 0) {
            res.status(404).send(`User Not Found`);
            return;
        }

        res.status(200).send(`Successfully changed username name to:  ${newUsername}`);
    } catch (err) {
        res.status(500)
            .send(`ERROR updating user ${id}: ${err}`);
    }
}

/**
 * DELETE method. Deletes a user based on ID from DB
 *
 * @param req
 * @param res
 */
const remove = async (req: Request, res: Response): Promise<void> => {
    Logger.http(`DELETE single user id ${req.params.id}`);

    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const numericId = parseInt(id, 10);

    try {
        const deletedUser = await users.remove(numericId);

        if (deletedUser === 0) {
            res.status(404).send(`User Not Found`);
            return;
        }

        res.status(200)
            .send(`Deleted user ${id}`);
    } catch (err) {
        res.status(500)
            .send(`ERROR deleting user ${id}: ${err}`);
    }
}

export { list, create, read, update, remove };