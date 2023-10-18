import QRCode from "react-qr-code";
import { initializeApp } from "firebase/app";
import {
  addDoc,
  deleteDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { collection, doc } from "firebase/firestore";

import "firebase/firestore";
import "../App.css";
import { useEffect, useRef, useState } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyCAA-ycjtymyLdw2MvSR6z7R_OwxuWnEeE",
  authDomain: "webrtc-ab238.firebaseapp.com",
  projectId: "webrtc-ab238",
  storageBucket: "webrtc-ab238.appspot.com",
  messagingSenderId: "186224116935",
  appId: "1:186224116935:web:bfae4b2198e142e2792ae2",
  measurementId: "G-JMK7R5RSYD",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// }

const firestore = getFirestore();

// Initialize WebRTC
const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

function Home() {
  const pc = new RTCPeerConnection(servers);
  const [lobbyId, setLobbyId] = useState("");
  const [live, setLive] = useState(false);

  const remoteRef = useRef<HTMLVideoElement | null>(null);
  async function createLobby(setLobbyId: any) {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });
    const remoteStream = new MediaStream();

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });
    pc.ontrack = (event) => {
      console.log("got remote track", event.streams[0]);
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
        setLive(true);
      });
    };

    remoteRef.current!.srcObject = remoteStream;
    const callDoc = doc(collection(firestore, "calls"));
    const offerCandidates = collection(firestore, "offerCandidates");
    const answerCandidates = collection(firestore, "answerCandidates");

    setLobbyId(callDoc.id);

    pc.onicecandidate = (event) => {
      console.log("onicecandidate");
      event.candidate && addDoc(offerCandidates, event.candidate.toJSON());
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await setDoc(callDoc, { offer });

    onSnapshot(callDoc, (snapshot: any) => {
      console.log("answer", snapshot);
      const data = snapshot.data();
      console.log("data", data);
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    onSnapshot(answerCandidates, (snapshot: any) => {
      snapshot.docChanges().forEach((change: any) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });

    pc.onconnectionstatechange = (event) => {
      if (pc.connectionState === "disconnected") {
        hangUp();
      }
    };
    const hangUp = async () => {
      pc.close();
      // if (lobbyId) {
      //   let roomRef = doc(firestore, "calls", lobbyId);
      //   let answerCandidatesRef = collection(roomRef, "answerCandidates");
      //   let querySnapshot = await getDocs(answerCandidatesRef);
      //   querySnapshot.forEach((doc) => {
      //     deleteDoc(doc.ref);
      //   });
      //   let offerCandidatesRef = collection(roomRef, "offerCandidates");
      //   querySnapshot = await getDocs(offerCandidatesRef);
      //   querySnapshot.forEach((doc) => {
      //     deleteDoc(doc.ref);
      //   });
      //   await deleteDoc(roomRef);
      // }
      window.location.reload();
    };
  }
  useEffect(() => {
    if (lobbyId !== "") return;
    createLobby(setLobbyId);
  }, [lobbyId, pc]);

  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload();
    }, 180000); // Reloads every 3 minutes

    return () => clearInterval(interval); // Clears interval on unmount
  }, []);
  return (
    <div style={{ background: "white", padding: "16px" }}>
      {!live ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            width: "100%",
          }}
        >
          <QRCode value={`https://webrtc-ab238.web.app/stream/${lobbyId}`} />
        </div>
      ) : (
        ""
      )}
      <video ref={remoteRef} autoPlay playsInline className="remote" muted />
    </div>
  );
}
export default Home;
