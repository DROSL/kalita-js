import startIcon from "./svg/start.svg";

class Popup {
	constructor() {
		this.popup = document.createElement("div");
		this.popup.className = "kalita-popup";
		this.popup.setAttribute("aria-hidden", true);

		this.playButton = document.createElement("button");
		this.playButton.className = "kalita-control kalita-start";
		startIcon.className = "kalita-icon";
		this.playButton.appendChild(startIcon);

		let playText = document.createElement("span");
		playText.className = "kalita-text";
		let playTextNode = document.createTextNode("Vorlesen");
		playText.appendChild(playTextNode);
		this.playButton.appendChild(playText);

		this.popup.appendChild(this.playButton);
		document.body.appendChild(this.popup);

		this.timeout = null;
	}

	show(duration = 5000) {
		let selection = window.getSelection();
		if (selection && selection.toString()) {
			let range = selection.getRangeAt(0);
			let rect = range.getBoundingClientRect();

			// TODO: check if (x,y) is in visible area
			let x =
				window.scrollX +
				rect.x +
				rect.width / 2 -
				this.popup.clientWidth / 2;
			let y = window.scrollY + rect.y - this.popup.clientHeight;

			this.popup.setAttribute("aria-hidden", false);
			this.popup.style.left = `${x}px`;
			this.popup.style.top = `${y}px`;

			clearTimeout(this.timeout);
			if (duration > 0) {
				this.timeout = setTimeout(() => {
					this.hide();
				}, duration);
			}
		}
	}

	hide() {
		clearTimeout(this.timeout);
		this.popup.setAttribute("aria-hidden", true);
	}
}

export default Popup;
