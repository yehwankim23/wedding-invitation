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

const ACCOUNTS = {
  groom: "성이름 ㅇㅇ은행 00000000000000",
  groomFather: "성이름 ㅇㅇ은행 00000000000000",
  groomMother: "성이름 ㅇㅇ은행 00000000000000",
  bride: "성이름 ㅇㅇ은행 00000000000000",
  brideFather: "성이름 ㅇㅇ은행 00000000000000",
  brideMother: "성이름 ㅇㅇ은행 00000000000000",
};

[...document.getElementsByClassName("account")].forEach((ELEMENT) => {
  ELEMENT.addEventListener("click", () => {
    const ACCOUNT = ACCOUNTS[ELEMENT.id];

    navigator.clipboard.writeText(ACCOUNT).then(
      () => {
        alert("계좌번호를 복사했습니다.\n" + ACCOUNT);
      },
      () => {
        alert("계좌번호를 복사하지 못했습니다.\n" + ACCOUNT);
      }
    );
  });
});
