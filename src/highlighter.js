class Highlighter {
	constructor(selection) {
		this.selection = selection;
		this.range = selection.getRangeAt(0);
		this.text = selection.toString();

		this.textSpans = [];
		this.wordSpans = [];
		this.markedSpan = null;
		this.timer = null;
	}

	// returns string of selection
	toString() {
		return this.text;
	}

	// expands the selection so that it completely encloses the first and last (partially) selected words
	extendRange() {
		let startOffset = this.range.startOffset;
		while (
			startOffset > 0 &&
			this.range.startContainer.nodeValue.charAt(startOffset - 1).trim()
				.length > 0
		) {
			startOffset--;
		}
		this.range.setStart(this.range.startContainer, startOffset);

		let endOffset = this.range.endOffset;
		while (
			endOffset < this.range.endContainer.length &&
			this.range.endContainer.nodeValue.charAt(endOffset).trim().length >
				0
		) {
			endOffset++;
		}
		this.range.setEnd(this.range.endContainer, endOffset);

		this.text = this.range.toString();
	}

	// deep search for all text nodes that are (partially) in the selection
	getNodes() {
		const selection = this.selection;
		const parent = this.range.commonAncestorContainer;

		const isVisible = function (elem) {
			return Boolean(
				elem.offsetWidth ||
					elem.offsetHeight ||
					elem.getClientRects().length
			);
		};

		const recur = function (node) {
			let selectedNodes = [];

			if (node.childNodes.length > 0) {
				for (let childNode of node.childNodes) {
					selectedNodes = selectedNodes.concat(recur(childNode));
				}
			} else if (
				node.nodeType === Node.TEXT_NODE &&
				node.nodeValue.trim().length > 0 &&
				selection.containsNode(node) &&
				isVisible(node.parentElement)
			) {
				selectedNodes.push(node);
			}

			return selectedNodes;
		};

		return recur(parent);
	}

	// encloses each node and each word of the selection with a span element
	createSpans() {
		if (this.textSpans.length > 0 || this.wordSpans.length > 0) {
			return;
		}

		for (let node of this.getNodes()) {
			let nodeRange = document.createRange();

			if (node === this.range.startContainer) {
				nodeRange.setStart(node, this.range.startOffset);
			} else {
				nodeRange.setStart(node, 0);
			}

			if (node === this.range.endContainer) {
				nodeRange.setEnd(node, this.range.endOffset);
			} else {
				nodeRange.setEnd(node, node.length);
			}

			let textSpan = document.createElement("span");
			nodeRange.surroundContents(textSpan);
			this.textSpans.push(textSpan);

			let textNode = textSpan.lastChild;
			let startOffset = 0;
			let endOffset = 0;

			while (endOffset <= textNode.nodeValue.length) {
				if (
					textNode.nodeValue.charAt(endOffset).trim().length === 0 ||
					endOffset === textNode.nodeValue.length
				) {
					if (endOffset > startOffset) {
						let nodeRange = document.createRange();
						nodeRange.setStart(textNode, startOffset);
						nodeRange.setEnd(textNode, endOffset);

						let wordSpan = document.createElement("span");
						nodeRange.surroundContents(wordSpan);
						this.wordSpans.push(wordSpan);

						textNode = textSpan.lastChild;
						startOffset = 0;
						endOffset = 0;
					}

					startOffset = endOffset + 1;
				}

				endOffset++;
			}
		}

		this.selection.empty();
	}

	// highlights entire text of selection
	highlightText() {
		for (let textSpan of this.textSpans) {
			textSpan.classList.add("kalita-marked");
		}
	}

	// highlights one specific word of selection
	highlightWord(wordSpan) {
		if (this.markedWord) {
			this.markedWord.classList.remove("kalita-word");
		}
		wordSpan.classList.add("kalita-word");
		this.markedWord = wordSpan;
	}

	play(duration, offset = 0) {
		clearInterval(this.timer);

		const nowTime = new Date();

		const startTime = new Date(nowTime);
		startTime.setSeconds(startTime.getSeconds() - offset);

		const endTime = new Date(startTime);
		endTime.setSeconds(endTime.getSeconds() + duration);

		let totalChars = this.wordSpans.reduce(
			(counter, wordSpan) => counter + wordSpan.lastChild.length,
			0
		);
		let counter = 0;
		const words = this.wordSpans
			.map((wordSpan) => {
				let wordTime = new Date(startTime);
				let wordDuration = (counter / totalChars) * duration;
				wordTime.setSeconds(wordTime.getSeconds() + wordDuration);
				counter += wordSpan.lastChild.length;
				return {
					wordSpan: wordSpan,
					startAt: wordTime,
				};
			})
			.filter((word) => word.startAt >= nowTime);
		let currentWord = -1;

		const tick = () => {
			let tickTime = new Date();

			if (tickTime > endTime) {
				this.markedWord.classList.remove("kalita-word");
				this.markedWord == null;
				clearInterval(this.timer);
			}
			if (
				currentWord + 1 < words.length &&
				tickTime >= words[currentWord + 1].startAt
			) {
				this.highlightWord(words[++currentWord].wordSpan);
			}
		};
		this.timer = setInterval(tick, 100);
	}

	pause() {
		clearInterval(this.timer);
	}

	// removes all markings
	destroy() {
		clearInterval(this.timer);

		let wordSpan;
		while ((wordSpan = this.wordSpans.pop())) {
			wordSpan.replaceWith(...wordSpan.childNodes);
		}

		let textSpan;
		while ((textSpan = this.textSpans.pop())) {
			textSpan.replaceWith(...textSpan.childNodes);
		}
	}
}

export default Highlighter;
