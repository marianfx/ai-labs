import * as _ from 'lodash'

import {Board} from '../models/board'
import {Pawn} from '../models/pawn'
import {Move} from '../models/move'
import {Styler} from '../interface/styler'
import {Player} from './player'
import {RandomPlayer} from './randomplayer'

class Game {

    constructor() {
        this.board = new Board();

        this.players = [null, new RandomPlayer(1, this), new RandomPlayer(2, this)]

        this.styler = new Styler();
        this.styler.prepareChessBoard();
        this.active_player = 2;
        this.styler.currentPlayer = 2;
    }

    get ActivePlayer() {
        return this.active_player;
    }
    set ActivePlayer(value) {
        this.active_player = value;
    }

    get Board() {
        return this.table;
    }
    set Board(value) {
        this.table = value;
    }


    runGame(run){

        this.players[this.active_player].strategy(this, function(game, playerHasNoMoreMoves){
            
            if(playerHasNoMoreMoves){

                var msg = "Game finished in " + run + " moves. Winner: Player #" + game.active_player % 2 + 1 + " (player " + game.active_player + " was left out of moves.";
                game.styler.displayMessage(msg);
                return;
            }

            if(game.is_final_state(game.board, game.active_player)){
                var msg = "Game finished in " + run + " moves. Winner: Player #" + game.active_player;
                game.styler.displayMessage(msg);
                return;
            }

            // next
            game.set_active_player(game.active_player % 2 + 1);
            game.runGame(run + 1);
        });
    }

    /**
     * @param {Number} playerid
     */
    set_active_player(playerid) {
        this.active_player = playerid;
        this.styler.currentPlayer = playerid;
    }


    /**
     * @param {Board} board - The board to start from
     * @param {Move} move - the move to execute
     * @returns {Board} - The new board, created after executing the move.
     */
    get_board_from_move(board, move){
        return this.do_transition(board, move.PawnID, move.PlayerID, move.X, move.Y);
    }


    /**
     * @returns {Board} A new Board (deep copied) with the given transition executed.
     */
    do_transition(board, pawn_id, playerid, new_x, new_y) {

        var output = _.cloneDeep(board);
        var pid = playerid - 1;
        var pawn = output.pawns[pid][pawn_id];
        console.log("Move: Player " + playerid + ", pawn " + pawn_id + " from (" + pawn.X + "," + pawn.Y + ") to (" + new_x + "," + new_y + ").");

        var check = this.is_valid_transition(board, pawn_id, playerid, new_x, new_y);
        if (check.is_valid == false) {
            console.log("Tried to do invalid transition.");
            return null;
        }
        output.Table[pawn.y][pawn.x] = 0;

        (output.pawns[pid][pawn_id]).prev_x = pawn.x;
        (output.pawns[pid][pawn_id]).prev_x = pawn.y;
        (output.pawns[pid][pawn_id]).x = new_x;
        (output.pawns[pid][pawn_id]).y = new_y;
        (output.pawns[pid][pawn_id]).was_moved_prev = true;
        for(var i = 0; i < (output.pawns[pid]).length; i++)
            if (i != pawn_id)
                (output.pawns[pid][i]).was_moved_prev = false;
        
        if (check.type_move == 'attack') {
            var opponent = 3 - playerid - 1;
            for(var i = 0; i < 8; i ++)
                if(output.pawns[opponent][i].x == new_x && output.pawns[opponent][i].y == new_y ){
                    output.pawns[opponent][i].IsOut = true;
                    break;
                }
        }

        if (check.type_move == 'enpassan') {
            var opponent = 3 - playerid - 1;
            output.pawns[opponent][check.ate_pawn].IsOut = true;
        }
        output.Table[new_y][new_x] = playerid;

        return output;
    }

    is_valid_transition(board, pawn_id, playerid, new_x, new_y) {

        if (pawn_id < 0 || pawn_id > 7)
            return {
                'is_valid': false,
                'type_move': null
            }; //uknonw pawn

        if (new_x < 0 || new_x > 7 || new_y < 0 || new_y > 7)
            return {
                'is_valid': false,
                'type_move': null
            };

        var pawn = board.Pawns[playerid - 1][pawn_id];
        if (pawn == null)
            return {
                'is_valid': false,
                'type_move': null
            }; //if pawn is null that means that pawn was eleminated

        //move up(if active_player is 1)
        //move down(if active player is 2)
        var factor = -1;
        if (playerid == 1)
            factor = 1;

        if (factor * (new_y - pawn.Y) <= 0)
            return {
                'is_valid': false,
                'type_move': null
            }; //can't go backward

        // check if it can move forward
        if (pawn.X == new_x) {
            var move_length = Math.abs(pawn.Y - new_y)
            if (move_length > 2)
                return {
                    'is_valid': false,
                    'type_move': null
                };

            if (move_length == 1 && board.Table[new_y][new_x] == 0)
                return {
                    'is_valid': true,
                    'type_move': 'forward'
                };
            if (move_length == 2) {
                try {
                    if (board.Table[new_y + factor * (-1)][new_x] == 0 && board.Table[new_y][new_x] == 0) {
                        if (factor == -1)
                            return {
                                'is_valid': pawn.Y == 6,
                                'type_move': 'forward'
                            };
                        return {
                            'is_valid': pawn.Y == 1,
                            'type_move': 'forward'
                        };
                    }
                } catch (error) {
                    return {
                        'is_valid': false,
                        'type_move': null
                    };
                }
                
            }
            return {
                'is_valid': false,
                'type_move': null
            };
        }

        // chech if i can move by diagonal
        if (Math.abs(new_x - pawn.x) == 1 && Math.abs(new_y - pawn.y) == 1) {
            if (board.Table[new_y][new_x] != 0 &&
                board.Table[new_y][new_x] != playerid)
                return {
                    'is_valid': true,
                    'type_move': 'attack'
                };

            // check if there is en passan situation
            if (board.Table[pawn.y][new_x] != 0 &&
                board.Table[pawn.y][new_x] != playerid)
            // on my right or left are opponent pawn and I check if that pawn
            // last move was 2 cell lenght
                var opponent = 3 - playerid - 1
            var op_pawn_id = -1
            var line = pawn.y
            op_pawn_id = _.findIndex(board.Pawns[opponent],  
                function(pawn)  { 
                    if (pawn == null)
                        return false
                    if (pawn.y == line && pawn.x == new_x)
                        return  (pawn.x == pawn.prev_x &&
                            Math.abs(pawn.y - pawn.prev_y) == 2 && pawn.last_moved ); 
                })
            if (op_pawn_id > -1)
                return {
                    'is_valid': true,
                    'type_move': 'enpassan',
                    'ate_pawn': op_pawn_id
                };
            // there is en passan move


        }

        return {
            'is_valid': false,
            'type_move': 'attack'
        };
    }

    is_final_state(board, playerid) {
        var target_line = 0
            // console.log("verifying if player");
        if (playerid == 1)
            target_line = 7;
        if (playerid == 2)
            target_line = 0;

        var player_pawns = board.pawns[playerid - 1];
        for (var i = 0; i < 8; i++) {
            var pawn = player_pawns[i];
            if(pawn.IsOut)
                continue;
            if (pawn.y == target_line)
                return true;
        }
        return false;

    }

    /**
     * @param {Board} board
     * @param {Pawn} pawn
     * @param {Number} pid
     * @param {Number} playerid
     * @Returns {Move[]} A list of moves. 
     */
    getAllMovesForPawn(board, pawn, pid, playerid) {
        var factor = 1; //going down
        if (playerid == 2)
            factor = -1; //going up
        var output = [];

        // one position - forward
        var move = new Move(pawn.X, pawn.Y + factor * 1, pawn.X, pawn.Y, pid, playerid);
        var state = this.is_valid_transition(board, pid, playerid, move.X, move.Y);
        if (state.is_valid)
            output.push(move);

        // two positions - forward
        move = new Move(pawn.X, pawn.Y + factor * 2, pawn.X, pawn.Y, pid, playerid);
        state = this.is_valid_transition(board, pid, playerid, move.X, move.Y);
        if (state.is_valid)
            output.push(move);

        // right corner (+1, +1)
        move = new Move(pawn.X + factor * 1, pawn.Y + factor * 1, pawn.X, pawn.Y, pid, playerid);
        state = this.is_valid_transition(board, pid, playerid, move.X, move.Y);
        if (state.is_valid)
            output.push(move);

        // left corner
        move = new Move(pawn.X - (factor * 1), pawn.Y + factor * 1, pawn.X, pawn.Y, pid, playerid);
        state = this.is_valid_transition(board, pid, playerid, move.X, move.Y);
        if (state.is_valid)
            output.push(move);

        return output;
    }

    /**
     * Given a board, computes all the moves available for that board, given the current player as playerid.
     * @param {Board} board
     * @param {Number} playerid
     * @returns {Move[]} An array of moves (Move)..
     */
    getAllAvailableMovesForPlayer(board, playerid) {
        var pawns = board.BlackPawns;
        if (playerid == 1)
            pawns = board.WhitePawns;
        var output = [];
        var me = this;
        for (var index = 0; index < pawns.length; index++) {
            var pawn = pawns[index];
            if(pawn.IsOut)
                continue;
            output = _.concat(output, me.getAllMovesForPawn(board, pawn, index, playerid));
        };

        return output;
    }
}

export {Game};
