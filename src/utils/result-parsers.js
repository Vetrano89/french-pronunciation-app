import { isEmpty, upperFirst } from 'lodash';

const emptyResult = {
	interimResults: {},
	finalResult: {}
};

function asSentence(string) {
	return upperFirst(string) + '.';
}

export const MATCH_RESULTS = {
	match: 'MATCH',
	matchAfterNoMatch: 'MATCH_AFTER_NO_MATCH',
	noMatch: 'NO_MATCH'
}

export function getResults(event) {
    if (!event || !event.results) {
        return emptyResult;
    }
    let finalResult = {}, interimResult = {}, i;
    for (i=0; i < event.results.length; i++) {
        const result = event.results[i];
        if(result.isFinal) {
            finalResult = getResult(result);
        } else {
            interimResult = getResult(result);
        }
    }

    return {interimResult, finalResult};
};

function getResult(result) {
    return {
        confidence: result[0].confidence || {},
        transcript: asSentence(result[0].transcript) || {}
    };
};

export function compareResults(actualResult, expectedResult) {
	const expectedWords = expectedResult.split(' ');
    if (actualResult === expectedResult) {
        return expectedWords.map(() => MATCH_RESULTS.match);
		}
		
		if (!actualResult || actualResult.length === 0) {
			return [];
		}
    
		const actualWords = actualResult.split(' ');
		    
    return expectedWords.reduce((matchArray, expectedWord, i) => {
        const actualWord = actualWords[i];
				const previousWordResult = matchArray[i-1];
				const isMatch = expectedWord === actualWord;
        if (isMatch) {
					if (!previousWordResult) {
						matchArray.push(MATCH_RESULTS.match);
					} else {
						matchArray.push(
							previousWordResult === MATCH_RESULTS.noMatch ? MATCH_RESULTS.matchAfterNoMatch : previousWordResult
						);
					}
        } else {
					matchArray.push(MATCH_RESULTS.noMatch)
				}
				return matchArray;
    }, []);
}