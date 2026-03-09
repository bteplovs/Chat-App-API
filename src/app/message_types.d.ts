type Message = {
    /**
     * id of the user who sent the message as defined by the DB
     */
    user_id: number
    /**
     * The message sent by the user as defined by the DB
     */
    message: string
    /**
     * id of the sent message as defined by the DB
     */
    message_id: number
    /**
     * id of the convo which the message is sent in as defined by the DB
     */
    convo_id: number
    /**
     * Date of message creation as defined by the DB
     */
    sent_time: string
}