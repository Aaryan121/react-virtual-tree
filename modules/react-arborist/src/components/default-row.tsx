import React from "react";
import { RowRendererProps } from "../types/renderers";
import { IdObj } from "../types/utils";

export function DefaultRow<T>({
  node,
  attrs,
  innerRef,
  children,
  style,
  isSticky,
}: RowRendererProps<T>) {
  return (
    <div
      {...attrs}
      ref={innerRef}
      onFocus={(e) => e.stopPropagation()}
      onClick={node.handleClick}
      style={{
        ...style,
        ...(isSticky
          ? {
              backgroundColor: "var(--sticky-bg-color, #f5f5f5)",
              boxShadow: "var(--sticky-shadow, 0 1px 2px rgba(0,0,0,0.1))",
              borderBottom: "var(--sticky-border, 1px solid #eaeaea)",
              fontWeight: "var(--sticky-font-weight, 500)",
            }
          : {}),
      }}
    >
      {children}
    </div>
  );
}
