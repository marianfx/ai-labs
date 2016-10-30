
import * as _ from 'lodash'
import {Styler} from './chess.styler.js'

class Pawn {
    // WHITE = 1 = computer
    // BLACK = 2 = human
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
    }

    get X(){ return this.x; }
    set X(value){ this.x = value; }

    get Y(){ return this.y; }
    set Y(value){ this.y = value; }

    get Color(){ return this.color; }
    set Color(value){ this.color = value; }
}


class Board {
    /*
     \ X  0 1 2 3 4 5 6 7
    Y  ----------------
    0 | 0 0 0 0 0 0 0 0
    1 | 1 1 1 1 1 1 1 1
    2 | 0 0 0 0 0 0 0 0
    3 | 0 0 0 0 0 0 0 0
    4 | 0 0 0 0 0 0 0 0
    5 | 0 0 0 0 0 0 0 0
    6 | 2 2 2 2 2 2 2 2
    7 | 0 0 0 0 0 0 0 0
        pionii 1 ca sa castige trebuie sa ajunga pe liia 7
        pionii 2 ca sa castige trebuie sa ajunga pe linia 0
        white move  first
    */
    constructor() {
        this.pawns = [
            [],
            []
        ];
        for (var i = 0; i < 8; i++) {
            this.pawns[0][i] = new Pawn(i, 1, 1 /*WHITE*/ );
            this.pawns[1][i] = new Pawn(i, 6, 2 /*BLACK*/ );

        }
        this.table = [
            [0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0],
            [2, 2, 2, 2, 2, 2, 2, 2],
            [0, 0, 0, 0, 0, 0, 0, 0]
        ];
    }

    get Pawns(){ return this.pawns; }
    set Pawns(value){ this.pawns = value; }

    get Table(){ return this.table; }
    set Table(value){ this.table = value; }

    get BlackPawns() {return this.pawns[1]; }
    get WhitePawns() {return this.pawns[0]; }

    get BlackPawnsCount() {return _.size(this.BlackPawns);}
    get WhitePawnsCount() {return _.size(this.WhitePawns);}

    toString(){
      var string='\n';
      for(var i = 7; i >= 0; i--){
          string += i + '|' + this.table[i]
        string +='\n'
      }
      string += '------------------\n |0,1,2,3,4,5,6,7'
      return string;
    }
}


class Game{

    /**
     * @static {Styler}
     */
    constructor(){
        this.board = new Board();
        this.styler = new Styler();
        this.styler.prepareChessBoard();
        this.active_player = 2;
        this.styler.currentPlayer = 2;        
    }

    get ActivePlayer(){ return this.active_player; }
    set ActivePlayer(value){ this.active_player = value; }

    /**
     * @link {Board}
     */
    get Board(){ return this.table; }
    set Board(value){ this.table = value; }

    /**
     * @param {Number} playerid
     */
    set_active_player(playerid) {
        this.active_player = playerid;
        this.styler.currentPlayer = playerid;
    }

    /**
     * @returns {Board} A new Board (deep copied) with the given transition executed.
     */
    do_transition(board, pawn_id, playerid, new_x, new_y) {

        var output = _.cloneDeep(board); //create a copy of the board
        var pid = playerid - 1;
        var pawn = output.Pawns[pid][pawn_id];
        console.log("Move: Player " + playerid + ", pawn " + pawn_id + " from (" + pawn.X + "," + pawn.Y + ") to (" + new_x + "," + new_y + ").");

        if(this.is_valid_transition(board, pawn_id, playerid, new_x, new_y) == false){
            console.log("Tried to do invalid transition.");
            return null;
        }
        output.Table[pawn.y][pawn.x] = 0;

        (output.Pawns[pid][pawn_id]).x = new_x;
        (output.Pawns[pid][pawn_id]).y = new_y;


        if(output.Table[new_y][new_x] != 0){
            var opponent = 3 - playerid - 1;
            output.Pawns[opponent] = _.remove(output.Pawns[opponent], function(pawn){
                                        return pawn.X == new_x && pawn.Y == new_y;
                                    });
        }
        output.Table[new_y][new_x] = playerid;
        
        return output;
    }
    
    is_valid_transition(board, pawn_id, playerid, new_x, new_y) {

        if (pawn_id < 0 || pawn_id > 7)
            return false; //uknonw pawn
        
        if (new_x < 0 || new_x > 7 || new_y < 0 || new_y > 7)
            return false;
        
        var pawn = board.Pawns[playerid - 1][pawn_id];
        if (pawn == null)
          return false //if pawn is null that means that pawn was eleminated

        //move up(if active_player is 1)
        //move down(if active player is 2)
        var factor = -1;
        if (playerid == 1)
            factor = 1;

        if (factor * (new_y - pawn.Y) <= 0)
            return false; //can't go backward

        // check if it can move forward
        if (pawn.X == new_x) {
            var move_length = Math.abs(pawn.Y - new_y)
            if (move_length > 2)
                return false;
            if (move_length == 1 && board.Table[new_y][new_x] == 0)
                return true;
            if (move_length == 2){
                if(board.Table[new_y + factor * 1][new_x] == 0 && board.Table[new_y][new_x] == 0){
                    if(factor == -1)
                        return pawn.Y == 6;
                    return pawn.Y == 1;
                }
            }
            else
                return false;
        }

        // chech if i can move by diagonal
        if (Math.abs(new_x - pawn.x) == 1 && Math.abs(new_y - pawn.y) == 1) {
            if (board.Table[new_y][new_x] != 0 &&
                board.Table[new_y][new_x] != playerid)
                return true;
        }

        return false;
    }

    is_final_state(board, playerid) {
        var target_line = 0
        // console.log("verifying if player");
        if (playerid == 1)
            target_line = 7;
        if (playerid == 2)
            target_line = 0;

        var player_pawns = board.pawns[playerid - 1];
        for (var i = 0; i < 8; i ++) {
            var pawn = player_pawns[i];
            if (pawn.y == target_line)
                return true;
        }
        return false;

    }

    getAllBoardsForPawn(board, pown, pid, playerid){
        var factor = 1;//going down
        if(playerid == 2)
            factor = -1;//going up
        var output = [];
        
        // one position - forward
        var newY = pown.Y + factor * 1;
        var upBoard = this.do_transition(board, pid, playerid, pown.X, newY);
        if(upBoard != null)
            output.push(upBoard);
        
        // two positions - forward
        newY = pown.Y + factor * 2;
        var upUpBoard = this.do_transition(board, pid, playerid,  pown.X, newY);
        if(upUpBoard != null)
            output.push(upUpBoard);
        
        // right corner (+1, +1)
        var newX = pown.X + factor * 1;
        newY = pown.Y + factor * 1;
        var rightCorner = this.do_transition(board, pid, playerid,  newX, newY);
        if(rightCorner != null)
            output.push(rightCorner);
        
        // left corner
        newX = pown.X - (factor * 1);
        newY = pown.Y + factor * 1;
        var leftCorner = this.do_transition(board, pid, playerid,  newX, newY);
        if(leftCorner != null)
            output.push(leftCorner);
        
        return output;
    }

    /**
     * Given a board, computes all the board states available for that board, given the current player as playerid.
     * @param {Board} board
     * @param {Number} playerid
     * @returns {Board[]} An array of Board, as all the available states.
     */
    getAllAvailableBoards(board, playerid){
        var pawns = board.BlackPawns;
        if (playerid == 1)
            pawns = board.WhitePawns;
        var output = [];
        var me = this;
        for(var index = 0; index < pawns.length; index ++){
            var pawn = pawns[index];
            output = _.concat(output, me.getAllBoardsForPawn(board, pawn, index, playerid));
        };

        return output;
    }
}

export {Pawn, Board, Game};