const TelegramBot = require('node-telegram-bot-api');

const token = '8688956288:AAEnOCWDB8c4ya_9_BZaVrgP9aIHOoYRbk8';
const bot = new TelegramBot(token, { polling: true });

// lưu tạm request
let requests = {};
let idCounter = 1;

// từ khóa duyệt
const APPROVE_KEYWORDS = ["ok em nhé", "oke", "duyệt", "👍",  "Oke em nhé", "Ok e nhé"];

// lệnh /chi
bot.onText(/\/chi (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const content = match[1];

    const id = idCounter++;

    const message = `
📌 [#${id}]
${msg.from.first_name} đề xuất chi:
${content}

👉 Reply "ok" để duyệt
`;

    bot.sendMessage(chatId, message).then(sentMsg => {
        requests[sentMsg.message_id] = {
            id,
            status: "PENDING"
        };
    });
});

// xử lý reply duyệt
bot.on("message", (msg) => {
    if (!msg.reply_to_message) return;

    const text = msg.text?.toLowerCase() || "";

    const isApprove = APPROVE_KEYWORDS.some(k => text.includes(k));
    if (!isApprove) return;

    const originalMsgId = msg.reply_to_message.message_id;
    const request = requests[originalMsgId];

    if (!request) return;
    if (request.status !== "PENDING") return;

    request.status = "APPROVED";

    bot.sendMessage(msg.chat.id, `✅ Đã duyệt #${request.id}\n→ Tiến hành chi`);
});
