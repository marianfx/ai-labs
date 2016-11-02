import * as _ from 'lodash'

import {Board} from '../models/board'
import {Pawn} from '../models/pawn'
import {Styler} from '../interface/styler'

class Game {

    constructor() {
        this.board = new Board();
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
        var check = this.is_valid_transition(board, pawn_id, playerid, new_x, new_y);
        if (check.is_valid == false) {
            console.log("Tried to do invalid transition.");
            return null;
        }
        output.Table[pawn.y][pawn.x] = 0;

        (output.Pawns[pid][pawn_id]).prev_x = pawn.x;
        (output.Pawns[pid][pawn_id]).prev_x = pawn.y;
        (output.Pawns[pid][pawn_id]).x = new_x;
        (output.Pawns[pid][pawn_id]).y = new_y;
        (output.Pawns[pid][pawn_id]).was_moved_prev = true;
        for(var i=0; i<(output.Pawns[pid]).length; i++)
            if (i!=pawn_id)
                (output.Pawns[pid][i])=false;
        if (check.type_move == 'attack') {
            var opponent = 3 - playerid - 1;
            output.Pawns[opponent] = _.remove(output.Pawns[opponent], function(pawn) {
                return pawn.X == new_x && pawn.Y == new_y;
            });
        }
        if (check.type_move == 'enpassan') {
            var opponent = 3 - playerid - 1;
            ate_pawn = output.Pawns[opponent][check.ate_pawn];
            output.Pawns[opponent] = _.remove(output.Pawns[opponent], function(pawn) {
                return pawn.X == ate_pawn.X && pawn.Y == ate_pawn.Y;
            });
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
                if (board.Table[new_y + factor * 1][new_x] == 0 && board.Table[new_y][new_x] == 0) {
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
            } else
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
            if (pawn.y == target_line)
                return true;
        }
        return false;

    }

    getAllBoardsForPawn(board, pown, pid, playerid) {
        var factor = 1; //going down
        if (playerid == 2)
            factor = -1; //going up
        var output = [];

        // one position - forward
        var newY = pown.Y + factor * 1;
        var upBoard = this.do_transition(board, pid, playerid, pown.X, newY);
        if (upBoard != null)
            output.push(upBoard);

        // two positions - forward
        newY = pown.Y + factor * 2;
        var upUpBoard = this.do_transition(board, pid, playerid, pown.X, newY);
        if (upUpBoard != null)
            output.push(upUpBoard);

        // right corner (+1, +1)
        var newX = pown.X + factor * 1;
        newY = pown.Y + factor * 1;
        var rightCorner = this.do_transition(board, pid, playerid, newX, newY);
        if (rightCorner != null)
            output.push(rightCorner);

        // left corner
        newX = pown.X - (factor * 1);
        newY = pown.Y + factor * 1;
        var leftCorner = this.do_transition(board, pid, playerid, newX, newY);
        if (leftCorner != null)
            output.push(leftCorner);

        return output;
    }

    /**
     * Given a board, computes all the board states available for that board, given the current player as playerid.
     * @param {Board} board
     * @param {Number} playerid
     * @returns {Board[]} An array of Board, as all the available states.
     */
    getAllAvailableBoards(board, playerid) {
        var pawns = board.BlackPawns;
        if (playerid == 1)
            pawns = board.WhitePawns;
        var output = [];
        var me = this;
        for (var index = 0; index < pawns.length; index++) {
            var pawn = pawns[index];
            output = _.concat(output, me.getAllBoardsForPawn(board, pawn, index, playerid));
        };

        return output;
    }
}

export {Game};
