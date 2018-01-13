generateMessageWithButtons = (text, buttons) => {
    return {
        "messages": [
            {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "button",
                        "text": text,
                        "buttons": buttons
                    }
                }
            }
        ]
    }
}

module.exports = { generateMessageWithButtons };