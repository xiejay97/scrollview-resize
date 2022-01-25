export interface SVResizeObserverEntrie {
  /**
   * A reference to the `Element` being observed.
   */
  target: Element;

  /**
   * Current `scrollWidth` of the element.
   */
  scrollWidth: number;

  /**
   * Current `scrollHeight` of the element.
   */
  scrollHeight: number;

  /**
   * Previous `scrollWidth` of the element.
   */
  previousScrollWidth: number;

  /**
   * Previous `scrollHeight` of the element.
   */
  previousScrollHeight: number;
}

export interface SVObserveOptions {
  /**
   * Specifies the direction in which to listen for changes.
   */
  direction?: 'x' | 'y';
}

/**
 * The function called whenever an observed resize occurs.
 *
 * @param  entries - An array of `SVResizeObserverEntrie` objects that can be used to access the new dimensions of the element after each change.
 * @param  observer - A reference to the `SVResizeObserver` itself.
 */
export type SVResizeCallback = (entries: Readonly<SVResizeObserverEntrie>[], observer: SVResizeObserver) => void;

export class SVResizeObserver {
  private dataset: {
    target: Element;
    entrie: SVResizeObserverEntrie;
    direction?: 'x' | 'y';
    resize: ResizeObserver;
    mutation: MutationObserver;
  }[] = [];

  constructor(private callback: SVResizeCallback) {}

  /**
   * Observing the specified `Element`
   *
   * @param target - A reference to an `Element` to be observed.
   */
  observe(target: Element, options?: SVObserveOptions) {
    const resizeObserver = new ResizeObserver(() => {
      this._checkChange();
    });
    for (let i = 0; i < target.children.length; i++) {
      resizeObserver.observe(target.children[i]);
    }

    const mutationObserver = new MutationObserver(() => {
      this._checkChange();

      this.unobserve(target);
      // eslint-disable-next-line
      this.observe.apply(this, arguments as any);
    });
    mutationObserver.observe(target, { childList: true });

    const [scrollWidth, scrollHeight] = [target.scrollWidth, target.scrollHeight];
    this.dataset.push({
      target,
      entrie: {
        target,
        scrollWidth,
        scrollHeight,
        previousScrollWidth: scrollWidth,
        previousScrollHeight: scrollHeight,
      },
      direction: options?.direction,
      resize: resizeObserver,
      mutation: mutationObserver,
    });
  }

  /**
   * Ends the observing of a specified `Element`.
   *
   * @param target - A reference to an `Element` to be unobserved.
   */
  unobserve(target: Element) {
    const dataset = [];
    for (const data of this.dataset) {
      if (data.target === target) {
        data.resize.disconnect();
        data.mutation.disconnect();
      } else {
        dataset.push(data);
      }
    }

    this.dataset = dataset;
  }

  /**
   * Unobserves all observed `Element` targets.
   */
  disconnect() {
    for (const data of this.dataset) {
      data.resize.disconnect();
      data.mutation.disconnect();
    }

    this.dataset = [];
  }

  private _checkChange() {
    let hasChange = false;
    const entries: Readonly<SVResizeObserverEntrie>[] = [];
    for (const data of this.dataset) {
      const [scrollWidth, scrollHeight] = [data.target.scrollWidth, data.target.scrollHeight];

      const scrollWidthChange = data.entrie.scrollWidth !== scrollWidth;
      const scrollHeightChange = data.entrie.scrollHeight !== scrollHeight;
      switch (data.direction) {
        case undefined:
          hasChange = scrollWidthChange || scrollHeightChange;
          break;

        case 'x':
          hasChange = scrollWidthChange;
          break;

        case 'y':
          hasChange = scrollHeightChange;
          break;

        default:
          break;
      }

      data.entrie.previousScrollHeight = data.entrie.scrollHeight;
      data.entrie.previousScrollWidth = data.entrie.scrollWidth;
      data.entrie.scrollWidth = scrollWidth;
      data.entrie.scrollHeight = scrollHeight;
      entries.push(Object.freeze({ ...data.entrie }));
    }

    if (hasChange) {
      this.callback(entries, this);
    }
  }
}
