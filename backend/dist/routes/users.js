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
const router = express_1.default.Router();
router.use(express_1.default.json());
const UserInputSchema = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string()
});
router.get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield index_1.default.user.findMany();
    res.send(users);
}));
router.post('/create-user', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const reqInput = UserInputSchema.parse(req.body);
    console.log(UserInputSchema.parse(req.body));
    res.send(req.body);
}));
exports.default = router;
