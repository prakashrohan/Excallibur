import { Loader, PerformanceMonitor, SoftShadows } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import { ToastContainer } from 'react-toastify';
import { Suspense, useState } from "react";
import { Experience } from "./components/Experience";
import { Leaderboard } from "./components/Leaderboard";
import { PlayerProfileForm } from "./components/PlayerForm";
import { XpChangeScreen } from "./components/XpChangeScreen";

function App() {
  const [downgradedPerformance, setDowngradedPerformance] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isXpChange, setIsXpChange] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [kill, setKill] = useState(0);
  const [death, setDeath] = useState(0);
  const [xp, setXp] = useState(0);

  const handleProfileSubmit = (data) => {
    setPlayerData(data);
    setIsXpChange(false);
    setIsGameStarted(true);
  };

  const xpChange = (kill, death, xp, id) => {
    setKill(kill);
    setDeath(death);
    setXp(xp);
    // API call to update DB can be placed here
    setIsXpChange(true);
    setIsGameStarted(false);
  };

  const onBack = () => {
    setIsXpChange(false);
    setIsGameStarted(false);
    setKill(0);
    setDeath(0);
    setXp(0);
    window.location.reload();
  };

  if (isXpChange) {
    return (
      <>
        <ToastContainer position="top-center" autoClose={3000} />
        <XpChangeScreen
          kill={kill}
          death={death}
          xp={xp}
          token={playerData?.token}
          onBack={onBack}
        />
      </>
    );
  }

  return (
    <>
      <ToastContainer position="top-center" autoClose={3000} />
      <Loader />
      {isGameStarted && <Leaderboard />}

      {!isGameStarted ? (
        <PlayerProfileForm onSubmit={handleProfileSubmit} />
      ) : (
        <Canvas
          shadows
          camera={{ position: [0, 30, 0], fov: 30, near: 2 }}
          dpr={[1, 1.5]}
        >
          <color attach="background" args={["#242424"]} />
          <SoftShadows size={42} />

          <PerformanceMonitor onDecline={() => setDowngradedPerformance(true)} />

          <Suspense>
            <Physics>
              <Experience
                downgradedPerformance={downgradedPerformance}
                playerData={playerData}
                xpChange={xpChange}
              />
            </Physics>
          </Suspense>

          {!downgradedPerformance && (
            <EffectComposer disableNormalPass>
              <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
            </EffectComposer>
          )}
        </Canvas>
      )}
    </>
  );
}

export default App;
