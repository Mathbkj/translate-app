import { createLink, type LinkComponent } from "@tanstack/react-router";
import { Button } from "./button";

const CustomLinkComponent = createLink(Button);
export const CustomLink: LinkComponent<typeof CustomLinkComponent> = (
  props,
) => <CustomLinkComponent preload="intent" {...props} />;
