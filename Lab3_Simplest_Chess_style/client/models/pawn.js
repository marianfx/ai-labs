class Pawn {
    // WHITE = 1 = computer
    // BLACK = 2 = human
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.prev_x = x;
        this.prev_y = y;
        this.was_moved_prev = false;
        this.color = color;
    }

    get X() {
        return this.x;
    }
    set X(value) {
        this.x = value;
    }

    get Y() {
        return this.y;
    }
    set Y(value) {
        this.y = value;
    }

    get Color() {
        return this.color;
    }
    set Color(value) {
        this.color = value;
    }
}

export {
    Pawn
}