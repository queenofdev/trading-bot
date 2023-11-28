import { render } from "react-dom";
import "./styles.scss";
import "./app/styles/fonts.scss";

import Root from "./app/root";

const rootElement = document.getElementById("root");

render(<Root />, rootElement);
