import Player from "./player";
import Popup from "./popup";
import Highlighter from "./highlighter";

const player = new Player();

const target = document.getElementById("kalita-player");
player.insert(target);

let popup = null;
let highlighter = null;

document.addEventListener("selectionchange", (event) => {
	// check whether a selection has actually been made
	let selection = window.getSelection();
	if (selection && selection.toString()) {
		// create a new popup
		if (popup) {
			popup.destroy();
		}
		// TODO: determine position
		popup = new Popup(100, 100);
		popup.playButton.addEventListener("click", () => {
			// check whether a selection has actually been made
			let selection = window.getSelection();
			if (selection && selection.toString()) {
				// create new highlighter and play audio
				if (highlighter) {
					highlighter.destroy();
				}
				highlighter = new Highlighter(selection);
				highlighter.extendRange();
				highlighter.createSpans();
				highlighter.highlightText();
				player.start(highlighter);
			}
		});
	}
});

player.playButton.addEventListener("click", () => {
	let selection = window.getSelection();
	if (selection && selection.toString()) {
		highlighter = new Highlighter(selection);
	}
});
