import * as $ from 'jquery'
import * as swal from 'sweetalert'
import * as styler from './chess.styler.js'
import {Pawn, Board, Game} from './mainobjects.js'

var theGame = new Game();

styler.prepareChessBoard();

theGame.getAllBoardsForPawn(theGame.board, theGame.board.BlackPawns[0], 0, 2);
theGame.getAllAvailableBoards(theGame.board, 2);