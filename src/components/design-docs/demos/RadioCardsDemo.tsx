"use client";

import { useState } from "react";
import { RadioCards } from "@/components/RadioCards";

const OPTIONS = [
  {
    value: "per-unit",
    title: "Per piece",
    description: "Every piece carries the same share of your business costs.",
  },
  {
    value: "bench-time",
    title: "By bench time",
    description: "Pieces that take longer carry a bigger share.",
  },
];

export function RadioCardsDemo() {
  const [value, setValue] = useState("per-unit");
  return <RadioCards name="allocation-demo" options={OPTIONS} value={value} onChange={setValue} />;
}
