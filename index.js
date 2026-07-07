import dotenv from 'dotenv';
dotenv.config();

import TelegramBot from "node-telegram-bot-api";
import { GoogleGenAI } from "@google/genai";
import express from 'express'; // Render uchun express kutubxonasi

// Express serverni sozlash (Render loyiha o'chib qolmasligi uchun portni eshitib turadi)
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Usmon AI Bot muvaffaqiyatli ishlab turibdi!');
});

app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda muvaffaqiyatli ishga tushdi.`);
});

// Telegram botni sozlash (Token .env fayldan yoki Render sozlamalaridan olinadi)
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

// Google Gemini API kalitini ulash
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

console.log("Bot muvaffaqiyatli ishga tushdi!");

bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text) return;

    if (text === "/start") {
        bot.sendMessage(chatId, `Salom! Men Google Gemini orqali bepul ishlaydigan aqlli botman. Menga istalgan savolingizni yozing!`);
        return;
    }

    try {
        // Gemini modeliga so'rov yuborish
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: text,
        });

        bot.sendMessage(chatId, response.text);

    } catch (err) {
        console.log("XATOLIK SABABI:", err.message);
        bot.sendMessage(chatId, "Xatolik yuz berdi. Iltimos, qaytadan urinib ko'ring.");
        console.log(JSON.stringify(err, null, 2));
    }
});