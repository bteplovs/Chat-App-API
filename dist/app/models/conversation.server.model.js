"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.alter = exports.insert = exports.getOne = exports.getAll = void 0;
const db_1 = require("../../config/db");
const logger_1 = __importDefault(require("../../config/logger"));
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('Getting all conversations from database');
    const conn = yield (0, db_1.getPool)().getConnection();
    const query = 'select * from lab2_conversations';
    const [rows] = yield conn.query(query);
    conn.release();
    return rows.map(row => ({
        convo_id: row.convo_id,
        convo_name: row.convo_name,
        created_on: row.created_on,
    }));
});
exports.getAll = getAll;
// Promise<Conversation> as it only returns one?!
const getOne = (id) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Getting conversation ${id} from the database`);
    const conn = yield (0, db_1.getPool)().getConnection();
    const query = 'select * from lab2_conversations where convo_id = ?';
    const [rows] = yield conn.query(query, [id]);
    conn.release();
    // Possible to return the single conversation object?!
    return rows.map(row => ({
        convo_id: row.convo_id,
        convo_name: row.convo_name,
        created_on: row.created_on,
    }));
});
exports.getOne = getOne;
// Promise is number because it returns cols affected by the query
const insert = (convo_name, created) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Adding conversation ${convo_name} to the database`);
    const conn = yield (0, db_1.getPool)().getConnection();
    const query = 'insert into lab2_conversations (convo_name, created_on) values (?, ?)';
    const [result] = yield conn.query(query, [convo_name, created]);
    conn.release();
    return result.insertId;
});
exports.insert = insert;
const alter = (newConvoName, convo_id) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Updating conversation ${convo_id} to ${newConvoName}`);
    const conn = yield (0, db_1.getPool)().getConnection();
    const query = 'update lab2_conversations set convo_name=? where convo_id = ?';
    const [result] = yield conn.query(query, [newConvoName, convo_id]);
    conn.release();
    return result.affectedRows;
});
exports.alter = alter;
const remove = (convo_id) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Removing conversation ${convo_id} from the database`);
    const conn = yield (0, db_1.getPool)().getConnection();
    try {
        // Delete all messages associated with the conversation
        yield conn.query('DELETE FROM lab2_messages WHERE convo_id = ?', [convo_id]);
        // Delete the conversation
        const [result] = yield conn.query('DELETE FROM lab2_conversations WHERE convo_id = ?', [convo_id]);
        return result.affectedRows;
    }
    finally {
        conn.release();
    }
});
exports.remove = remove;
//# sourceMappingURL=conversation.server.model.js.map