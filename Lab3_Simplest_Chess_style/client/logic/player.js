
import {Move} from '../models/move'

class Player{
    
    /**
     * @param {Number} theId
     * @param {Game} theGame
     */
    constructor(theId, theGame){
        if(this.constructor === Player)
            throw new TypeError("Cannot construct instances of the abstract class Player.");
            
        if(this.strategy === undefined)
            throw new TypeError("Method strategy must be overriden.");
        
        this.game = theGame;
        this.id = theId;
    }


    /**
     * @param {Move} move
     */
    executeMove(move){
        
        this.game.Board = this.game.get_board_from_move(this.game.board, move);
        var chr = 'p';
        if (this.game.active_player == 1)
            chr = 'P'
        this.game.styler.movePieceVisually(chr, move.YOld, move.XOld, move.Y, move.X);
    }
}

export {Player}