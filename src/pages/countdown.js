import { materialize, updateCountdown, ReadableDateString, Countdown } from '../js/utils'

export default function countdown(data) {

	let $main = document.getElementsByTagName("main")[0];
	let $info = document.getElementById("info");
	let $live = document.createElement("div");
	$live.id = "live";
	$main.className = "";
	$main.innerHTML = "";
	$main.appendChild($live);



	let launch = data.launches[0];

	document.title = launch.name;

	$info.innerHTML = `<div id="video"></div>
							<div id="details" class="card-content">
								<h1><a class="tooltipped" data-tooltip="More info" href="/#rocket=${launch.rocket.id}">${launch.name.replace("|", "</a> | ")}</h1>
								<h3 id="countdown${launch.id}" style="font-size: 10rem">${launch.status}</h3>
								<div id="chips">
									<a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a>
									<a class="chip tooltipped" data-tooltip="More info" href="/#agency=${launch.agency.id}"><img src="${launch.agency.icon}?size=32" onerror=this.onerror=null;this.src="${launch.agency.countryFlag}">${launch.agency.name}</a>
									<a class="chip tooltipped" data-tooltip="More info" href="/#pad=${launch.location.pads && launch.location.pads[0].id}"><i class="far fa-compass"></i>${launch.location.pads[0].name}</a>
									<a class="chip tooltipped" id="launchdate" data-tooltip="${launch.net}"><i class="far fa-clock"></i>${ReadableDateString(launch.net)}</a>
								</div>
								<p class="flow-text" id="description">${launch.description}</p>
							</div>
							<div id="buttons">
								<a class="waves-effect waves-light btn hoverable blurple" href="https://rocket.watch/discord" target="_blank"><i class="fab fa-discord"></i> Discord</a>
								<a class="waves-effect waves-light btn hoverable tooltipped" href="/#id=${launch.id}" data-tooltip="Load live sources">Exit countdown mode</a>
							</div>
							</br>`;

	let buttons = document.querySelector("#buttons");
	let countdown = document.querySelector("#countdown" + launch.id);
	let badges = document.querySelector("#chips");

	if (launch.probability != "-1" && [3, 4, 7].indexOf(launch.statuscode) == -1) {
		badges.innerHTML += `<a class="chip tooltipped" data-tooltip="Launch probability %">${launch.probability}% probability</a>`
	}

	if (navigator.share) {
		buttons.innerHTML += '<a class="waves-effect waves-light btn hoverable" onclick="window.share()"><i class="fas fa-share-alt"></i></a>';
		window.share = function () {
			navigator.share({
				title: launch.name,
				text: launch.description.substring(0, 100) + '...',
				url: location.href
			})
		}
	}

	if (launch.agency.social.reddit) {
		buttons.innerHTML += `<a class="waves-effect waves-light btn hoverable" href="https://www.reddit.com/r/${launch.agency.social.reddit}" target="_blank">/r/${launch.agency.social.reddit} Subreddit</a>`;
	}

	if (launch.statuscode == 1 || launch.statuscode == 6) {
		let count = setInterval(function () {
			document.title = `[${Countdown(launch.net)}] ${launch.name.split("|")[1]}`;
			countdown.innerHTML = Countdown(launch.net)
		}, 1000);
		countdowns.push(count);

		let updatecount = setInterval(function () {
			updateCountdown(launch);
		}, 60000);
		countdowns.push(updatecount);
	}
	materialize();
}