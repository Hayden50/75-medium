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
const index_1 = __importDefault(require("../index"));
const zod_1 = require("zod");
const challengeRouter = express_1.default.Router();
const dateSchema = zod_1.z.preprocess((arg) => {
    if (typeof arg == "string" || arg instanceof Date) {
        return new Date(arg);
    }
}, zod_1.z.date());
const CreateChallengeSchema = zod_1.z.object({
    active: zod_1.z.boolean(),
    usingPhoto: zod_1.z.boolean(),
    challengeLength: zod_1.z.number(),
    challengeStart: dateSchema,
    objectives: zod_1.z.array(zod_1.z.string()),
    userId: zod_1.z.string()
});
challengeRouter.get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const challenges = yield index_1.default.challenge.findMany({
            select: {
                active: true,
                challengeLength: true,
                objectives: true,
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        });
        res.send(challenges);
    }
    catch (e) {
        res.send(e);
    }
}));
challengeRouter.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const challengeReq = CreateChallengeSchema.parse(req.body);
        const challenge = yield index_1.default.challenge.create({ data: challengeReq });
        res.send(challenge);
    }
    catch (e) {
        res.send(e);
    }
}));
challengeRouter.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const challenge = yield index_1.default.challenge.findUnique({ where: { id: id } });
        res.send(challenge);
    }
    catch (e) {
        res.send(e);
    }
}));
exports.default = challengeRouter;
