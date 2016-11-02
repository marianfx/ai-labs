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
    strategy(callback){
        var possibleMoves = this.game.getAllAvailableMovesForPlayer(this.game.board, this.id);
        var n = _.size(possibleMoves);
        var randNr = Math.random() * n;
        var move = possibleMoves[randNr];

        this.executeMove(move);
        callback();
    }
}

export {RandomPlayer}