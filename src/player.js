let player = document.createElement("div");
player.id = "kalita-player";

import playIcon from "./svg/play.svg";
import pauseIcon from "./svg/pause.svg";
import replayIcon from "./svg/replay.svg";
import forwardIcon from "./svg/forward.svg";
import stopIcon from "./svg/stop.svg";
import downloadIcon from "./svg/download.svg";
import settingsIcon from "./svg/settings.svg";

let replayButton = document.createElement("button");
replayButton.className = "kalita-control kalita-replay";
replayIcon.className = "kalita-icon";
replayButton.appendChild(replayIcon);
player.appendChild(replayButton);

let playButton = document.createElement("button");
playButton.className = "kalita-control kalita-play";
playIcon.className = "kalita-icon";
playButton.appendChild(playIcon);
player.appendChild(playButton);

let forwardButton = document.createElement("button");
forwardButton.className = "kalita-control kalita-forward";
forwardIcon.className = "kalita-icon";
forwardButton.appendChild(forwardIcon);
player.appendChild(forwardButton);

let slider = document.createElement("button");
slider.className = "kalita-slider";
slider.setAttribute("role", "slider");
player.appendChild(slider);

let mediaRange = document.createElement("span");
mediaRange.className = "kalita-range";
slider.appendChild(mediaRange);

let mediaMeter = document.createElement("span");
mediaMeter.className = "kalita-meter";
mediaRange.appendChild(mediaMeter);

let downloadButton = document.createElement("button");
downloadButton.className = "kalita-control kalita-download";
downloadIcon.className = "kalita-icon";
downloadButton.appendChild(downloadIcon);
player.appendChild(downloadButton);

let settingsButton = document.createElement("button");
settingsButton.className = "kalita-control kalita-settings";
settingsIcon.className = "kalita-icon";
settingsButton.appendChild(settingsIcon);
player.appendChild(settingsButton);

export default player;
