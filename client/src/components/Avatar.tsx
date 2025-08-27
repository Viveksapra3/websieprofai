import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Group } from "three";
import { GLTF } from "three-stdlib";
import { useChat } from "../hooks/useChat";

type AvatarProps = JSX.IntrinsicElements["group"];

interface AvatarGLTF extends GLTF {
  nodes: {
    Hips: THREE.Object3D;
    Wolf3D_Body: THREE.SkinnedMesh;
    Wolf3D_Outfit_Bottom: THREE.SkinnedMesh;
    Wolf3D_Outfit_Footwear: THREE.SkinnedMesh;
    Wolf3D_Outfit_Top: THREE.SkinnedMesh;
    Wolf3D_Hair: THREE.SkinnedMesh;
    EyeLeft: THREE.SkinnedMesh & {
      morphTargetDictionary: { [key: string]: number };
      morphTargetInfluences: number[];
    };
    EyeRight: THREE.SkinnedMesh & {
      morphTargetDictionary: { [key: string]: number };
      morphTargetInfluences: number[];
    };
    Wolf3D_Head: THREE.SkinnedMesh & {
      morphTargetDictionary: { [key: string]: number };
      morphTargetInfluences: number[];
    };
    Wolf3D_Teeth: THREE.SkinnedMesh & {
      morphTargetDictionary: { [key: string]: number };
      morphTargetInfluences: number[];
    };
    Wolf3D_Glasses: THREE.SkinnedMesh;
  };
  materials: {
    Wolf3D_Body: THREE.Material;
    Wolf3D_Outfit_Bottom: THREE.Material;
    Wolf3D_Outfit_Footwear: THREE.Material;
    Wolf3D_Outfit_Top: THREE.Material;
    Wolf3D_Hair: THREE.Material;
    Wolf3D_Eye: THREE.Material;
    Wolf3D_Skin: THREE.Material;
    Wolf3D_Teeth: THREE.Material;
    Wolf3D_Glasses: THREE.Material;
  };
}

const facialExpressions: Record<string, Record<string, number>> = {
  default: {},
  smile: { browInnerUp: 0.17, eyeSquintLeft: 0.4, eyeSquintRight: 0.44, noseSneerLeft: 0.17, noseSneerRight: 0.14, mouthPressLeft: 0.61, mouthPressRight: 0.41 },
  funnyFace: { jawLeft: 0.63, mouthPucker: 0.53, noseSneerLeft: 1, noseSneerRight: 0.39, mouthLeft: 1, eyeLookUpLeft: 1, eyeLookUpRight: 1, cheekPuff: 1, mouthDimpleLeft: 0.41, mouthRollLower: 0.32, mouthSmileLeft: 0.35, mouthSmileRight: 0.35 },
  sad: { mouthFrownLeft: 1, mouthFrownRight: 1, mouthShrugLower: 0.78, browInnerUp: 0.45, eyeSquintLeft: 0.72, eyeSquintRight: 0.75, eyeLookDownLeft: 0.5, eyeLookDownRight: 0.5, jawForward: 1 },
  surprised: { eyeWideLeft: 0.5, eyeWideRight: 0.5, jawOpen: 0.35, mouthFunnel: 1, browInnerUp: 1 },
  angry: { browDownLeft: 1, browDownRight: 1, eyeSquintLeft: 1, eyeSquintRight: 1, jawForward: 1, jawLeft: 1, mouthShrugLower: 1, noseSneerLeft: 1, noseSneerRight: 0.42, eyeLookDownLeft: 0.16, eyeLookDownRight: 0.16, cheekSquintLeft: 1, cheekSquintRight: 1, mouthClose: 0.23, mouthFunnel: 0.63, mouthDimpleRight: 1 },
  crazy: { browInnerUp: 0.9, jawForward: 1, noseSneerLeft: 0.57, noseSneerRight: 0.51, eyeLookDownLeft: 0.39, eyeLookUpRight: 0.4, eyeLookInLeft: 0.96, eyeLookInRight: 0.96, jawOpen: 0.96, mouthDimpleLeft: 0.96, mouthDimpleRight: 0.96, mouthStretchLeft: 0.27, mouthStretchRight: 0.28, mouthSmileLeft: 0.55, mouthSmileRight: 0.38, tongueOut: 0.96 }
};

const corresponding: Record<string, string> = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};

let setupMode = false;

export function Avatar(props: AvatarProps) {
  const { nodes, materials, scene } = useGLTF("./models/av.glb") as AvatarGLTF;
  const { animations } = useGLTF("./models/animations.glb") as GLTF;

  const { message, onMessagePlayed, chat } = useChat();
  const [lipsync, setLipsync] = useState<any>();
  const [facialExpression, setFacialExpression] = useState<string>("");
  const [audio, setAudio] = useState<HTMLAudioElement>();
  const [blink, setBlink] = useState(false);
  const [winkLeft, setWinkLeft] = useState(false);
  const [winkRight, setWinkRight] = useState(false);

  const group = useRef<Group>(null!);
  const { actions, mixer } = useAnimations(animations, group);
  const [animation, setAnimation] = useState<string>(
    animations.find((a) => a.name === "Idle")?.name || animations[0].name
  );

  useEffect(() => {
    if (!message) {
      setAnimation("Idle");
      return;
    }
    setAnimation(message.animation);
    setFacialExpression(message.facialExpression);
    setLipsync(message.lipsync);
    const audioEl = new Audio("data:audio/mp3;base64," + message.audio);
    audioEl.play();
    setAudio(audioEl);
    audioEl.onended = onMessagePlayed;
  }, [message, onMessagePlayed]);

  useEffect(() => {
    if (actions && animation) {
      actions[animation]?.reset().fadeIn(mixer.stats.actions.inUse === 0 ? 0 : 0.5).play();
      return () => actions[animation]?.fadeOut(0.5);
    }
  }, [animation, actions, mixer.stats.actions.inUse]);

  const lerpMorphTarget = (target: string, value: number, speed = 0.1) => {
    scene.traverse((child) => {
      const skinned = child as THREE.SkinnedMesh;
      if (skinned.isSkinnedMesh && skinned.morphTargetDictionary) {
        const index = skinned.morphTargetDictionary[target];
        if (index === undefined || skinned.morphTargetInfluences?.[index] === undefined) return;
        skinned.morphTargetInfluences[index] = THREE.MathUtils.lerp(
          skinned.morphTargetInfluences[index],
          value,
          speed
        );
        if (!setupMode) {
          try {
            set({ [target]: value });
          } catch {}
        }
      }
    });
  };

  useFrame(() => {
    if (!setupMode) {
      Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") return;
        const mapping = facialExpressions[facialExpression];
        if (mapping && mapping[key]) {
          lerpMorphTarget(key, mapping[key], 0.1);
        } else {
          lerpMorphTarget(key, 0, 0.1);
        }
      });
    }
    lerpMorphTarget("eyeBlinkLeft", blink || winkLeft ? 1 : 0, 0.5);
    lerpMorphTarget("eyeBlinkRight", blink || winkRight ? 1 : 0, 0.5);

    if (setupMode) return;

    const applied: string[] = [];
    if (message && lipsync && audio) {
      const currentAudioTime = audio.currentTime;
      for (const mouthCue of lipsync.mouthCues) {
        if (currentAudioTime >= mouthCue.start && currentAudioTime <= mouthCue.end) {
          applied.push(corresponding[mouthCue.value]);
          lerpMorphTarget(corresponding[mouthCue.value], 1, 0.2);
          break;
        }
      }
    }
    Object.values(corresponding).forEach((value) => {
      if (!applied.includes(value)) lerpMorphTarget(value, 0, 0.1);
    });
  });

  useControls("FacialExpressions", {
    chat: button(() => chat()),
    winkLeft: button(() => {
      setWinkLeft(true);
      setTimeout(() => setWinkLeft(false), 300);
    }),
    winkRight: button(() => {
      setWinkRight(true);
      setTimeout(() => setWinkRight(false), 300);
    }),
    animation: {
      value: animation,
      options: animations.map((a) => a.name),
      onChange: (v: string) => setAnimation(v),
    },
    facialExpression: {
      options: Object.keys(facialExpressions),
      onChange: (v: string) => setFacialExpression(v),
    },
    enableSetupMode: button(() => (setupMode = true)),
    disableSetupMode: button(() => (setupMode = false)),
    logMorphTargetValues: button(() => {
      const values: Record<string, number> = {};
      Object.keys(nodes.EyeLeft.morphTargetDictionary).forEach((key) => {
        if (key === "eyeBlinkLeft" || key === "eyeBlinkRight") return;
        const val = nodes.EyeLeft.morphTargetInfluences[nodes.EyeLeft.morphTargetDictionary[key]];
        if (val > 0.01) values[key] = val;
      });
      console.log(JSON.stringify(values, null, 2));
    }),
  });

  const [, set] = useControls("MorphTarget", () =>
    Object.assign(
      {},
      ...Object.keys(nodes.EyeLeft.morphTargetDictionary).map((key) => ({
        [key]: {
          label: key,
          value: 0,
          min: nodes.EyeLeft.morphTargetInfluences[nodes.EyeLeft.morphTargetDictionary[key]],
          max: 1,
          onChange: (val: number) => {
            if (setupMode) lerpMorphTarget(key, val, 1);
          },
        },
      }))
    )
  );

  useEffect(() => {
    let blinkTimeout: NodeJS.Timeout;
    const nextBlink = () => {
      blinkTimeout = setTimeout(() => {
        setBlink(true);
        setTimeout(() => {
          setBlink(false);
          nextBlink();
        }, 200);
      }, THREE.MathUtils.randInt(1000, 5000));
    };
    nextBlink();
    return () => clearTimeout(blinkTimeout);
  }, []);

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh geometry={nodes.Wolf3D_Body.geometry} material={materials.Wolf3D_Body} skeleton={nodes.Wolf3D_Body.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
      <skinnedMesh geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
      <skinnedMesh geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
      <skinnedMesh geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
      <skinnedMesh geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wol    f3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
      <skinnedMesh geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
      <skinnedMesh geometry={nodes.Wolf3D_Glasses.geometry} material={materials.Wolf3D_Glasses} skeleton={nodes.Wolf3D_Glasses.skeleton} />
    </group>
  );
}

useGLTF.preload("/models/av.glb");
useGLTF.preload("/models/animations.glb");
