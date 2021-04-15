export interface IFragment {
  id: number; // Некий уникальный номер паззла
  edges: IEdges;
}

export interface IEdges {
  top: IEdge;
  left: IEdge;
  right: IEdge; // кромка может быть null, это означает что паззл на этой стороне не имеет ушка
  bottom: IEdge;
}

export interface IEdge {
  edgeTypeId: number;
  type: string;
}

export interface INormalizedFragment extends IFragment {
  edgesIds: number[];
}

export interface IConformity {
  edge: number;
  value: number;
}
