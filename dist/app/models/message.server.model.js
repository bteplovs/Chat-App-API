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
exports.insert = exports.getOne = exports.getAll = void 0;
const db_1 = require("../../config/db");
const logger_1 = __importDefault(require("../../config/logger"));
const getAll = (conversation_id) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info('Getting all messages of conversation ${conversation_id}');
    const conn = yield (0, db_1.getPool)().getConnection();
    const query = 'select * from lab2_messages where convo_id = ?';
    const [rows] = yield conn.query(query, [conversation_id]);
    conn.release();
    return rows.map(row => ({
        user_id: row.user_id,
        message: row.message,
        message_id: row.message_id,
        convo_id: row.convo_id,
        sent_time: row.sent_time
    }));
});
exports.getAll = getAll;
const getOne = (messageId, convoId) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Getting message ${messageId} from the database`);
    const conn = yield (0, db_1.getPool)().getConnection();
    const query = 'select * from lab2_messages where message_id = ? and convo_id = ?';
    const [rows] = yield conn.query(query, [messageId, convoId]);
    conn.release();
    return rows.map(row => ({
        user_id: row.user_id,
        message: row.message,
        message_id: row.message_id,
        convo_id: row.convo_id,
        sent_time: row.sent_time
    }));
});
exports.getOne = getOne;
const insert = (convoId, userId, sentTime, message_content) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Adding message from user ${userId} to the database`);
    const conn = yield (0, db_1.getPool)().getConnection();
    const query = 'insert into lab2_messages (convo_id, user_id, sent_time, message) values (?, ?, ?, ?)';
    const [result] = yield conn.query(query, [convoId, userId, sentTime, message_content]);
    conn.release();
    return result.insertId;
});
exports.insert = insert;
//# sourceMappingURL=message.server.model.js.map