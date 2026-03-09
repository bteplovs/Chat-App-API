import {Express} from 'express';
import * as conversation from '../controllers/conversation.server.controller';

module.exports = (app: Express) => {
    app.route('/api/conversations')
        .get( conversation.list )
        .post( conversation.create );

    app.route( '/api/conversations/:id' )
        .get( conversation.read )
        .put( conversation.update )
        .delete( conversation.remove );
};

