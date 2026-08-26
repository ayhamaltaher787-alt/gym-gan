import { Suspense, useEffect, useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { stationById } from "../data/stationsConfig";
import { useRallyeStore } from "../store/rallyeStore";
import { ExitBar } from "../components/ExitBar";

export function StationHostPage() {
  const { stationId } = useParams();
  const station = stationById(stationId);
  const navigate = useNavigate();
  const markInProgress = useRallyeStore((s) => s.markInProgress);
  const completeStation = useRallyeStore((s) => s.completeStation);
  const previousScore = useRallyeStore((s) =>
    station ? s.progress[station.id].bestScore : 0
  );

  useEffect(() => {
    if (station) markInProgress(station.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station?.id]);

  const StationComponent = useMemo(() => station?.component, [station]);

  if (!station || !StationComponent) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🤷</div>
        <h1 className="text-2xl font-display font-semibold text-white">
          Station nicht gefunden
        </h1>
        <p className="mt-2 text-ink-300">
          Diese Station gibt es nicht (mehr). Vielleicht wurde sie umbenannt.
        </p>
        <Link to="/rallye" className="btn-primary mt-6 px-5 py-3 inline-flex">
          Zurück zur Rallye
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col">
      <ExitBar title={station.title} subtitle="Station" />
      <div className="flex-1">
        <Suspense
          fallback={
            <div className="max-w-3xl mx-auto px-4 py-20 text-center text-ink-300">
              Station wird geladen…
            </div>
          }
        >
          <motion.div
            key={station.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <StationComponent
              previousScore={previousScore}
              onComplete={({ score }) => {
                completeStation(station.id, Math.max(0, Math.round(score)));
              }}
              onExit={() => navigate("/rallye")}
            />
          </motion.div>
        </Suspense>
      </div>
    </div>
  );
}
