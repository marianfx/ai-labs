import * as _ from "lodash"
import {Player} from "./player"
import {Game} from "./game"
import * as gr from "graphlib"

class AlfaBetaPlayer extends Player{
    /**
     * @param {Number} theId
     * @param {Game} theGame
     */
    constructor(theId, theGame){
        super(theId,theGame);
        this.g = new gr.Graph()
    }

    strategy(callback){
        this.g = new gr.Graph()
        var movesTree = makeTree(this.game)
        console.log(movesTree.edges())

    }
    makeTree(theGame){
        var root = this.game.board
        this.g.setNode(root);
        this.expandNode(root, true, 2);
        return this.g;
    
        
        
    }
    expandNode(board, maximizingPlayer, depth )
    {
        if(depth==0)
            return;
        //create parent node
        var parent = board;   
        if (maximizingPlayer)
            var pid = this.id;
        else
            var pid = 3 - this.id;
        var moves = this.game.getAllAvailableMovesForPlayer(board, pid)
        
            
            console.log(moves);
            var childrens = []
            for(var i=0; i< _.size(moves);i++){
                var move = moves[i]
                console.log('Move :('+ move.XOld +','+move.YOld+')=>'+'('+ move.X +','+move.Y+')')
                var new_board = this.game.do_transition(this.game.board, 
                                                    move.PawnID, 
                                                    move.Playerid, 
                                                    move.X, 
                                                    move.Y);
                children.push(new_board);
            }

            for(var index=0; index<_.size(childrens); index++){
                var child = childrens[i];
                var m = moves[i]
                this.g.setNode(child)
                this.g.setEdge(parent, child , { move: m })
                this.expandNode(child, !maximizingPlayer, depth - 1)
            }

    }

        
}

export {AlfaBetaPlayer}