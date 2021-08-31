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

		this.errorMsg = document.createElement("div");
		this.errorMsg.className = "kalita-error";
		this.errorMsg.setAttribute("aria-hidden", true);
		this.errorMsgText = document.createTextNode("Error!");
		this.errorMsg.appendChild(this.errorMsgText);
		this.player.appendChild(this.errorMsg);

		this.replayButton = document.createElement("button");
		this.replayButton.className = "kalita-control kalita-replay";
		this.replayButton.addEventListener("click", () => {
			this.replay();
		});
		replayIcon.className = "kalita-icon";
		this.replayButton.appendChild(replayIcon);
		this.player.appendChild(this.replayButton);

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

		this.forwardButton = document.createElement("button");
		this.forwardButton.className = "kalita-control kalita-forward";
		this.forwardButton.addEventListener("click", () => {
			this.forward();
		});
		forwardIcon.className = "kalita-icon";
		this.forwardButton.appendChild(forwardIcon);
		this.player.appendChild(this.forwardButton);

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

		this.downloadButton = document.createElement("button");
		this.downloadButton.className = "kalita-control kalita-download";
		downloadIcon.className = "kalita-icon";
		this.downloadButton.appendChild(downloadIcon);
		this.player.appendChild(this.downloadButton);

		this.closeButton = document.createElement("button");
		this.closeButton.className = "kalita-control kalita-close";
		this.closeButton.addEventListener("click", () => {
			this.close();
		});
		closeIcon.className = "kalita-icon";
		this.closeButton.appendChild(closeIcon);
		this.player.appendChild(this.closeButton);

		this.audio = new Audio();
		this.audio.addEventListener("canplaythrough", (event) => {
			this.audio.play();
		});
		this.audio.addEventListener("play", (event) => {
			this._play();
		});
		this.audio.addEventListener("pause", (event) => {
			this._pause();
		});
		this.audio.addEventListener("timeupdate", (event) => {
			this._timeupdate();
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
		this.audio.src = "speak.mp3";
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

	_play() {
		playIcon.setAttribute("aria-hidden", true);
		pauseIcon.setAttribute("aria-hidden", false);
		if (this.highlighter) {
			this.highlighter.play(this.audio.duration, this.audio.currentTime);
		}
	}

	_pause() {
		playIcon.setAttribute("aria-hidden", false);
		pauseIcon.setAttribute("aria-hidden", true);
		if (this.highlighter) {
			this.highlighter.pause();
		}
	}

	replay() {
		let newTime = this.audio.currentTime - 10;
		this.audio.currentTime = newTime > 0 ? newTime : 0;
		if (this.highlighter) {
			this.highlighter.play(this.audio.duration, this.audio.currentTime);
		}
	}

	forward() {
		let newTime = this.audio.currentTime + 10;
		this.audio.currentTime =
			newTime <= this.audio.duration ? newTime : this.audio.duration;
		if (this.highlighter) {
			this.highlighter.play(this.audio.duration, this.audio.currentTime);
		}
	}

	_timeupdate() {
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
