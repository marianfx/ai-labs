import * as $ from 'jquery'
import * as swal from 'sweetalert'
import {Pawn, Board, Game} from './mainobjects.js'

var theGame = new Game();

theGame.getAllBoardsForPawn(theGame.board, theGame.board.BlackPawns[0], 0, 2);
theGame.getAllAvailableBoards(theGame.board, 2);