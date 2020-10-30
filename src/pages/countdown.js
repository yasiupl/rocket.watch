import { materialize, load, updateCountdown, ReadableDateString, Countdown } from '../js/utils'

export default function countdown(id) {

	const $main = document.getElementsByTagName("main")[0];
	const $info = document.getElementById("info");
	const $live = document.createElement("div");
	$live.id = "live";
	$main.className = "";
	$main.innerHTML = "";
	$main.appendChild($live);

	load(`launch/${(parseInt(id) ? ("?launch_library_id=" + id) : ("?search=" + id))}`, function (data) {

		const launch = data.results && data.results[0] || data;

		document.title = launch.name;

		$info.innerHTML = 
		`<div id="video"></div>
		<div id="details" class="card-content">
			<h1><a class="tooltipped" data-tooltip="More info" href="/#rocket=${launch.rocket.id}">${launch.name.replace("|", "</a> | ")}</h1>
			<h3 id="countdown${launch.launch_library_id}" style="font-size: 10rem">${launch.status.name}</h3>
			<div id="chips">
				<a class="chip" href="javascript:window.history.back();"><i class="fas fa-arrow-alt-circle-left"></i>Go Back</a>
				<a class="chip tooltipped" data-tooltip="More info" href="/#agency=${launch.launch_service_provider.id}">${launch.launch_service_provider.name}</a>
				<a class="chip tooltipped" data-tooltip="More info" href="/#pad=${launch.pad.id}"><i class="far fa-compass"></i>${launch.pad.name}</a>
				<a class="chip tooltipped" id="launchdate" data-tooltip="${launch.net}"><i class="far fa-clock"></i>${ReadableDateString(launch.net)}</a>
			</div>
			<p class="flow-text" id="description">${launch.mission && launch.mission.description || ""}</p>
		</div>
		<div class="card-action" id="buttons">
			<a class="waves-effect waves-light btn hoverable blurple" href="https://rocket.watch/discord" target="_blank"><i class="fab fa-discord"></i> Discord</a>
			<a class="waves-effect waves-light btn hoverable tooltipped" href="/#id=${launch.launch_library_id}" data-tooltip="Load live sources">Exit countdown mode</a>
		</div>`;

		let buttons = document.querySelector("#buttons");
		let countdown = document.querySelector("#countdown" + launch.launch_library_id);
		let badges = document.querySelector("#chips");

		if (launch.probability != "-1" && [3, 4, 7].indexOf(launch.status.id) == -1) {
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

		if (launch.status.id == 1 || launch.status.id == 6) {
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
	});
}