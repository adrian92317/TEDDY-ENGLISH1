import { describe, expect, it } from "vitest";
import { COLORES_BUFANDA } from "./Teddy";
import onboarding from "../content/onboarding.json";

describe("bufanda de Teddy", () => {
  it("tiene un color para cada opción del arranque", () => {
    const paso = onboarding.pasos.find((p) => p.id === "color_bufanda")!;
    const valores = paso.opciones!.map((o) => o.valor);
    expect(valores.sort()).toEqual(Object.keys(COLORES_BUFANDA).sort());
  });
});
