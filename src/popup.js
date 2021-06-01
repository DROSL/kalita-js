import startIcon from "./svg/start.svg";

class Popup {
	constructor(x, y) {
		this.popup = document.createElement("div");
		this.popup.className = "kalita-popup";
		this.popup.style.left = x + "px";
		this.popup.style.top = y + "px";

		this.playButton = document.createElement("button");
		this.playButton.className = "kalita-control kalita-start";
		startIcon.className = "kalita-icon";
		this.playButton.appendChild(startIcon);
		this.popup.appendChild(this.playButton);

		document.body.appendChild(this.popup);
	}

	destroy() {
		this.popup.remove();
	}
}

export default Popup;
