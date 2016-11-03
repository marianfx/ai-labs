import * as _ from 'lodash'
import {Player} from './player'
import {Game} from './game'
import {Move} from '../models/move'

class HumanPlayer extends Player{

    /**
     * @param {Number} theId
     * @param {Game} theGame
     */
    constructor(theId, theGame){
        super(theId, theGame);
        this.game = theGame;
        this.cb = null;
    }

    /**
     * Selects pieces randomly
     * @param {Function} callback
     */
    strategy(theGame, callback){
        //does nothing
        this.game = theGame;
        this.cb = callback;
    }

    /**
     * @param {Move} move
     */
    try_move(move){

        if (this.game.is_valid_transition(this.game.board, move.PawnID, this.id, move.X, move.Y).is_valid){
            
            // all cool
            this.executeMove(this.game, move);
            return this.cb(this.game);
        }
        //invalid

        if(move.X != move.XOld || move.Y != move.YOld){
            var msg = "Invalid move. Check the rules.";
            this.game.styler.sweetAlert(msg, true);
        }
            
        this.game.styler.drawSquare(null, move.YOld, move.XOld);
        this.game.styler.drawPiece(null, 'p', move.YOld, move.XOld);
    }
}

export {HumanPlayer}