// import {
//   CameraControls,
//   ContactShadows,
//   Environment,
//   Text,
// } from "@react-three/drei";
// import { Suspense, useEffect, useRef, useState } from "react";
// import { Group } from "three";
// import { ComponentPropsWithoutRef } from "react";
// import { useChat } from "../hooks/useChat";
// // import { Avatar } from "./Avatar";

// /// Thinking effect
// type DotsProps = ComponentPropsWithoutRef<'group'>;


// const Dots: React.FC<DotsProps> = (props) => {
//   const { loading } = useChat();
//   const [loadingText, setLoadingText] = useState<string>("");

//   useEffect(() => {
//     if (loading) {
//       const interval = setInterval(() => {
//         setLoadingText((prev) => {
//           if (prev.length > 2) {
//             return ".";
//           }
//           return prev + ".";
//         });
//       }, 800);
//       return () => clearInterval(interval);
//     } else {
//       setLoadingText("");
//     }
//   }, [loading]);

//   if (!loading) return null;

//   return (
//     <group {...props}>
//       <Text fontSize={0.1} anchorX="left" anchorY="bottom">
//         {loadingText}
//         <meshBasicMaterial attach="material" color="black" />
//       </Text>
//     </group>
//   );
// };

// export const Experience: React.FC = () => {
//   const cameraControls = useRef<CameraControls>(null);
//   const { cameraZoomed } = useChat();

//   useEffect(() => {
//     cameraControls.current?.setLookAt(0, 2, 5, 0, 1.5, 0);
//   }, []);

//   useEffect(() => {
//     if (cameraZoomed) {
//       cameraControls.current?.setLookAt(0, 1.5, 1.5, 0, 1.5, 0, true);
//     } else {
//       cameraControls.current?.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
//     }
//   }, [cameraZoomed]);

//   return (
//     <>
//       <CameraControls ref={cameraControls} />
//       <Environment preset="sunset" />
//       {/* Wrapping Dots into Suspense to prevent Blink when Troika/Font is loaded */}
//       <Suspense>
//         <Dots position-y={1.75} position-x={-0.02} />
//       </Suspense>
//       {/* <Avatar /> */}
//       <ContactShadows opacity={0.7} />
//     </>
//   );
// };
