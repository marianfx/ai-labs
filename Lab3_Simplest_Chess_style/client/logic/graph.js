import * as _ from "lodash"
import * as gr from "graphlib"

class Graph{

    constructor(theId, theGame){
        this.g = new gr.Graph();
        this.id = theId;
        this.game = theGame;
    }


    makeTree() {
        var root = this.game.board
        this.g.setNode(root, {
            board: root
        });
        this.expandNode(root, true, 2);
        return this.g;
    }

    expandNode(board, maximizingPlayer, depth) {
        if (depth == 0)
            return;
        //create parent node
        var parent = board;
        if (maximizingPlayer)
            var pid = this.id;
        else
            var pid = 3 - this.id;
        console.log("player" + pid + " on level" + depth);
        var moves = this.game.getAllAvailableMovesForPlayer(board, pid)
        console.log(moves);
        var childrens = []
        for (var i = 0; i < _.size(moves); i++) {
            var move = moves[i]
            console.log('Move :(' + move.XOld + ',' + move.YOld + ')=>' + '(' + move.X + ',' + move.Y + ')')
            var new_board = this.game.do_transition(this.game.board,
                move.PawnID,
                move.PlayerID,
                move.X,
                move.Y);
            childrens.push(new_board);
        }

        for (var index = 0; index < _.size(childrens); index++) {
            var child = childrens[index];
            var m = moves[index]
            this.g.setNode(child, {
                board: child
            })
            this.g.setEdge(parent, child, {
                move: m
            })
            this.expandNode(child, !maximizingPlayer, depth - 1)
        }

    }
}

export {Graph}