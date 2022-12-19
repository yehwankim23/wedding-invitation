import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";

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

Kakao.init("ea34a43f1bb28341f65031b415ac9f58");

document.getElementById("share").addEventListener("click", () => {
  Kakao.Share.sendCustom({
    templateId: 87412,
  });
});

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDK2a3VYeYctmuCDnZYdcSIfjNVUeJvmWQ",
  authDomain: "wedding-invitation-9311b.firebaseapp.com",
  projectId: "wedding-invitation-9311b",
  storageBucket: "wedding-invitation-9311b.appspot.com",
  messagingSenderId: "166455853669",
  appId: "1:166455853669:web:11ffd8b897f80216e1bc8c",
  measurementId: "G-2RQXF8K1HC",
};

const FIREBASE_APP = initializeApp(FIREBASE_CONFIG);
const ANALYTICS = getAnalytics(FIREBASE_APP);

const FIRESTORE = getFirestore(FIREBASE_APP);
const COLLECTION = collection(FIRESTORE, "messages");

document.getElementById("form").addEventListener("submit", (EVENT) => {
  EVENT.preventDefault();

  addDoc(COLLECTION, {
    name: document.getElementById("name").value.trim(),
    message: document.getElementById("message").value.trim(),
    password: document.getElementById("password").value.trim(),
    timestamp: serverTimestamp(),
  })
    .then(
      () => {
        alert("메시지를 등록했습니다.");
        getMessages();
      },
      () => {
        alert("메시지를 등록하지 못했습니다.");
      }
    )
    .catch(() => {
      alert("메시지를 등록하지 못했습니다.");
    });
});

function getMessages() {
  const MESSAGES = document.getElementById("messages");
  MESSAGES.innerHTML = "";

  getDocs(query(COLLECTION, orderBy("timestamp", "desc")))
    .then(
      (SNAPSHOT) => {
        SNAPSHOT.forEach((DOCUMENT) => {
          const NAME = document.createElement("span");
          NAME.appendChild(document.createTextNode(DOCUMENT.data().name));

          const X = document.createElement("span");
          X.appendChild(document.createTextNode("x"));

          const DELETE = document.createElement("div");
          DELETE.className = "w-6 c-gray c-p";
          DELETE.appendChild(X);

          DELETE.addEventListener("click", () => {
            const PASSWORD = prompt("비밀번호를 입력하세요.", "").trim();

            if (PASSWORD === DOCUMENT.data().password) {
              deleteDoc(doc(COLLECTION, DOCUMENT.id))
                .then(
                  () => {
                    alert("메시지를 삭제했습니다.");
                    getMessages();
                  },
                  () => {
                    alert("메시지를 삭제하지 못했습니다.");
                  }
                )
                .catch(() => {
                  alert("메시지를 삭제하지 못했습니다.");
                });
            } else {
              alert("비밀번호가 틀렸습니다.");
            }
          });

          const TOP = document.createElement("div");
          TOP.className = "w-60 fd-r jc-sb";
          TOP.appendChild(NAME);
          TOP.appendChild(DELETE);

          const MESSAGE = document.createElement("span");
          MESSAGE.appendChild(document.createTextNode(DOCUMENT.data().message));

          const BOTTOM = document.createElement("div");
          BOTTOM.className = "mt-5 fs-3";
          BOTTOM.appendChild(MESSAGE);

          const CONTAINER = document.createElement("div");
          CONTAINER.className = "mt-10 w-60 ai-fs";
          CONTAINER.appendChild(TOP);
          CONTAINER.appendChild(BOTTOM);

          MESSAGES.appendChild(CONTAINER);
        });
      },
      () => {
        alert("메시지를 불러오지 못했습니다.");
      }
    )
    .catch(() => {
      alert("메시지를 불러오지 못했습니다.");
    });
}

getMessages();
