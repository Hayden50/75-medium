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
const zod_1 = require("zod");
const index_1 = __importDefault(require("../index"));
const userRouter = express_1.default.Router();
userRouter.use(express_1.default.json());
const CreateUserSchema = zod_1.z.object({
    firstName: zod_1.z.string(),
    lastName: zod_1.z.string(),
    email: zod_1.z.string(),
    password: zod_1.z.string()
});
const LoginSchema = zod_1.z.object({
    email: zod_1.z.string(),
    password: zod_1.z.string()
});
userRouter.get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield index_1.default.user.findMany();
        res.send(JSON.stringify(users));
    }
    catch (e) {
        errorHandle(e, res);
    }
}));
userRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield index_1.default.user.findUnique({
            where: { id: id }
        });
        res.send(JSON.stringify(user));
    }
    catch (e) {
        errorHandle(e, res);
    }
}));
userRouter.post('/create-user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userReq = CreateUserSchema.parse(req.body);
        const user = yield index_1.default.user.create({ data: userReq });
        res.send(user);
    }
    catch (e) {
        errorHandle(e, res);
    }
}));
userRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const loginReq = LoginSchema.parse(req.body);
        const user = yield index_1.default.user.findFirstOrThrow({
            where: {
                email: loginReq.email,
                password: loginReq.password
            },
        });
        res.send(user);
    }
    catch (e) {
        errorHandle(e, res);
    }
}));
const errorHandle = (e, res) => {
    const error = e;
    switch (error.code) {
        case 'P2002':
            res.send('There is a unique constraint violation, a new user cannot be created with this email.');
            break;
        case 'P2025':
            res.send('User credentials are incorrect. Failed to login.');
            break;
        default:
            res.send(error.message);
    }
};
exports.default = userRouter;
