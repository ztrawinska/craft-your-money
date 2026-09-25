/** slug → the component's doc page. Slugs are declared in nav.ts. */
import type { ComponentType } from "react";
import { ActionSheetDoc } from "./ActionSheet";
import { AssistantSlotDoc } from "./AssistantSlot";
import { BottomNavDoc } from "./BottomNav";
import { ButtonDoc } from "./Button";
import { ChipDoc } from "./Chip";
import { CollapseDoc } from "./Collapse";
import { ComboboxDoc } from "./Combobox";
import { DropdownDoc } from "./Dropdown";
import { FramedSurfaceDoc } from "./FramedSurface";
import { GlintDoc } from "./Glint";
import { InlineFormDoc } from "./InlineForm";
import { InputDoc } from "./Input";
import { IrisSheetDoc } from "./IrisSheet";
import { ListRowDoc } from "./ListRow";
import { PriceDoc } from "./Price";
import { RadioCardsDoc } from "./RadioCards";
import { ScreensDoc } from "./Screens";
import { SectionLabelDoc } from "./SectionLabel";
import { SwitchDoc } from "./Switch";
import { TintedBandDoc } from "./TintedBand";

export const COMPONENT_DOCS: Record<string, ComponentType> = {
  glint: GlintDoc,
  chip: ChipDoc,
  button: ButtonDoc,
  price: PriceDoc,
  "section-label": SectionLabelDoc,
  input: InputDoc,
  combobox: ComboboxDoc,
  switch: SwitchDoc,
  dropdown: DropdownDoc,
  "radio-cards": RadioCardsDoc,
  "tinted-band": TintedBandDoc,
  "framed-surface": FramedSurfaceDoc,
  "list-row": ListRowDoc,
  collapse: CollapseDoc,
  "inline-form": InlineFormDoc,
  "assistant-slot": AssistantSlotDoc,
  "action-sheet": ActionSheetDoc,
  "iris-sheet": IrisSheetDoc,
  "bottom-nav": BottomNavDoc,
  screens: ScreensDoc,
};
