// Group chatrooms based on owner from a given chatrooms list
export default function groupChatrooms(chatrooms) {

    let grouped = new Map()

    chatrooms.forEach(chatroom => {
        const ownerId = chatroom.ownerId
        const existing = grouped.get(ownerId) || []
        grouped.set(ownerId, [...existing, chatroom])
    })

    return grouped
}