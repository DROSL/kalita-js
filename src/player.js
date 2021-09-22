import config from "./../config.json";
import Drag from "./drag";

import playIcon from "./svg/play.svg";
import pauseIcon from "./svg/pause.svg";
import replayIcon from "./svg/replay.svg";
import forwardIcon from "./svg/forward.svg";
import stopIcon from "./svg/stop.svg";
import downloadIcon from "./svg/download.svg";
import closeIcon from "./svg/close.svg";

class Player {
	constructor() {
		this.player = document.createElement("div");
		this.player.id = "kalita-player";
		this.player.setAttribute("aria-hidden", true);

		// error message
		this.errorMsg = document.createElement("div");
		this.errorMsg.className = "kalita-error";
		this.errorMsg.setAttribute("aria-hidden", true);
		this.errorMsgText = document.createTextNode("Error!");
		this.errorMsg.appendChild(this.errorMsgText);
		this.player.appendChild(this.errorMsg);

		// replay
		this.replayButton = document.createElement("button");
		this.replayButton.className = "kalita-control kalita-replay";
		this.replayButton.addEventListener("click", () => {
			this.replay();
		});
		replayIcon.className = "kalita-icon";
		this.replayButton.appendChild(replayIcon);
		this.player.appendChild(this.replayButton);

		// play/pause
		this.playButton = document.createElement("button");
		this.playButton.className = "kalita-control kalita-play";
		this.playButton.addEventListener("click", () => {
			this.playpause();
		});
		playIcon.className = "kalita-icon";
		this.playButton.appendChild(playIcon);
		pauseIcon.className = "kalita-icon";
		pauseIcon.setAttribute("aria-hidden", true);
		this.playButton.appendChild(pauseIcon);
		this.player.appendChild(this.playButton);

		// forward
		this.forwardButton = document.createElement("button");
		this.forwardButton.className = "kalita-control kalita-forward";
		this.forwardButton.addEventListener("click", () => {
			this.forward();
		});
		forwardIcon.className = "kalita-icon";
		this.forwardButton.appendChild(forwardIcon);
		this.player.appendChild(this.forwardButton);

		// slider
		this.slider = document.createElement("button");
		this.slider.className = "kalita-slider";
		this.slider.setAttribute("role", "slider");
		this.player.appendChild(this.slider);

		this.mediaRange = document.createElement("span");
		this.mediaRange.className = "kalita-range";
		this.slider.appendChild(this.mediaRange);

		this.mediaMeter = document.createElement("span");
		this.mediaMeter.className = "kalita-meter";
		this.mediaRange.appendChild(this.mediaMeter);

		const drag = new Drag(this.slider, this.mediaRange, (percentage) => {
			this.onDrag(percentage);
		});
		this.slider.addEventListener("keydown", (event) => {
			this.timeKeyDown(event);
		});

		// download
		this.downloadButton = document.createElement("button");
		this.downloadButton.className = "kalita-control kalita-download";
		this.downloadButton.addEventListener("click", () => {
			this.download();
		})
		downloadIcon.className = "kalita-icon";
		this.downloadButton.appendChild(downloadIcon);
		this.player.appendChild(this.downloadButton);

		// close
		this.closeButton = document.createElement("button");
		this.closeButton.className = "kalita-control kalita-close";
		this.closeButton.addEventListener("click", () => {
			this.close();
		});
		closeIcon.className = "kalita-icon";
		this.closeButton.appendChild(closeIcon);
		this.player.appendChild(this.closeButton);

		// audio events
		this.audio = new Audio();
		this.audio.addEventListener("canplaythrough", (event) => {
			this.audio.play();
		});
		this.audio.addEventListener("play", (event) => {
			this.play();
		});
		this.audio.addEventListener("pause", (event) => {
			this.pause();
		});
		this.audio.addEventListener("timeupdate", (event) => {
			this.timeupdate();
		});

		this.audio.addEventListener("error", (event) => {
			this.showError("An error occurred!");
		});

		this.audio.addEventListener("waiting", (event) => {
			console.log("waiting for media");
		});

		this.highlighter = null;
	}

	insert(target) {
		target.replaceWith(this.player);
	}

	start(highlighter) {
		this.hideError();
		this.player.setAttribute("aria-hidden", false);
		this.highlighter = highlighter;
		// TODO: get text from highlighter and call API
		this.audio.src = config.url + encodeURIComponent(this.highlighter.text);
	}

	stop() {
		this.audio.pause();
		this.audio.removeAttribute("src");
		if (this.highlighter) {
			this.highlighter.destroy();
		}
	}

	playpause() {
		if (this.audio.paused) {
			this.audio.play();
		} else {
			this.audio.pause();
		}
	}

	play() {
		playIcon.setAttribute("aria-hidden", true);
		pauseIcon.setAttribute("aria-hidden", false);
		if (this.highlighter) {
			this.highlighter.play(this.audio.duration, this.audio.currentTime);
		}
	}

	pause() {
		playIcon.setAttribute("aria-hidden", false);
		pauseIcon.setAttribute("aria-hidden", true);
		if (this.highlighter) {
			this.highlighter.pause();
		}
	}

	replay(seconds = 10) {
		const newTime = this.audio.currentTime - seconds;
		this.audio.currentTime = Math.max(0, newTime);
		if (this.highlighter) {
			this.highlighter.play(this.audio.duration, this.audio.currentTime);
		}
	}

	forward(seconds = 10) {
		const newTime = this.audio.currentTime + seconds;
		this.audio.currentTime = Math.min(this.audio.duration, newTime);
		if (this.highlighter) {
			this.highlighter.play(this.audio.duration, this.audio.currentTime);
		}
	}

	onDrag(percentage) {
		this.audio.currentTime = this.audio.duration * percentage;
		if (this.highlighter) {
			this.highlighter.play(this.audio.duration, this.audio.currentTime);
		}
	}

	timeKeyDown(event) {
		const { keyCode, shiftKey } = event;

		if (keyCode == 37) {
			event.preventDefault();
			this.replay(shiftKey ? 10 : 1);
		} else if (keyCode == 39) {
			event.preventDefault();
			this.forward(shiftKey ? 10 : 1);
		}
	}

	download() {
		let a = document.createElement("a");
		a.style.display = "none";
		a.href = this.audio.src;
		a.download = "speak.mp3";
		document.body.append(a);
		a.click();
		a.remove();
	}

	timeupdate() {
		this.mediaMeter.style.width =
			Math.floor((this.audio.currentTime / this.audio.duration) * 100) +
			"%";
	}

	showError(message) {
		// stop playing
		this.stop();

		// hide buttons
		this.replayButton.setAttribute("aria-hidden", true);
		this.playButton.setAttribute("aria-hidden", true);
		this.forwardButton.setAttribute("aria-hidden", true);
		this.slider.setAttribute("aria-hidden", true);
		this.downloadButton.setAttribute("aria-hidden", true);

		// show error message
		this.errorMsgText.nodeValue = message;
		this.errorMsg.setAttribute("aria-hidden", false);
	}

	hideError() {
		// show buttons
		this.replayButton.removeAttribute("aria-hidden");
		this.playButton.removeAttribute("aria-hidden");
		this.forwardButton.removeAttribute("aria-hidden");
		this.slider.removeAttribute("aria-hidden");
		this.downloadButton.removeAttribute("aria-hidden");

		// hide error message
		this.errorMsg.setAttribute("aria-hidden", true);
	}

	close() {
		this.stop();
		this.hideError();
		this.player.setAttribute("aria-hidden", true);
	}
}

export default Player;
