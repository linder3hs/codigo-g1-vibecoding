/**
 * AppRouter component - Main routing configuration
 * Defines all application routes using React Router v7
 */

import { createBrowserRouter, RouterProvider } from "react-router";
import { HomePage, CreateTodoPage } from "../pages";
import { ErrorPage } from "./ErrorPage";

/**
 * Router configuration with all application routes
 */
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/crear-todo",
    element: <CreateTodoPage />,
    errorElement: <ErrorPage />,
  },
]);

/**
 * AppRouter - Main router component
 * Provides routing functionality to the entire application
 */
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
