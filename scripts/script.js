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

const location = new kakao.maps.LatLng(37.400555, 127.111465);

const map = new kakao.maps.Map(document.querySelector("#map"), {
  center: location,
});

const bounds = new kakao.maps.LatLngBounds();

bounds.extend(location);
map.setBounds(bounds);

const marker = new kakao.maps.Marker({
  position: location,
});

marker.setMap(map);
map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);

document.querySelectorAll(".account").forEach((element) => {
  element.addEventListener("click", () => {
    const account = {
      groom: "박주빈 ㅇㅇ은행 00000000000000",
      groomFather: "박종국 ㅇㅇ은행 00000000000000",
      groomMother: "한성숙 ㅇㅇ은행 00000000000000",
      bride: "이승후 ㅇㅇ은행 00000000000000",
      brideFather: "성이름 ㅇㅇ은행 00000000000000",
      brideMother: "성이름 ㅇㅇ은행 00000000000000",
    }[element.id];

    navigator.clipboard.writeText(account).then(
      () => {
        alert("계좌번호를 복사했습니다.\n" + account);
      },
      () => {
        alert("계좌번호를 복사하지 못했습니다.\n" + account);
      }
    );
  });
});

Kakao.init("ea34a43f1bb28341f65031b415ac9f58");

document.querySelector("#share").addEventListener("click", () => {
  Kakao.Share.sendCustom({
    templateId: 87412,
  });
});

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDK2a3VYeYctmuCDnZYdcSIfjNVUeJvmWQ",
  authDomain: "wedding-invitation-9311b.firebaseapp.com",
  projectId: "wedding-invitation-9311b",
  storageBucket: "wedding-invitation-9311b.appspot.com",
  messagingSenderId: "166455853669",
  appId: "1:166455853669:web:11ffd8b897f80216e1bc8c",
  measurementId: "G-2RQXF8K1HC",
});

const analytics = getAnalytics(firebaseApp);
const firestore = getFirestore(firebaseApp);
const messagesCollection = collection(firestore, "messages");

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();

  addDoc(messagesCollection, {
    name: document.querySelector("#name").value.trim(),
    message: document.querySelector("#message").value.trim(),
    password: document.querySelector("#password").value.trim(),
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
  const messages = document.querySelector("#messages");
  messages.innerHTML = "";

  getDocs(query(messagesCollection, orderBy("timestamp", "desc")))
    .then(
      (snapshot) => {
        snapshot.forEach((message) => {
          const data = message.data();
          const name = document.createElement("span");
          name.appendChild(document.createTextNode(data.name));

          const removeText = document.createElement("span");
          removeText.appendChild(document.createTextNode("x"));

          const remove = document.createElement("div");
          remove.className = "w-6 c-gray c-p";
          remove.appendChild(removeText);

          remove.addEventListener("click", () => {
            const password = prompt("비밀번호를 입력하세요.", "").trim();

            if (password === data.password) {
              deleteDoc(doc(messagesCollection, message.id))
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

          const top = document.createElement("div");
          top.className = "w-60 fd-r jc-sb";
          top.appendChild(name);
          top.appendChild(remove);

          const text = document.createElement("span");
          text.appendChild(document.createTextNode(data.message));

          const bottom = document.createElement("div");
          bottom.className = "mt-5 fs-3";
          bottom.appendChild(text);

          const container = document.createElement("div");
          container.className = "mt-10 w-60 ai-fs";
          container.appendChild(top);
          container.appendChild(bottom);

          messages.appendChild(container);
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
