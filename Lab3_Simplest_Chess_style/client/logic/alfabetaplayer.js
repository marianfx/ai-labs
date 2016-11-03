import * as _ from "lodash"
import {
    Player
} from "./player"
import {
    Game
} from "./game"

import * as gr from "graphlib"
import {Graph} from './graph'


class AlfaBetaPlayer extends Player {
    /**
     * @param {Number} theId
     * @param {Game} theGame
     */
    constructor(theId, theGame) {
        super(theId, theGame);
        this.graph = new Graph(this.id, this.game);
    }

    strategy(game, callback) {
        this.graph = new Graph(this.id, game);

        var movesTree = this.graph.makeTree();
        //console.log(movesTree.edges())

        var move = (this.alphabeta(this.game.board, 5,
            Number.MIN_SAFE_INTEGER,
            Number.MAX_SAFE_INTEGER,
            true)).m.move;

        //console.log("alfa beta move:");
        //console.log(move);

        this.executeMove(game, move);
        callback(game)
    }

    /**
     * @param {Board} board
     */
    getScoreForBoard(board){
        var p1 = 1;
        var p2 = 2;

        // check final state
        var isFinalStateP1 = this.game.is_final_state(board, p1);
        var fp1 = 0;
        var fp2 = 0;
        if(isFinalStateP1)
            fp1 = 1;
        if(isFinalStateP2)
            fp2 = 1;
        var isFinalStateP2 = this.game.is_final_state(board, p2);

        //nr pioni
        var P1 = 0;
        var P2 = 0;
        for (var i = 0; i < 8; i ++){
            if(!board.pawns[0][i].IsOut)
                P1 += 1
            if(!board.pawns[1][i].IsOut)
                P2 += 1
        }

        // mobility
        var M1 = this.game.getAllAvailableMovesForPlayer(board, p1);
        var M2 = this.game.getAllAvailableMovesForPlayer(board, p2);

        //pawns I can eat
        var D1 = 0;
        var D2 = 0;
        for(var i = 0; i < _.size(M1); i++){
            var move = M1[i];
            var output = this.game.is_valid_transition(board, move.PawnID, move.PlayerID, move.X, move.Y);
            if(output.type_move == 'attack' || output.type_move == 'enpassan')
                D1 += 1;
        }

        for(var i = 0; i < _.size(M2); i++){
            var move = M2[i];
            var output = this.game.is_valid_transition(board, move.PawnID, move.PlayerID, move.X, move.Y);
            if(output.type_move == 'attack' || output.type_move == 'enpassan')
                D2 += 1;
        }

        //straight way
        var C1 = 0;
        var C2 = 0;
        var DST1 = 6;
        var DST2 = 6;
        for (var i = 0; i < _.size(board.pawns[0]); i++){
            var pawn = board.pawns[0][i];
            var clr = true;
            for(var j = pawn.y; j <=7; j++){
                if(board.table[j][pawn.x] == 2)
                    clr = false;
            }
            if(clr){
                C1 += 1;
                var tempDST = Math.abs(pawn.y - 7);
                if (tempDST < DST1)
                    DST1 = tempDST;
            }
        }

        for (var i = 0; i < _.size(board.pawns[1]); i++){
            var pawn = board.pawns[1][i];
            var clr = true;
            for(var j = pawn.y; j >=0; j--){
                if(board.table[j][pawn.x] == 1)
                    clr = false;
            }
            
            if(clr){
                C2 += 1;
                var tempDST = pawn.y;
                if (tempDST < DST2)
                    DST2 = tempDST;
            }
        }

        var theScore = Number.MAX_SAFE_INTEGER * fp1 - Number.MAX_SAFE_INTEGER * fp2;
        theScore += 10 * (P1 - P2);
        theScore += 3 * (C1 - C2);
        //theScore += 3 * (DST1 - DST2);
        theScore += 2 * (D1 - D2);
        theScore += (_.size(M1) - _.size(M2));
        
        return {
                score: theScore,
                m: null
            }
    }

    alphabeta(node, depth, alfa, beta, maximizingPlayer) {
        var childNodes = this.graph.g.outEdges(node);
        var v;

        if (depth == 0 || childNodes.length < 1) {
            //console.log("Nod frunza")
            //console.log(node)
            //console.log(this.graph.g.node(node));
            return this.getScoreForBoard(this.graph.g.node(node).board);

        }

        var best_child;
        if (maximizingPlayer) {
            v = Number.MIN_SAFE_INTEGER;

            for (var i = 0; i < childNodes.length; i++) {
                var child = childNodes[i].w;
                //console.log(child);
                var child_score = (this.alphabeta(child, depth - 1, alfa, beta, false)).score;

                if (child_score >= v) {
                    v = child_score;
                    best_child = child;
                }
                alfa = Math.max(alfa, v);
                if (beta <= alfa) {
                    // console.log("break from max intermediar");
                    break;
                }
            }
            return {
                score: v,
                m: this.graph.g.edge(node, best_child)
            };
        } else {
            var v = Number.MAX_SAFE_INTEGER;
            for (var i = 0; i < childNodes.length; i++) {
                var child = childNodes[i].w;
                // console.log("NOD INTERMEDIAR/final MIN");
                //console.log(child);

                var child_score = (this.alphabeta(child, depth - 1, alfa,
                    beta, true)).score;
                if (child_score < v) {
                    v = child_score;
                    best_child = this.graph.g.edge(node, child);
                }

                beta = Math.min(beta, v);
                if (beta <= alfa) {
                    // console.log("break from min intermediar");
                    break;
                }
            }
            return {
                score: v,
                m: this.graph.g.edge(node, best_child)
            };
        }
    }
}

export {
    AlfaBetaPlayer
}