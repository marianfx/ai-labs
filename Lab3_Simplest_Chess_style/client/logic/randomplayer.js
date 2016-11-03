import * as _ from 'lodash'
import {Player} from './player'
import {Game} from './game'

class RandomPlayer extends Player{

    /**
     * @param {Number} theId
     * @param {Game} theGame
     */
    constructor(theId, theGame){
        super(theId, theGame);
    }

    /**
     * Selects pieces randomly
     * @param {Function} callback
     */
    strategy(game, callback){
        var possibleMoves = game.getAllAvailableMovesForPlayer(game.board, this.id);

        // check if no available moves
        if(_.size(possibleMoves) == 0 )
            return callback(game, true);

        var n = _.size(possibleMoves);
        var randNr = Math.floor(Math.random() * n);
        var move = possibleMoves[randNr];

        this.executeMove(game, move);
        callback(game);
    }
}

export {RandomPlayer}