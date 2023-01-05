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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const users_1 = __importDefault(require("./routes/users"));
const body_parser_1 = __importDefault(require("body-parser"));
const port = 8421;
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.get("/", (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findMany({
            where: {
                email: 'haydenrieder@gmail.com'
            },
            select: {
                username: true,
                dailyItems: true,
                challenge: true
            }
        });
        res.send(JSON.stringify(user));
        console.log(user);
    }
    catch (e) {
        errorHandle(e, res);
    }
}));
const errorHandle = (e, res) => {
    if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        res.send('There is a unique constraint violation, a new user cannot be created with this email');
    }
    else {
        res.send('There was an unexpected error');
    }
};
app.use('/users', users_1.default);
app.listen(port, () => console.log(`Listening on ${port}`));
exports.default = prisma;
