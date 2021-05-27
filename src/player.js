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
replayButton.appendChild(replayIcon);
player.appendChild(replayButton);

let playButton = document.createElement("button");
playButton.className = "kalita-control kalita-play";
playButton.appendChild(playIcon);
player.appendChild(playButton);

let forwardButton = document.createElement("button");
forwardButton.className = "kalita-control kalita-forward";
forwardButton.appendChild(forwardIcon);
player.appendChild(forwardButton);

let currentTime = document.createElement("span");
currentTime.className = "kalita-control kalita-current-time";
currentTime.setAttribute("role", "timer");
let currentTimeText = document.createTextNode("00:00");
currentTime.appendChild(currentTimeText);
player.appendChild(currentTime);

let slider = document.createElement("button");
slider.className = "kalita-slider";
slider.setAttribute("role", "slider");
player.appendChild(slider);

let remainingTime = document.createElement("span");
remainingTime.className = "kalita-control kalita-remaining-time";
remainingTime.setAttribute("role", "timer");
let remainingTimeText = document.createTextNode("-00:00");
remainingTime.appendChild(remainingTimeText);
player.appendChild(remainingTime);

let downloadButton = document.createElement("button");
downloadButton.className = "kalita-control kalita-download";
downloadButton.appendChild(downloadIcon);
player.appendChild(downloadButton);

let settingsButton = document.createElement("button");
settingsButton.className = "kalita-control kalita-settings";
settingsButton.appendChild(settingsIcon);
player.appendChild(settingsButton);

export default player;
