"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
exports.default = () => {
    const app = (0, express_1.default)();
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        next();
    });
    app.use(body_parser_1.default.json());
    // Add routes to the api here!
    require('../app/routes/user.server.routes.js')(app);
    require('../app/routes/conversation.server.routes.js')(app);
    require('../app/routes/message.server.routes.js')(app);
    return app;
};
//# sourceMappingURL=express.js.map