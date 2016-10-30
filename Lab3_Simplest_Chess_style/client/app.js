import * as $ from 'jquery'
import * as swal from 'sweetalert'
import * as styler from './chess.styler.js'
import {Pawn, Board, Game} from './mainobjects.js'

styler.prepareChessBoard();

var x = new Game();