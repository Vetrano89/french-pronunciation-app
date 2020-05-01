function convertWordLocationsToCoordinates(wordLocations) {
	const wordLocationsRawCoords = Object.entries(wordLocations);
	return wordLocationsRawCoords.map(([wordLocationCoords, wordName]) => {
		const coordsString = wordLocationCoords.replace(/,/g, '').match(/.{1,2}/g)
		const coordsArray = coordsString.map(coords => {
				return {x: parseInt(coords.charAt(0)), y: parseInt(coords.charAt(1))};
		}).sort();
		return {[wordName]: coordsArray};
	})
}

export default class WordChallenge {
	constructor(data) {
		const {source_language, word, character_grid, word_locations, target_language} = data;
    this.sourceLanguage = source_language;
    this.word = word;
		this.characterGrid = character_grid;
		this.wordLocations = convertWordLocationsToCoordinates(word_locations);
		this.targetLanguage = target_language;
		this.solved = false;
	}
	
	isSolved(selectedLetterBoxes) {
		
	}
}