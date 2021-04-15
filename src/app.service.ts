import { Injectable } from '@nestjs/common';
import {
  IConformity,
  IFragment,
  INormalizedFragment,
} from './interfaces/fragment.interface';
import { EdgeEnum } from './enums/edge.enum';

@Injectable()
export class AppService {
  private edge = EdgeEnum;
  private data: IFragment[] = [
    {
      id: 1,
      edges: {
        top: null,
        right: null,
        bottom: { edgeTypeId: 7, type: 'outside' },
        left: { edgeTypeId: 5, type: 'inside' },
      },
    },
    {
      id: 9,
      edges: {
        top: { edgeTypeId: 8, type: 'inside' },
        right: { edgeTypeId: 15, type: 'inside' },
        bottom: null,
        left: { edgeTypeId: 5, type: 'outside' },
      },
    },
    {
      id: 5,
      edges: {
        top: null,
        right: { edgeTypeId: 2, type: 'inside' },
        bottom: { edgeTypeId: 1, type: 'inside' },
        left: null,
      },
    },
    {
      id: 4,
      edges: {
        top: { edgeTypeId: 34, type: 'inside' },
        right: { edgeTypeId: 11, type: 'outside' },
        bottom: { edgeTypeId: 7, type: 'inside' },
        left: null,
      },
    },
    {
      id: 3,
      edges: {
        top: { edgeTypeId: 2, type: 'outside' },
        right: null,
        bottom: { edgeTypeId: 4, type: 'outside' },
        left: { edgeTypeId: 6, type: 'inside' },
      },
    },
    {
      id: 2,
      edges: {
        top: { edgeTypeId: 3, type: 'outside' },
        right: { edgeTypeId: 34, type: 'outside' },
        bottom: null,
        left: null,
      },
    },
    {
      id: 8,
      edges: {
        top: null,
        right: { edgeTypeId: 15, type: 'outside' },
        bottom: { edgeTypeId: 4, type: 'inside' },
        left: null,
      },
    },
    {
      id: 7,
      edges: {
        top: { edgeTypeId: 3, type: 'inside' },
        right: null,
        bottom: { edgeTypeId: 1, type: 'outside' },
        left: { edgeTypeId: 10, type: 'inside' },
      },
    },
    {
      id: 6,
      edges: {
        top: { edgeTypeId: 11, type: 'inside' },
        right: { edgeTypeId: 10, type: 'outside' },
        bottom: { edgeTypeId: 6, type: 'outside' },
        left: { edgeTypeId: 8, type: 'outside' },
      },
    },
  ];

  solvePuzzle(data: IFragment[] = this.data): number[] {
    const size = Math.sqrt(data.length);
    const puzzle = [];
    const fragments: INormalizedFragment[] = this.normalizationFragments(
      this.data,
    );
    let [first] = fragments;
    const [, ...otherFragments] = fragments;

    first = this.rotate(first, [
      { edge: this.edge.left, value: null },
      { edge: this.edge.top, value: null },
    ]);
    puzzle.push(first);

    let item = first;
    let prevRowIndex = -1;
    do {
      const arrayMultiplicity = puzzle.length % size;
      item = arrayMultiplicity ? item : puzzle[prevRowIndex * size];
      const lockId =
        item.edgesIds[arrayMultiplicity ? this.edge.right : this.edge.bottom];
      const newItemIndex = otherFragments.findIndex((x) =>
        x.edgesIds.includes(lockId),
      );
      let [nextItem] = otherFragments.splice(newItemIndex, 1);
      nextItem = this.rotate(nextItem, [
        {
          edge: arrayMultiplicity ? this.edge.left : this.edge.top,
          value: lockId,
        },
      ]);
      puzzle.push(nextItem);
      puzzle.length % size ? (item = nextItem) : prevRowIndex++;
    } while (otherFragments.length);
    return puzzle.map((item) => item.id);
  }

  public normalizationFragments(list: IFragment[]): INormalizedFragment[] {
    return list.map((item) => {
      return <INormalizedFragment>{
        ...item,
        edgesIds: [
          item.edges.top,
          item.edges.right,
          item.edges.bottom,
          item.edges.left,
        ].map((x) => x?.edgeTypeId || null),
      };
    });
  }

  public rotate(fragment: INormalizedFragment, conformities: IConformity[]) {
    let rotates = 0;
    while (
      !conformities.every(
        (conformity) => fragment.edgesIds[conformity.edge] === conformity.value,
      ) &&
      rotates <= fragment.edgesIds.length
    ) {
      const [top, ...other] = fragment.edgesIds;
      fragment.edgesIds = [...other, top];
      rotates++;
    }
    return fragment;
  }
}
