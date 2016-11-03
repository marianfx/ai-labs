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
        console.log(movesTree.edges())

        var move = (this.alphabeta(this.game.board, 5,
            Number.MIN_SAFE_INTEGER,
            Number.MAX_SAFE_INTEGER,
            true)).m.move;

        console.log("alfa beta move:");
        console.log(move);

        this.executeMove(game, move);
        callback(game)
    }

    /**
     * @param {Board} node
     */
    getScoreForBoard(node){
        return {
                score: Math.random() * 10,
                m: null
            }
    }

    alphabeta(node, depth, alfa, beta, maximizingPlayer) {
        var childNodes = this.graph.g.outEdges(node);
        var v;

        if (depth == 0 || childNodes.length < 1) {
            console.log("Nod frunza")
            console.log(node)
            console.log(this.graph.g.node(node));
            return this.getScoreForBoard(this.graph.g.node(node).board);

        }

        var best_child;
        if (maximizingPlayer) {
            v = Number.MIN_SAFE_INTEGER;

            for (var i = 0; i < childNodes.length; i++) {
                var child = childNodes[i].w;
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
                console.log(child);

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