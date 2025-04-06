import { CSSProperties, HTMLAttributes, ReactElement } from "react";
import { IdObj } from "./utils";
import { NodeApi } from "../interfaces/node-api";
import { TreeApi } from "../interfaces/tree-api";
import { XYCoord } from "react-dnd";

export type NodeRendererProps<T> = {
  style: CSSProperties;
  node: NodeApi<T>;
  tree: TreeApi<T>;
  dragHandle?: (el: HTMLDivElement | null) => void;
  preview?: boolean;
};

export interface RowRendererProps<T> {
  node: NodeApi<T>;
  style: React.CSSProperties;
  index?: number;
  innerRef?: (n: any) => void;
  attrs?: React.HTMLAttributes<any>;
  children?: React.ReactNode;
  isSticky?: boolean;
}

export type DragPreviewProps = {
  offset: XYCoord | null;
  mouse: XYCoord | null;
  id: string | null;
  dragIds: string[];
  isDragging: boolean;
};

export type CursorProps = {
  top: number;
  left: number;
  indent: number;
};
