import {Application, Express} from 'express';
import * as message from '../controllers/message.server.controller';

module.exports = (app: Application) => {
  app.route( '/api/conversations/:id/messages' )
      .get( message.list )
      .post( message.create );

    app.route( '/api/conversations/:id/messages/:mid' )
        .get( message.read )
};