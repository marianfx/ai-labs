
import {Game} from '../logic/game'
import {Move} from '../models/move'

class Styler{

    /**
     * @param {Game} theGame
     */
    constructor(theGame){
      this.game = theGame;
      this.defaults = {
        unitLength: 60, // Height / Width of a square
        fontSize: 40,
        startingFen: '8/pppppppp/8/8/8/8/PPPPPPPP/8',
        colors: {
          inactiveDark: 'rgb(192,192,255)',
          inactiveLight: 'rgb(255,255,255)',
          active: 'rgb(127,255,255)'
        }
      };
      this.activeSquare = null;
      this.activePiece = null;
      this.currentPlayer = 2;
      this.pieceCharMap = {
        white: {
          pawn: "\u2659"
        },
        black: {
          pawn: "\u265f"
        }
      };
      this.pieceSymbolMap = {
        'P': {
          color: 'white',
          name: 'pawn'
        },
        'p': {
          color: 'black',
          name: 'pawn'
        },
      };
      this.armies = {
        white: [{
          type: 'P',
          loc: [1, 0]
        }, {
          type: 'P',
          loc: [1, 1]
        }, {
          type: 'P',
          loc: [1, 2]
        }, {
          type: 'P',
          loc: [1, 3]
        }, {
          type: 'P',
          loc: [1, 4]
        }, {
          type: 'P',
          loc: [1, 5]
        }, {
          type: 'P',
          loc: [1, 6]
        }, {
          type: 'P',
          loc: [1, 7]
        }],
        black: [{
          type: 'p',
          loc: [6, 0]
        }, {
          type: 'p',
          loc: [6, 1]
        }, {
          type: 'p',
          loc: [6, 2]
        }, {
          type: 'p',
          loc: [6, 3]
        }, {
          type: 'p',
          loc: [6, 4]
        }, {
          type: 'p',
          loc: [6, 5]
        }, {
          type: 'p',
          loc: [6, 6]
        }, {
          type: 'p',
          loc: [6, 7]
        }]
      };
      this.sweetAlert = require("sweetAlert");
      this.$ = require('jquery')
    }
    
    displayMessage(message, isError){
      if(isError)
        this.sweetAlert("Oops...", message, 'error')
      else
        this.sweetAlert("Hmm...", message)
    }

    drawSquare(ctx, row, col, style) {

      if(!ctx){
        var canvas = document.getElementById('board');
        ctx = canvas.getContext('2d');
      }

      var len = this.defaults.unitLength;
      if (!!style) {
        ctx.fillStyle = this.defaults.colors[style];
      } else if (row % 2 === col % 2) {
        // Light on Right
        ctx.fillStyle = this.defaults.colors.inactiveLight;
      } else {
        ctx.fillStyle = this.defaults.colors.inactiveDark;
      }
      ctx.fillRect(len * col, len * row, len, len);
    }

    drawSquares(ctx) {
      for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
          this.drawSquare(ctx, i, j);
        }
      }
    }

    drawPiece(ctx, char, row, col) {

      if(!ctx){
        var canvas = document.getElementById('board');
        ctx = canvas.getContext('2d');
      }

      var x = this.defaults.unitLength * col + (this.defaults.unitLength - this.defaults.fontSize) / 2;
      var y = this.defaults.unitLength * row - (this.defaults.unitLength - this.defaults.fontSize) / 4;
      var color = this.pieceSymbolMap[char].color;
      var symb = this.pieceSymbolMap[char].name;
      var outChar = this.pieceCharMap[color][symb];
      ctx.strokeText(outChar, x, y);
    }

    undrawPiece(ctx, row, col) {
      this.drawSquare(ctx, row, col);
    }

    drawPiecesFen(ctx, fen) {
      if (!fen) {
        fen = this.defaults.startingFen;
      }

      var row = 7,
        col = 0;
      for (var i = 0; i < fen.length; i++) {
        var char = fen.charAt(i);
        if (char === '/') { // "Newline"
          row--;
          col = 0;
        } else if (char.match(/\d/)) {
          col += parseInt(char, 10); // "Spacer"
        } else { // Piece
          this.drawPiece(ctx, char, row, col);
          col++;
        }
      }
    }

    drawArmies(ctx) {
      for (var army in this.armies) {
        if (this.armies.hasOwnProperty(army)) {
          for (var i = 0; i < this.armies[army].length; i++) {
            var piece = this.armies[army][i];
            this.drawPiece(ctx, piece.type, piece.loc[0], piece.loc[1]);
          }
        }
      }
    }

    /**
     * Return the piece on that square, otherwise null
     */
    getPiece(row, col) {
      for (var army in this.armies) {
        if (this.armies.hasOwnProperty(army)) {
          for (var i = 0; i < this.armies[army].length; i++) {
            var piece = this.armies[army][i];
            if (piece.loc[0] === row && piece.loc[1] === col) {
              return piece;
            }
          }
        }
      }
      return null;
    }

    cbSelectPiece(evt, obj) {
      // Get square coordinates of click

      // console.log(evt);
      var canvas = evt.target;
      var ctx = canvas.getContext('2d');

      var row = Math.floor((evt.y - 8) / obj.defaults.unitLength);
      var col = Math.floor((evt.x - 8) / obj.defaults.unitLength);

      // Find out what piece (if any) is on the square so it can be redrawn
      obj.activePiece = obj.getPiece(row, col);

      // If there is no piece here, return
      if (!obj.activePiece) {
        return;
      }

      if(obj.currentPlayer != 2){
        obj.sweetAlert("Oops...", "It is not your turn!", "error");
        return;
      }

      if(obj.game.board.table[row][col] == 1){
        obj.sweetAlert("Oops...", "You can move your pieces only!", "error");
        return;
      }

      obj.activeSquare = [row, col];
      obj.drawSquare(ctx, row, col, 'active');
      obj.drawPiece(ctx, obj.activePiece.type, row, col);
    }

    /**
     * @param {Styler} obj
     */
    cbReleasePiece(evt, obj) {
      //check if valid
      //if valid, drop piece there
      var canvas = evt.target;
      var ctx = canvas.getContext('2d');

      var row = Math.floor((evt.y - 8) / obj.defaults.unitLength);
      var col = Math.floor((evt.x - 8) / obj.defaults.unitLength);

      // If there is no piece here, return
      if (!obj.activePiece) {
        return;
      }

      var startY = obj.activePiece.loc[0];
      var startX = obj.activePiece.loc[1];
      var endY = row;
      var endX = col;
      //get pawn id
      var fp = null
      var pid = null
      var pawns = obj.game.board.pawns[obj.game.active_player - 1];
      for(var i = 0; i < 8; i ++){
        var pawn = pawns[i];
        if(pawn.x == startX && pawn.y == startY){
          fp = pawn;
          pid = i
          break;
        }
      }

      var move = new Move(endX, endY, startX, startY, pid, obj.game.active_player)

      obj.game.players[2].try_move(move);
      //obj.movePieceVisually(ctx, 'p', startY, startX, endY, endX);
    }

    movePieceVisually(char, srow, scol, erow, ecol){
      
      var canvas = document.getElementById('board');
      var ctx = canvas.getContext('2d');
      
      this.undrawPiece(ctx, srow, scol);
      this.undrawPiece(ctx, erow, ecol);
      this.drawPiece(ctx, char, erow, ecol);
      var color = 'black'
      if(char == 'P')
        color = 'white'

      for(var i = 0; i < 8; i++){
        if(this.armies[color][i].loc[0] == srow && this.armies[color][i].loc[1] == scol){
            this.armies[color][i].loc[0] = erow;
            this.armies[color][i].loc[1] = ecol;
        }
      }
    }

    /**
     * @param {Move} move
     */
    addMove(move){
        var str = "Move: Player " + move.PlayerID + ", pawn " + move.PawnID + " from (" + (move.YOld + 1) + "," + (move.XOld + 1) + ") to (" + (move.Y + 1) + "," + (move.X + 1) + ").";
        
        this.$('#moves' + (3 - move.PlayerID)).prepend("<li class=\"collection-item\">" + "<br/>" + "</li>");
        this.$('#moves' + move.PlayerID).prepend("<li class=\"collection-item\">" + str + "</li>");
    }

    /**
     * @param {Game} theGame
     */
    prepareChessBoard() {
      
      var canvas = document.getElementById('board');
      var ctx = canvas.getContext('2d');

      // defaults.fontSize = defaults.unitLength * .75;
      ctx.font = this.defaults.fontSize + "px \"Arial Unicode MS\"";
      ctx.textBaseline = "top";

      // Draw board
      this.drawSquares(ctx);

      // Draw pieces
      this.drawArmies(ctx);

      // Add event handlers
      var me = this;
      canvas.addEventListener('mousedown', function(evt){
          me.cbSelectPiece(evt, me);
      });
      canvas.addEventListener('mouseup', function(evt){
          me.cbReleasePiece(evt, me);
      });
    }
}

export {Styler}
