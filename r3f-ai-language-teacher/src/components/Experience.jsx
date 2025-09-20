"use client";
import { useAITeacher } from "@/hooks/useAITeacher";
import {
  CameraControls,
  Environment,
  Float,
  Gltf,
  Html,
  Loader,
  useGLTF,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva, button, useControls } from "leva";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { degToRad } from "three/src/math/MathUtils";
import { BoardSettings } from "./BoardSettings";
import { MessagesList } from "./MessagesList";
import { Teacher } from "./Teacher";
import {Avatar } from "./Avatar";
// import { TypingBox } from "./TypingBox";
import { CourseDropdown } from "./CourseDropdown";
// import { LastChat } from "./LastChat";

const itemPlacement = {
  default: {
    classroom: {
      position: [0.2, -1.7, 1],
    },
    avatar: {
      position: [-1, -1.7, -6],
    },
    board: {
      position: [0.45, 0.382, -3],
    },
  },
  alternative: {
    classroom: {
      position: [0.3, -1.7, -1.5],
      rotation: [0, degToRad(-90), 0],
      scale: 0.4,
    },
    teacher: { position: [-1, -1.7, -3] },
    board: { position: [1.4, 0.84, -8] },
  },
};

import { useChat } from "@/hooks/useChat";

// Language options: code -> display label
const LANGUAGE_OPTIONS = [
  { code: "en", label: "English" },
  { code: "ja", label: "Japanese" },
  { code: "es", label: "Spanish" },
  { code: "fr", label: "French" },
  { code: "de", label: "German" },
  { code: "hi", label: "Hindi" },
  { code: "zh", label: "Chinese (Mandarin)" },
  { code: "ko", label: "Korean" },
  { code: "it", label: "Italian" },
  { code: "pt", label: "Portuguese" },
];

export const Experience = () => {
  const teacher = useAITeacher((state) => state.teacher);
  const classroom = useAITeacher((state) => state.classroom);
  const { chat, loading } = useChat();

  // Chat UI state
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [question, setQuestion] = useState("");
  const [history, setHistory] = useState([]); // {role: 'user' | 'assistant', text: string}

  const selectedLanguageLabel = useMemo(() => {
    return LANGUAGE_OPTIONS.find((l) => l.code === selectedLanguage)?.label || "English";
  }, [selectedLanguage]);

  const sendQuestion = async () => {
    const q = question.trim();
    if (!q) return;
    // show user bubble immediately
    setHistory((h) => [...h, { role: "user", text: q }]);
    setQuestion("");
    // call backend via useChat with selected language
    const replies = await chat(q, selectedLanguage);
    // append assistant replies for display (support array or single)
    const assistantTexts = (Array.isArray(replies) ? replies : [replies])
      .filter(Boolean)
      .map((m) => (typeof m === "string" ? m : m?.text || m?.content || ""))
      .filter(Boolean);
    if (assistantTexts.length) {
      setHistory((h) => [...h, ...assistantTexts.map((t) => ({ role: "assistant", text: t }))]);
    }
  };

  return (
    <>
      {/* <CourseDropdown /> */}
      {/* Bottom panel: Language select, Chat history, and Input */}
      <div className="z-10 fixed bottom-4 left-4 right-4 md:justify-center flex">
        <div className="w-full max-w-3xl bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-4 shadow-xl">
          {/* Controls row */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-white/80 text-sm">Language:</label>
              <select
                className="bg-slate-900/60 text-white px-3 py-2 rounded-md border border-white/20"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {LANGUAGE_OPTIONS.map((opt) => (
                  <option key={opt.code} value={opt.code}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="text-xs text-white/60">Selected: {selectedLanguageLabel}</span>
            </div>
            <div className="text-xs text-white/60 hidden sm:block">
              Tip: Your questions will be answered in the selected language.
            </div>
          </div>

          {/* Chat history */}
          <div className="mt-4 h-56 overflow-y-auto bg-black/20 rounded-lg p-3 border border-white/10">
            {history.length === 0 ? (
              <div className="text-white/50 text-sm">No messages yet. Ask something below.</div>
            ) : (
              <div className="flex flex-col gap-2">
                {history.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-xl text-sm shadow border
                        ${m.role === "user" ? "bg-emerald-500/80 text-white border-emerald-300/30" : "bg-white/10 text-white border-white/10"}
                      `}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input row */}
          <div className="mt-3 flex gap-2 items-center">
            <input
              className="flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60 focus:outline focus:outline-white/60"
              placeholder="Type your question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendQuestion(); }}
            />
            <button
              className={`px-5 py-2 rounded-full text-white border border-white/20 ${loading ? "bg-white/20 cursor-not-allowed" : "bg-slate-100/20 hover:bg-slate-100/30"}`}
              onClick={sendQuestion}
              disabled={loading}
              title={loading ? "Sending..." : "Ask"}
            >
              {loading ? "Sending..." : "Ask"}
            </button>
          </div>
        </div>
      </div>
      <Leva hidden={true}   />
      <Loader />
      <Canvas
        camera={{
          position: [0, 0,1/10000000000],
        }}
        performance={{ min: 0.5 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
      >
        <CameraManager />

        <Suspense>
          <Float speed={1} floatIntensity={0.2} rotationIntensity={0}>
            <Html
              transform
              {...itemPlacement[classroom].board}
              distanceFactor={1}
            >
              <MessagesList />
              {/* <BoardSettings /> */}
            </Html>
            
            {/* LastChat positioned on the right side */}
            <Html
              position={[0, 0, 0]}
              transform
              distanceFactor={1}
            >
              <div style={{ width: '300px' }}>
                {/* <LastChat /> */}
              </div>
            </Html>
            <Environment preset="sunset" background={false}/>
            <ambientLight intensity={0.8} color="pink" />

            <Gltf
              src={`/models/classroom_${classroom}.glb`}
              {...itemPlacement[classroom].classroom}
            />
            {/* <Teacher
              teacher={teacher}
              key={teacher}
              {...itemPlacement[classroom].teacher}
              scale={1.5}
              rotation-y={degToRad(20)}
            /> */}
          </Float>
          
          {/* Avatar outside Float to prevent animation conflicts */}
          <Avatar position={[-1,-1.2,-1.2]}
          scale={0.85}
          rotation-y={degToRad(38)}
          />
        </Suspense>
      </Canvas>
    </>
  );
};

const CAMERA_POSITIONS = {
  default: [0, 6.123233995736766e-21, 0.0001],
  loading: [
    0.00002621880610890309, 0.00000515037441056466, 0.00009636414192870058,
  ],
  speaking: [0, -1.6481333940859815e-7, 0.00009999846226827279],
};

const CAMERA_ZOOMS = {
  default: 2,
  loading: 1.3,
  speaking: 2.1204819420055387,
};

const CameraManager = () => {
  const controls = useRef();
  const loading = useAITeacher((state) => state.loading);
  const currentMessage = useAITeacher((state) => state.currentMessage);

  useEffect(() => {
    if (loading) {
      controls.current?.setPosition(...CAMERA_POSITIONS.loading, true);
      controls.current?.zoomTo(CAMERA_ZOOMS.loading, true);
    } else if (currentMessage) {
      controls.current?.setPosition(...CAMERA_POSITIONS.speaking, true);
      controls.current?.zoomTo(CAMERA_ZOOMS.speaking, true);
    }
  }, [loading]);

  useControls("Helper", {
    getCameraPosition: button(() => {
      const position = controls.current.getPosition();
      const zoom = controls.current.camera.zoom;
      console.log([...position], zoom);
    }),
  });

  return (
    <CameraControls 
    // enabled={false}
      ref={controls}
      minZoom={2}
      maxZoom={3}
      polarRotateSpeed={-0.3} // REVERSE FOR NATURAL EFFECT
      azimuthRotateSpeed={-0.3} // REVERSE FOR NATURAL EFFECT
      mouseButtons={{
        left: 1, //ACTION.ROTATE
        wheel: 16, //ACTION.ZOOM
      }}
      touches={{
        one: 32, //ACTION.TOUCH_ROTATE
        two: 512, //ACTION.TOUCH_ZOOM
      }}
    />
  );
};

useGLTF.preload("/models/classroom_default.glb");
useGLTF.preload("/models/classroom_alternative.glb");
