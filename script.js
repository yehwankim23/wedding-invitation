const LOCATION = new kakao.maps.LatLng(33.450701, 126.570667);
const MAP = new kakao.maps.Map(document.getElementById("map"), {
  center: LOCATION,
});

const BOUND = new kakao.maps.LatLngBounds();

BOUND.extend(LOCATION);
MAP.setBounds(BOUND);

const MARKER = new kakao.maps.Marker({
  position: LOCATION,
});

MARKER.setMap(MAP);
MAP.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);
