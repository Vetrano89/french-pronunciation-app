import React, { useState, useEffect } from 'react';
import { getResults, compareResults, MATCH_RESULTS } from '../utils/result-parsers';
import { toPercent } from '../utils/number-formatters';
import { useTranslateText } from '../effects/translate-effects';
import { isEmpty } from 'lodash';
import MicIcon from '../img/mic-icon.png';
import RightArrowIcon from '../img/right-arrow-icon.png';
import bemmer from 'bemmer';

var createReactClass = require('create-react-class');

class MessageText extends React.Component {
	constructor(props) {
		super(props)
		this.onUrlPress = this.onUrlPress.bind(this);
	}
	onUrlPress() {alert('original press')}

	render() {
		return <button onClick={this.onUrlPress}></button>
	}
}

const sentences = [
	`Voulez-vous coucher avec moi.`,
	`Je ne la comprends pas.`,
	`Je ne sais pas votre nom.`,
	`J'aime les pommes.`,
	`Il est génial et merveilleux.`,
	`Nous avons deux poulets que j'aime.`,
	`Elle est la pire mais elle peut boire beaucoup.`
];

function getSentence(index) {
	return sentences[index];
}

export default function AppController() {
	const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	const recognition = new SpeechRecognition();
    const SpeechGrammarList =
        window.SpeechGrammarList ||
        window.webkitSpeechGrammarList ||
        window.mozSpeechGrammarList ||
        window.msSpeechGrammarList ||
        window.oSpeechGrammarList;	const grammarList = new SpeechGrammarList();
	const grammar = '#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;'
	grammarList.addFromString(grammar, 1);
	recognition.grammars = grammarList;
	recognition.continuous = false;
	recognition.interimResults = true;
	recognition.lang = 'fr-FR';

	const [sentence, setSentence] = useState(0);
	//const [translatedSentence, setTranslatedSentence] = useState(useTranslateText());
	const [listening, setListening] = useState(false);
	const [interimResults, setInterimResults] = useState([]);
	const [finalResult, setFinalResult] = useState({});
	const [matches, setMatches] = useState(null);
	const [isSuccess, setIsSuccess] = useState(false);
	
	useEffect(async () => {
		recognition.addEventListener('start', function() { 
			console.log('Speech recognition service disconnected');
		});
		recognition.addEventListener('nomatch', function() { 
			console.log('Speech recognition service disconnected');
		});
	}, [])

	useEffect(() => {
		if (listening) {
			handleListen();
			setInterimResults([]);
		}
		if (finalResult.transcript && !listening) {
			setListening(false);
		}
	}, [listening, finalResult])

	const handleListen = () => {
		console.log('Start speech recognition...')
		recognition.start();
	}

	recognition.onresult = (event) => {
		const results = getResults(event);
		const {interimResult, finalResult} = results;

		if (!isEmpty(interimResult)) {
			const currentInterimResults = interimResults.concat([interimResult]);
			setInterimResults(currentInterimResults);
		}
		if (!isEmpty(finalResult)) {
			setListening(false);
			setFinalResult(
				finalResult
			);
			setIsSuccess(
				finalResult.transcript === getSentence(sentence)
			)
		}
	}

	recognition.onaudioend = (event) => {
		setListening(false);
		console.log('Audio End');
	}

	const micBuilder = bemmer.createBuilder('mic-icon');
	const micClass = micBuilder('', { listening });

	const arrowBuilder = bemmer.createBuilder('right-arrow-icon');
	const rightArrowClass = arrowBuilder('', { success: isSuccess });

	function finalResultsColor() {
		if (!finalResult.transcript) {
			return null;
		}
		const matches = compareResults(finalResult.transcript, getSentence(sentence));
		return (
			getSentence(sentence).split(' ').map((word, i) => {
				const matchColors = {
					[MATCH_RESULTS.match]: 'green',
					[MATCH_RESULTS.noMatch]: 'red',
					[MATCH_RESULTS.matchAfterNoMatch]: 'orange'
				}
				return <mark className={matchColors[matches[i]]}>{word + ' '}</mark>
			})
		);
	}

	function getNextSentence() {
		if (isSuccess) {
			if (sentence+1 < sentences.length) {
				setSentence(sentence+1);
				setMatches(null);
				setFinalResult({});
				setIsSuccess(false);
			} else {
				alert('Have nothing better to do? Merci mon ami.');
			}
		}
	}

	return (
		<div className="app-controller">
			<p>
				Say the following sentence out loud:
			</p>
			<div className="sentence-container">
				<h2>
					{getSentence(sentence)}
				</h2>
				<small>
					Translation (TBD)
				</small>
			</div>
			<div>
				<div>
					<img className={micClass} onClick={() => setListening(true)} src={MicIcon} />
				</div>
				<strong>You said...</strong>
				<p className="final-result">{finalResult.transcript || `-`}</p>
				<p className="result-comparison">{finalResultsColor() || `-`}</p>
				<div className="confidence-result">
					<strong>Recognition Confidence: </strong>
				</div>
				<span>{toPercent(finalResult.confidence)}</span>
			</div>
			<img className={rightArrowClass} onClick={() => getNextSentence()} src={RightArrowIcon} />
		</div>
	);
}

				{/* <h3>Interim Results</h3>
					{interimResults.map((interimResult, resultIndex) => <span key={resultIndex}>
						Confidence: {toPercent(interimResult.confidence)}
						Result: {interimResult.transcript}
					</span>)} */}