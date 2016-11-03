
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

        this.id = theId;
        this.game = theGame;
    }


    /**
     * @param {Move} move
     */
    executeMove(game, move){
        
        game.board = game.get_board_from_move(game.board, move);
        var chr = 'p';
        if (game.active_player == 1)
            chr = 'P'
        game.styler.movePieceVisually(chr, move.YOld, move.XOld, move.Y, move.X);
        game.styler.addMove(move);
    }
}

export {Player}