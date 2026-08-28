import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./Layout.jsx";
import Home from "./pages/Home.jsx";
import Protected from "./components/Protected.jsx";
import { ClerkProvider } from "@clerk/react";
import Signin from "./auth/Signin.jsx";
import Signup from "./auth/Sihnup.jsx";
import { ThemeProvider } from "./context/theme.context.jsx";
import Mycv from "./pages/Mycv.jsx";
import CvQuestion from "./pages/CvQuestion.jsx";
import Tool from "./pages/Tool.jsx";
import ClerkTokenBridge from "./components/ClerkBridge.jsx";
import SamplePage from "./pages/SamplePage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path:"sample", element: <SamplePage /> },
      {
        path: "tool",
        element: (
          <Protected>
            <Tool />
          </Protected>
        ),
      },
      // { path: "about", element: <About /> },
      // { path: "contact", element: <Contact /> },

      {
        path: "mycv",
        element: (
          <Protected>
            <Mycv />
          </Protected>
        ),
      },
      {
        path: "cv/:cvId",
        element: (
          <Protected>
            <CvQuestion />
          </Protected>
        ),
      },
      { path: "login", element: <Signin /> },
      { path: "signup", element: <Signup /> },
    ],
  },
]);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")).render(
  <>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ClerkTokenBridge />
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </ClerkProvider>
    {/* <App /> */}
  </>,
);
