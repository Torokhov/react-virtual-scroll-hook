import React, { useEffect, useRef, useState } from 'react';
import throttle from 'lodash/throttle';

const SETTINGS = {
  minIndex: 1,
  maxIndex: 16,
  startIndex: 6,
  itemHeight: 20,
  amount: 5,
  tolerance: 2,
};

const rowTemplate = (item: { index: number; text: string }) => (
  <div style={{ height: `${SETTINGS.itemHeight}px` }} key={item.index}>
    {item.text}
  </div>
);

const getData = (offset: number, limit: number) => {
  const data = [];
  const start = Math.max(SETTINGS.minIndex, offset);
  const end = Math.min(offset + limit - 1, SETTINGS.maxIndex);
  if (start <= end) {
    for (let i = start; i <= end; i++) {
      data.push({ index: i, text: `item ${i}` });
    }
  }
  return data;
};

export const VirtualScroll = () => {
  const [state, setState] = useState(() => {
    const viewportHeight = SETTINGS.amount * SETTINGS.itemHeight;

    const totalHeight = (SETTINGS.maxIndex - SETTINGS.minIndex + 1) * SETTINGS.itemHeight;

    const toleranceHeight = SETTINGS.tolerance * SETTINGS.itemHeight;

    const bufferHeight = viewportHeight + 2 * toleranceHeight;

    const bufferedItems = SETTINGS.amount + 2 * SETTINGS.tolerance;

    const itemsAbove = SETTINGS.startIndex - SETTINGS.tolerance - SETTINGS.minIndex;

    const topPaddingHeight = itemsAbove * SETTINGS.itemHeight;

    const bottomPaddingHeight = totalHeight - topPaddingHeight;

    const initialPosition = topPaddingHeight + toleranceHeight;

    return {
      viewportHeight,
      totalHeight,
      toleranceHeight,
      bufferHeight,
      bufferedItems,
      topPaddingHeight,
      bottomPaddingHeight,
      initialPosition,
      data: [],
    };
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = throttle((e: Event) => {
      console.log('scroll');
      //@ts-ignore
      const scrollTop = e.target.scrollTop;
      const { totalHeight, toleranceHeight, bufferedItems } = state;
      const index =
        SETTINGS.minIndex + Math.floor((scrollTop - toleranceHeight) / SETTINGS.itemHeight);
      const data = getData(index, bufferedItems);
      const topPaddingHeight = Math.max((index - SETTINGS.minIndex) * SETTINGS.itemHeight, 0);
      const bottomPaddingHeight = Math.max(
        totalHeight - topPaddingHeight - data.length * SETTINGS.itemHeight,
        0
      );

      setState({
        ...state,
        topPaddingHeight,
        bottomPaddingHeight,
        // @ts-ignore
        data,
      });
    }, 100);
    if (ref.current) {
      ref.current.scrollTop = state.initialPosition;
      ref.current.addEventListener('scroll', onScroll);
    }
    if (!state.initialPosition) {
      //@ts-ignore
      onScroll({ target: { scrollTop: 0 } });
    }

    return () => {
      ref.current?.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div ref={ref} style={{ overflowY: 'scroll', height: state.viewportHeight }}>
      <div style={{ height: state.topPaddingHeight }}></div>
      {state.data.map(rowTemplate)}
      <div style={{ height: state.bottomPaddingHeight }}></div>
    </div>
  );
};
