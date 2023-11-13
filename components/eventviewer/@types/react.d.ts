import React from "react";
import "react-dom/client";

declare global {
  type React = typeof React;
  namespace ReactDOM {
    export function createRoot(
      container: Element | DocumentFragment,
      options?: RootOptions
    ): Root;
  }
}

export {};
