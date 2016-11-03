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

    strategy(game, callback){
        this.g = new gr.Graph()
        var movesTree = this.makeTree(this.game)
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
    alphabeta(node, depth, alfa, beta, maximizingPlayer){
        var childNodes = this.g.outEdges(node);
        var v ;
        if(depth==0 || childNodes.length<1)
            {
                console.log("Nod frunza")
                console.log(node)
                console.log(this.g.node(node));
                return {score:Math.random()*10, m: null}
                
            }
            var best_child;
            if(maximizingPlayer){
            v = Number.MIN_SAFE_INTEGER;
            
                for(var i=0; i<childNodes.length;i++){
                    var child=childNodes[i].w;
                    var child_score = (this.alphabeta(child, depth - 1, alfa, beta, false)).score;
                    if (child_score>=v){
                        v = child_score;
                        best_child = child;
                    }
                    alfa = Math.max(alfa,v);
                    if (beta<=alfa)
                        {   
                            // console.log("break from max intermediar");
                            break;
                        }
                };
                return {score :v, m:this.g.edge(node,best_child)} ;
            }else{
                var v = Number.MAX_SAFE_INTEGER;
                for(var i=0; i<childNodes.length; i++){   
                    var child = childNodes[i].w;
                    // console.log("NOD INTERMEDIAR/final MIN");
                    console.log(child);
                    
                    var child_score =(this.alphabeta(child,depth-1, alfa,
                                              beta, true)).score;
                    if (child_score<v){
                        v = child_score;
                        best_child = this.g.edge(node, child);
                    }
                    beta = Math.min(beta,v);
                    if (beta<=alfa)
                        {   
                            // console.log("break from min intermediar");
                            break;
                        }
                        
                };
                return {score :v, m: this.g.edge(node,best_child)} ;
            }
    }
    makeTree(theGame){
        var root = this.game.board
        this.g.setNode(root, {board:root});
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
        console.log("player" + pid+" on level"+ depth);
        var moves = this.game.getAllAvailableMovesForPlayer(board, pid)
        console.log(moves);
        var childrens = []
        for(var i=0; i< _.size(moves);i++){
            var move = moves[i]
            console.log('Move :('+ move.XOld +','+move.YOld+')=>'+'('+ move.X +','+move.Y+')')
            var new_board = this.game.do_transition(this.game.board, 
                                                move.PawnID, 
                                                move.PlayerID, 
                                                move.X, 
                                                move.Y);
            childrens.push(new_board);
        }

            for(var index=0; index<_.size(childrens); index++){
                var child = childrens[index];
                var m = moves[index]
                this.g.setNode(child,{board:child})
                this.g.setEdge(parent, child , { move: m })
                this.expandNode(child, !maximizingPlayer, depth - 1)
            }

    }

        
}

export {AlfaBetaPlayer}