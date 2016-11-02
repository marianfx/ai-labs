import {Pawn} from './models/pawn'
import {Board} from './models/board'
import {Game} from './logic/game'
import {AlfaBetaPlayer} from './logic/alfabetaplayer'
var theGame = new Game();
theGame.runGame(1);
var abPlayer = new AlfaBetaPlayer(1,theGame);
