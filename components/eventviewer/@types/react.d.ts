import React from "react";
import "react-dom/client";

declare global {
  namespace ReactDOM {
    export function createRoot(
      container: Element | DocumentFragment,
      options?: RootOptions
    ): Root;
  }
}

export {};
