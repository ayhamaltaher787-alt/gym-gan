import { createBrowserRouter, Navigate } from "react-router-dom";
import { RootLayout } from "./pages/RootLayout";
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { RallyeOverviewPage } from "./pages/RallyeOverviewPage";
import { StationHostPage } from "./pages/StationHostPage";
import { RallyeSummaryPage } from "./pages/RallyeSummaryPage";
import { RatingPage } from "./pages/RatingPage";
import { ProgramsListPage } from "./pages/ProgramsListPage";
import { ProgramAddPage } from "./pages/ProgramAddPage";
import { ProgramDetailPage } from "./pages/ProgramDetailPage";
import { PresenterPage } from "./pages/PresenterPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "rallye", element: <RallyeOverviewPage /> },
      { path: "rallye/station/:stationId", element: <StationHostPage /> },
      { path: "rallye/abschluss", element: <RallyeSummaryPage /> },
      { path: "rallye/bewertung", element: <RatingPage /> },
      { path: "programme", element: <ProgramsListPage /> },
      { path: "programme/neu", element: <ProgramAddPage /> },
      { path: "programme/:programId", element: <ProgramDetailPage /> },
      { path: "praesentation", element: <PresenterPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  { path: "/404", element: <Navigate to="/" replace /> },
]);
