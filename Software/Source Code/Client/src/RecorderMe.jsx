import React, { useState } from "react";
import { Recorder } from "react-voice-recorder";
import "react-voice-recorder/dist/index.css";
import "./recorder.css";
const RecordMe = (props) => {
  const [audioDetails, setAudioDetails] = useState({
    url: null,
    blob: null,
    chunks: null,
    duration: {
      h: 0,
      m: 0,
      s: 0,
    },
  });
  // audioDetails:

  const handleAudioStop = (data) => {
    console.log("from stop button--> ", data);
    setAudioDetails({ audioDetails: data });
    props.getAudioFromRecorder(data);
  };

  const handleAudioUpload = (data) => {
    console.log("rec", data);
    // props.getAudioFromRecorder(file);
  };

  const handleCountDown = (data) => {
    // console.log(data);
  };

  const handleReset = () => {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0,
      },
    };
    setAudioDetails({ audioDetails: reset });
  };

  return (
    <>
      {" "}
      <Recorder
        record={true}
        title={"New recording"}
        audioURL={audioDetails.url}
        showUIAudio
        handleAudioStop={(data) => {
          handleAudioStop(data);
        }}
        handleAudioUpload={(data) => handleAudioUpload(data)}
        handleCountDown={(data) => handleCountDown(data)}
        handleReset={() => handleReset()}
        mimeTypeToUseWhenRecording={`audio/webm`} // For specific mimetype.
      />
    </>
  );
  //   return <div>Recorder</div>;
};

export default RecordMe;
