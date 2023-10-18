import { useRef } from "react";

export const RemoteVideo = ({ lobbyId }: { lobbyId: string }) => {
  const remoteRef = useRef<HTMLVideoElement | null>(null);

  const remoteStream = new MediaStream();
  // @ts-ignore
  // remoteRef.current.srcObject = remoteStream;
  return (
    <>
      remote vid here: {lobbyId}
      <video ref={remoteRef} autoPlay playsInline className="remote" />
    </>
  );
};
