import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { MolangExpression } from "lib/utils/molang";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

const expression1 = new MolangExpression(
  "math.clamp(math.sin(q.anim_time*90*8+180)*0.06,-0.03,0.03)+math.clamp(math.sin(q.anim_time*90*8+180)*0.03,-0.5,0.5)"
);
const expression2 = new MolangExpression("q.anim_time * 2");

setInterval(() => {
  console.log("Expr1:", expression1.eval(Date.now()));
  console.log("Expr2:", expression2.eval(Date.now()));
}, 1000);
