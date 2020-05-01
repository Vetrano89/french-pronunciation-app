function coordInRange(origin, destinaton) {
	return Math.abs(potentialNeighbor.x - this.x) < 2;
}

export class LetterBox {
	constructor(letter, x, y) {
    this.letter = letter;
    this.x = x;
		this.y = y;
		this.selected = false;
  }
	
	/**
	 * @param {boolean} value
	 */
	set selected(value) {
		this.selected === value;
	}
}