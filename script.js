$(document).ready(function () {
  $("#routeForm").html(`
    <div id="destinations">
      <div class="destination">
        <label for="origin1">Point de départ :</label>
        <input type="text" class="origin" name="origin1" id="origin1" required /><br /><br />
        <label for="waypoint1">Destination :</label>
        <input type="text" class="waypoint" name="waypoint1" required>
        <label for="date1">Date :</label>
        <input type="text" class="date" name="date1" required>
        <label for="time1">Heure :</label>
        <input type="time" class="time" name="time1" id="time1" min="00:00" max="23:59" required><br><br>
        <button type="button" class="openRouteJR">Ouvrir JR East</button>
        <button type="button" class="openRouteGM">Ouvrir Google Maps</button><br><br>
      </div>
    </div>
    <button type="button" id="addDestination">Ajouter une destination</button>
  `);

  $("#routeForm").on("click", "#addDestination", function () {
    addDestination(); // Appelle la fonction pour ajouter une nouvelle destination
  });

  $("#routeForm").on("click", ".openRouteJR", function () {
    const destination = $(this).siblings(".waypoint").val();
    const origin = $("#origin1").val();
    const date = $(this).siblings(".date").val();
    const time = $(this).siblings(".time").val().replace(":", ""); // Remove colon from time
    const url = generateJREastURL(origin, destination, date, time);
    window.open(url, "_blank");
  });

  $("#routeForm").on("click", ".openRouteGM", function () {
    const destination = $(this).siblings(".waypoint").val();
    const origin = $("#origin1").val();
    const time = getTimeFromURL();
    const url = generateGoogleMapsURL(origin, destination, time);
    window.open(url, "_blank");
  });

  function addDestination() {
    const destinationCount = $(".destination").length + 1;
    const newDestination = `
      <div class="destination">
        <label for="waypoint${destinationCount}">Destination :</label>
        <input type="text" class="waypoint" name="waypoint${destinationCount}" required>
        <label for="date${destinationCount}">Date :</label>
        <input type="text" class="date" name="date${destinationCount}" required>
        <label for="time${destinationCount}">Heure :</label>
        <input type="time" class="time" name="time${destinationCount}" id="time${destinationCount}" min="00:00" max="23:59" required><br><br>
        <button type="button" class="openRouteJR">Ouvrir JR East</button>
        <button type="button" class="openRouteGM">Ouvrir Google Maps</button><br><br>
      </div>
    `;
    $("#destinations").append(newDestination);
  }

  function generateJREastURL(origin, destination, date, time) {
    const baseURL = "https://transit.jre-maas.com/ja/result?realTime=true";
    const from = `from=${encodeURIComponent(origin)}`;
    const fromName = `fromName=${encodeURIComponent(origin)}`;
    const to = `to=${encodeURIComponent(destination)}`;
    const toName = `toName=${encodeURIComponent(destination)}`;
    const dateParam = `date=${date.replace(/-/g, "")}`;
    const timeParam = `time=${time}`;
    const searchType = "searchType=departure";
    return `${baseURL}&${from}&${fromName}&${to}&${toName}&${dateParam}&${timeParam}&${searchType}`;
  }

  function getTimeFromURL() {
    const url = window.location.href;
    const match = url.match(/&j(\d+)/);
    if (match) {
      return parseInt(match[1]);
    }
    return null;
  }

  function generateGoogleMapsURL(origin, destination, time) {
    const baseURL = "https://www.google.com/maps/dir/?api=1";
    const directionsMode = "directionsmode=transit";
    const timeType = "ttype=arr"; // Type de temps (départ ou arrivée)
    return `${baseURL}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&${directionsMode}&${timeType}&time=${time}`;
  }

  $(".date").datepicker({
    dateFormat: "yy-mm-dd",
    minDate: 0,
  });
});
