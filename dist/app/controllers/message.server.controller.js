"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.read = exports.create = exports.list = void 0;
const messages = __importStar(require("../models/message.server.model"));
const logger_1 = __importDefault(require("../../config/logger"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.http(`GET all messages of conversation ${req.params.id}`);
    const conversation_id = parseInt(req.params.id, 10);
    try {
        const result = yield messages.getAll(conversation_id);
        if (result.length === 0) {
            res.status(404).send("No conversation with id " + conversation_id);
        }
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500)
            .send(`Error getting conversations ${err}`);
    }
});
exports.list = list;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.http(`POST create a message from ${req.body.user_id}`);
    const message_content = req.body.message;
    const user_id = req.body.user_id;
    const conversation_id = parseInt(req.params.id, 10);
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
        const insertId = yield messages.insert(conversation_id, user_id, created_on, message_content);
        if (!insertId) {
            res.status(400).send('Invalid input');
            return;
        }
        res.status(201).send({ "message_id": insertId });
    }
    catch (err) {
        res.status(500)
            .send(`Internal Server Error: ${err}`);
    }
});
exports.create = create;
const read = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.http(`GET single message id: ${req.params.mid}`);
    const messageId = typeof req.params.mid === 'string' ? req.params.mid : req.params.mid[0];
    const convoId = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    try {
        const result = yield messages.getOne(parseInt(messageId, 10), parseInt(convoId, 10));
        if (result.length === 0) {
            res.status(404).send(`Conversation Not Found`);
        }
        else {
            res.status(200).send(result[0]);
        }
    }
    catch (err) {
        res.status(500)
            .send(`Error reading conversation id: ${messageId}: ${err}`);
    }
});
exports.read = read;
//# sourceMappingURL=message.server.controller.js.map