const { deleteMessageByBot } = require("./botAction");
const { getChatID } = require("./utilities");

/**
 * Saves MessageIds in State to delete them later
 * @param {*} _this
 * @param {object} state Received State
 * @param {string} instanceTelegram Instance of Telegram
 */
async function saveMessageIds(_this, state, instanceTelegram) {
	try {
		let requestMessageId;
		const requestUserIdObj = await _this.getForeignStateAsync(`${instanceTelegram}.communicate.requestChatId`);
		const requestMessageIdObj = await _this.getStateAsync("communication.requestIds");
		if (requestUserIdObj && requestUserIdObj.val) {
			if (requestMessageIdObj.val) requestMessageId = JSON.parse(requestMessageIdObj.val);
			else requestMessageId = {};
			_this.log.debug("Save Message ID");
			if (!requestMessageId[requestUserIdObj.val]) requestMessageId[requestUserIdObj.val] = [];
			requestMessageId[requestUserIdObj.val].push({ id: state.val });
		}
		_this.log.debug("RequestMessageIds: " + JSON.stringify(requestMessageId));
		_this.setStateAsync("communication.requestIds", JSON.stringify(requestMessageId), true);
	} catch (e) {
		_this.log.error("Error saveMessageIds: " + JSON.stringify(e.message));
		_this.log.error(JSON.stringify(e.stack));
	}
}

/**
 * Deletes Messages by Bot
 * @param {*} _this
 * @param {string} user Username
 * @param {[]} userListWithChatID Array with ChatID and Username
 * @param {string} instanceTelegram Instance of Telegram
 * @param {string} whatShouldDelete What should be deleted
 */
async function deleteMessageIds(_this, user, userListWithChatID, instanceTelegram, whatShouldDelete) {
	const requestMessageIdObj = await _this.getStateAsync("communication.requestIds");
	const lastMessageId = await _this.getForeignStateAsync(`${instanceTelegram}.communicate.requestMessageId`);
	if (requestMessageIdObj && JSON.parse(requestMessageIdObj.val)) {
		const chat_id = getChatID(userListWithChatID, user);
		const messageIds = JSON.parse(requestMessageIdObj.val);
		messageIds[chat_id].push({ id: lastMessageId.val });
		const newMessageIds = messageIds;
		for (let i = messageIds[chat_id].length - 1; i >= 0; i--) {
			if (whatShouldDelete === "all") {
				deleteMessageByBot(_this, instanceTelegram, user, userListWithChatID, messageIds[chat_id][i].id, chat_id);
				newMessageIds[chat_id].splice(i, 1);
			}
			//  else if (whatShouldDelete === "last" && index === 0) {
			// 	deleteMessageByBot(_this, instanceTelegram, user, userListWithChatID, element.id, chat_id);
			// 	messageIds[chat_id] = messageIds[chat_id].slice(1);
			// }
			// else if (whatShouldDelete === "leaveL" && leaveLastStanding && i > leaveLastStanding - 1) {
			// 	deleteMessageByBot(_this, instanceTelegram, user, userListWithChatID, messageIds[chat_id][i].id, chat_id);
			// 	newMessageIds[chat_id].splice(i, 1);
			// }
		}

		_this.setStateAsync("communication.requestIds", JSON.stringify(newMessageIds), true);
	}
}

module.exports = {
	saveMessageIds,
	deleteMessageIds,
};
