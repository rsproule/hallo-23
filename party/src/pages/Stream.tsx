import {
  doc,
  collection,
  getFirestore,
  getDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  getDocs,
  addDoc,
} from "firebase/firestore";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

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

const Stream = () => {
  const pc = new RTCPeerConnection(servers);
  const localRef = useRef<HTMLVideoElement | null>(null);
  const { id } = useParams();
  const [webcamActive, setWebcamActive] = useState(false);
  async function setupSources() {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    localRef.current!.srcObject = localStream;
    setWebcamActive(true);
    // join(id!);
    const callDoc = doc(collection(firestore, "calls"), id);
    const answerCandidates = collection(callDoc, "answerCandidates");
    const offerCandidates = collection(callDoc, "offerCandidates");
    pc.onicecandidate = (event) => {
      event.candidate && addDoc(answerCandidates, event.candidate.toJSON());
    };

    const callData = (await getDoc(callDoc)).data();

    const offerDescription = callData!.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await updateDoc(callDoc, { answer });

    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          let data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
    pc.onconnectionstatechange = (event) => {
      if (pc.connectionState === "disconnected") {
      }
    };
  }

  const hangUp = async () => {
    pc.close();

    // // if (id) {
    // //   let roomRef = doc(firestore, "calls", id);
    // //   let answerCandidatesRef = collection(roomRef, "answerCandidates");
    // //   let querySnapshot = await getDocs(answerCandidatesRef);
    // //   querySnapshot.forEach((doc) => {
    // //     deleteDoc(doc.ref);
    // //   });

    // let offerCandidatesRef = collection(roomRef, "offerCandidates");
    // querySnapshot = await getDocs(offerCandidatesRef);
    // querySnapshot.forEach((doc) => {
    //   deleteDoc(doc.ref);
    // });

    // await deleteDoc(roomRef);
    // }

    window.location.reload();
  };

  return (
    <>
      {id} i
      <video ref={localRef} autoPlay playsInline className="local" muted />
      <button
        onClick={hangUp}
        disabled={!webcamActive}
        className="hangup button"
      >
        Hang up
      </button>
      {!webcamActive && (
        <div className="modalContainer">
          <div className="modal">
            <h3>Turn on your camera and start streaming</h3>
            <div className="container">
              <button onClick={setupSources}>Stream</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Stream;
