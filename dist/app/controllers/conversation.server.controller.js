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
exports.remove = exports.update = exports.read = exports.create = exports.list = void 0;
const conversations = __importStar(require("../models/conversation.server.model"));
const logger_1 = __importDefault(require("../../config/logger"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.http('GET all conversations of conversations');
    try {
        const result = yield conversations.getAll();
        res.status(200).send(result);
    }
    catch (err) {
        res.status(500)
            .send(`Error getting conversations ${err}`);
    }
});
exports.list = list;
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.http(`POST create a conversation with name ${req.body.convo_name}`);
    if (!req.body.hasOwnProperty("convo_name")) {
        res.status(400).send('Please provide conversation field');
        return;
    }
    const convoName = req.body.convo_name;
    const created_on = new Date();
    try {
        const insertId = yield conversations.insert(convoName, created_on);
        res.status(201).send({ "convo_id": insertId });
    }
    catch (err) {
        res.status(500)
            .send(`Error creating conversation ${convoName}: ${err}`);
    }
});
exports.create = create;
const read = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.http(`GET single conversation id: ${req.params.id}`);
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    try {
        const result = yield conversations.getOne(parseInt(id, 10));
        if (result.length === 0) {
            res.status(404).send(`User Not Found`);
        }
        else {
            res.status(200).send(result[0]);
        }
    }
    catch (err) {
        res.status(500)
            .send(`Error reading conversation id: ${id}: ${err}`);
    }
});
exports.read = read;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.http(`PUT single conversation with name ${req.body.convo_name}`);
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const numericId = parseInt(id, 10);
    // Invalid input
    if (!req.body.hasOwnProperty("convo_name")) {
        res.status(400).send('Please provide new conversation name field');
        return;
    }
    const newConvoName = req.body.convo_name;
    try {
        const updatedConversation = yield conversations.alter(newConvoName, numericId);
        if (updatedConversation === 0) {
            res.status(404).send(`Conversation Not Found`);
            return;
        }
        res.status(200).send(`Successfully changed conversation name to: ${newConvoName}`);
    }
    catch (err) {
        res.status(500)
            .send(`ERROR updating user ${id}: ${err}`);
    }
});
exports.update = update;
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.http(`DELETE single conversation id ${req.params.id}`);
    const id = typeof req.params.id === 'string' ? req.params.id : req.params.id[0];
    const numericId = parseInt(id, 10);
    try {
        const deletedConvo = yield conversations.remove(numericId);
        if (deletedConvo === 0) {
            res.status(404).send(`User Not Found`);
            return;
        }
        res.status(200)
            .send(`Deleted conversation ${deletedConvo}`);
    }
    catch (err) {
        res.status(500)
            .send(`Error deleting conversation ${id}: ${err}`);
    }
});
exports.remove = remove;
//# sourceMappingURL=conversation.server.controller.js.map