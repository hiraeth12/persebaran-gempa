import mapboxgl from "mapbox-gl";

const Marker = ({ map, coordinates, magnitude, location, date, time }) => {
  new mapboxgl.Marker({ color: "red" })
    .setLngLat([parseFloat(coordinates[0]), parseFloat(coordinates[1])])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
        <strong>Location:</strong> ${location}<br>
        <strong>Magnitude:</strong> ${magnitude}<br>
        <strong>Date:</strong> ${date}<br>
        <strong>Time:</strong> ${time}<br>
        <strong>Latitude:</strong> ${coordinates[1]}<br>
        <strong>Longitude:</strong> ${coordinates[0]}`
      )
    )
    .addTo(map);
};

export default Marker;
