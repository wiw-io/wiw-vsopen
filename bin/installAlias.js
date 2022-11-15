"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installAlias = void 0;
const shelljs_1 = __importDefault(require("shelljs"));
const installAlias = () => {
    if (!shelljs_1.default.grep('vsopen', '~/.bashrc').stdout.startsWith('vsopen')) {
        shelljs_1.default.exec('echo "alias vsopen=\'npx -y @wiw-io/vsopen@latest\'" >> ~/.bashrc');
    }
    if (!shelljs_1.default.grep('vsopen', '~/.zshrc').stdout.startsWith('vsopen')) {
        shelljs_1.default.exec('echo "alias vsopen=\'npx -y @wiw-io/vsopen@latest\'" >> ~/.zshrc');
    }
};
exports.installAlias = installAlias;
