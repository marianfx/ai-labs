import * as _ from 'lodash'
import {Pawn} from './pawn'

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

    get Pawns() {
        return this.pawns;
    }
    set Pawns(value) {
        this.pawns = value;
    }

    get Table() {
        return this.table;
    }
    set Table(value) {
        this.table = value;
    }

    get BlackPawns() {
        return this.pawns[1];
    }
    get WhitePawns() {
        return this.pawns[0];
    }

    get BlackPawnsCount() {
        return _.size(this.BlackPawns);
    }
    get WhitePawnsCount() {
        return _.size(this.WhitePawns);
    }

    toString() {
        var string = '\n';
        for (var i = 7; i >= 0; i--) {
            string += i + '|' + this.table[i]
            string += '\n'
        }
        string += '------------------\n |0,1,2,3,4,5,6,7'
        return string;
    }
}

export {Board}