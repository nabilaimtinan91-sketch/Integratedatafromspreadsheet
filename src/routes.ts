import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { InputData } from "./components/InputData";
import { RekapData } from "./components/RekapData";
import { EditData } from "./components/EditData";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: InputData },
      { path: "rekap", Component: RekapData },
      { path: "edit/:id", Component: EditData },
    ],
  },
]);