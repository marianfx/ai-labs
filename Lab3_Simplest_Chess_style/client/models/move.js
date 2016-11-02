
class Move{

    /**
     * @param {Number} x - The X (Horizontal / Columns) parameter of the move.
     * @param {Number} y - The Y (vertical / rows) parameter of the move.
     * @param {Number} pawn_id - The id of the pawn moved
     * @param {Number} player_id - The id of the player moving the pawn.
     */
    constructor(x, y, old_x, old_y, pawn_id, player_id){
        this.X = x;
        this.Y = y;
        this.XOld = old_x;
        this.YOld = old_y;
        this.PawnID = pawn_id;
        this.PlayerID = player_id;
    }
}

export {Move}