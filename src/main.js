import Player from "./player";
import Popup from "./popup";
import Highlighter from "./highlighter";

let player = new Player();
let popup = new Popup();
let highlighter = null;

let target = document.getElementById("kalita-player");
player.insert(target);

document.addEventListener("mouseup", (event) => {
	popup.show(5000);
});

popup.playButton.addEventListener("click", () => {
	// check whether a selection has actually been made
	let selection = window.getSelection();
	if (selection && selection.toString()) {
		popup.hide();
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
