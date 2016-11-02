import {Pawn} from './models/pawn'
import {Board} from './models/board'
import {Game} from './logic/game'

var theGame = new Game();

theGame.getAllBoardsForPawn(theGame.board, theGame.board.BlackPawns[0], 0, 2);
theGame.getAllAvailableBoards(theGame.board, 2);