import * as $ from 'jquery'
import * as swal from 'sweetalert'
import * as styler from './chess.styler.js'
import {Pawn, Board, Game} from './mainobjects.js'

styler.prepareChessBoard();

var x = new Game();
x.getAllBoardsForPawn(x.board, x.board.BlackPawns[0], 0, 2);