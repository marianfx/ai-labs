
class Pawn {
    // WHITE = 1
    // BLACK = 2
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
Y
|    7 | 0 0 0 0 0 0 0 0
|    6 | 2 2 2 2 2 2 2 2
|    5 | 0 0 0 0 0 0 0 0
|    4 | 0 0 0 0 0 0 0 0
|    3 | 0 0 0 0 0 0 0 0
|    2 | 0 0 0 0 0 0 0 0
|    1 | 1 1 1 1 1 1 1 1
|    0 | 0 0 0 0 0 0 0 0
|        0 1 2 3 4 5 6 7
------------------------>X
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
            this.pawns[0][i] = new Pawn(i, 1, 1 /*Pion.WHITE*/ );
            this.pawns[1][i] = new Pawn(i, 6, 2 /*Pion.BLACK*/ );

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

    is_final_state(playerid) {
        var target_line
        console.log("verifying if player");
        if (playerid == 1)
            target_line = 7;
        if (playerid == 2)
            target_line = 0;

        var player_pawns = this.pawns[playerid - 1];
        for (var i=0; i < 8; i++) {
            var pion = player_pawns[i];
            if (pion.y == target_line)
                return true;
        }
        return false;

    }

    toString(){
      var string='\n';
      for(var i = 7; i>=0; i--){
          string +=i+'|'+this.table[i]
        string +='\n'
      }
      string+='------------------\n |0,1,2,3,4,5,6,7'
      return string;
    }
}

class Game{

    constructor(){
        this.active_player = 1
        this.board = new Board()
    }

    get ActivePlayer(){ return this.active_player; }
    set ActivePlayer(value){ this.active_player = value; }

    get Board(){ return this.table; }
    set Board(value){ this.table = value; }

    /**
     * @param {Number} playerid
     */
    set_active_player(playerid) {
        this.active_player = playerid;
    }

    do_transition(board, pawn_id, new_x, new_y) {
      if(this.is_valid_transition(board, pawn_id, new_x, new_y)){
        //console.log("Yah bby it's valid transiton");
        var pawn = board.Pawns[this.active_player - 1][pawn_id];
        board.Table[pawn.y][pawn.x] = 0;

        (board.Pawns[this.active_player - 1][pawn_id]).x = new_x;
        (board.Pawns[this.active_player - 1][pawn_id]).y = new_y;


        if(board.Table[new_y][new_x] != 0){
          //console.log("need to make null pawn of opponent");
          var opponent = 3 - this.active_player
          for(var i = 0; i < 8; i++)
            if((board.Pawns[opponent - 1][i]).x == new_x &&
               (board.Pawns[opponent - 1][i]).y == new_y)
               board.Pawns[opponent - 1][i] = null
          }
        board.Table[new_y][new_x] = this.active_player;
      }
      else
        console.log("Sorry invalid transition");
    }
    
    is_valid_transition(board, pawn_id, new_x, new_y) {

        if (pawn_id < 0 && pawn_id > 7)
            return false; //uknonw pawn
        
        var pawn = board.Pawns[this.active_player - 1][pawn_id];
        if (pawn == null)
          return false //if pawn are null that means that pawn was eleminated
        
        console.log(pawn.X + ' ' + pawn.Y);

        //move up(if active_player is 1)
        //move down(if active player is 2)
        var factor;
        if (this.active_player == 1)
            factor = 1;
        //default go up =>
        //new_y - pawn.y > 0 => factor (new_y-pawn.y)>0

        if (this.active_player == 2)
            factor = -1;
        // default go down => new_y - pawn.y < 0
        // factor(new_y - paw.y)>0

        if (factor * (new_y - pawn.y) <= 0)
            return false; //can't go backward

        // check if i can move forward
        if (pawn.X == new_x) {
            var move_length = Math.abs(pawn.Y - new_y)
            if (move_length > 2)
                return false; //can't go more than 2 moves
            if (move_length == 1 && board.Table[new_y][new_x] == 0)
                return true; //if forward cell is empty i can go
            if ((move_length == 2) && (board.Table[new_y + factor * 1][new_x] == 0) &&
                (board.Table[new_y][new_x] == 0) && (pawn.Y == 4 - factor * 3))
                return true; //if forward 2 cells are empty and it's first move
            else
                return false;
        }

        // chech if i can move by diagonal
        if (Math.abs(new_x - pawn.x) == 1 && Math.abs(new_y - pawn.y) == 1) {
            if (board.Table[new_y][new_x] != 0 &&
                board.Table[new_y][new_x] != this.active_player)
                return true;
        }

        return false;
    }
}

export {Pawn, Board, Game};