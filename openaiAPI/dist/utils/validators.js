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
exports.isValidDate = void 0;
exports.isValidDiningHall = isValidDiningHall;
exports.isValidFoodItem = isValidFoodItem;
exports.getAllDiningHalls = getAllDiningHalls;
exports.getAllFoodItems = getAllFoodItems;
const sequelize_1 = require("sequelize");
const diningHall_1 = __importDefault(require("../models/diningHall"));
const menuItem_1 = __importDefault(require("../models/menuItem"));
// Validate if a dining hall exists
function isValidDiningHall(diningHallName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield diningHall_1.default.findOne({
                where: {
                    hallName: {
                        [sequelize_1.Op.iLike]: diningHallName,
                    },
                },
            });
            return !!result;
        }
        catch (error) {
            console.error("Error validating dining hall:", error);
            return false;
        }
    });
}
// Validate if a food item exists
function isValidFoodItem(foodName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield menuItem_1.default.findOne({
                where: {
                    food: {
                        [sequelize_1.Op.iLike]: foodName,
                    },
                },
            });
            return !!result;
        }
        catch (error) {
            console.error("Error validating food item:", error);
            return false;
        }
    });
}
// Validate date string format (YYYY-MM-DD)
const isValidDate = (dateStr) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr))
        return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
};
exports.isValidDate = isValidDate;
function getAllDiningHalls() {
    return __awaiter(this, void 0, void 0, function* () {
        const halls = yield diningHall_1.default.findAll({ attributes: ['hallname'] });
        return halls.map(h => h.hallname.toLowerCase());
    });
}
function getAllFoodItems() {
    return __awaiter(this, void 0, void 0, function* () {
        const items = yield menuItem_1.default.findAll({ attributes: ['food'] });
        return items.map(i => i.food.toLowerCase());
    });
}
