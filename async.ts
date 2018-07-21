/**
 *    _____ __
 *   / ___// /_  _____
 *   \__ \/ / / / / _ \
 *  ___/ / / /_/ /  __/
 * /____/_/\__, /\___/
 *       /____/
 *       Copyright 2018 Parsa Ghadimi. All Rights Reserved.
 *       Licence: MIT License
 */

import React, { Component } from "react";

// This file contains HTML elements that are able to get
// promises as their props.
// <Img
//   src={resolveWithDelay("src", 2000)}
//   loading={{ src: pathToLoadingImg }} />

export type AsyncProps<P> = {
  [K in keyof P]+?: P[K] | Promise<P[K]>;
};

export type AsyncPropsWithLoading<P> = AsyncProps<P> & { loading?: P };

function createAsyncComponent<Props extends {}>(
  element: string,
  defaultLoading: Props
): React.ComponentClass<AsyncPropsWithLoading<Props>> {
  class AsyncComponent extends Component<AsyncPropsWithLoading<Props>> {
    static displayName = `Async(${element})`;
    state = {};
    pending = new Map<string, Promise<any>>();
    render() {
      const { loading } = this.props as any;
      const comLoading = {};
      const comProps = {};
      for (const key in this.props) {
        if (this.props[key] && typeof this.props[key].then === "function") {
          if (this.state.hasOwnProperty(key)) continue;
          if (this.pending.has(key)) continue;
          this.pending.set(key, this.props[key]);
          this.props[key].then(value => {
            if (this.pending.get(key) === this.props[key]) {
              this.setState({ [key]: value });
            }
          });
          comLoading[key] = defaultLoading[key] || loading[key];
        } else {
          if (this.state.hasOwnProperty(key)) {
            delete this.state[key];
          }
          if (this.pending.has(key)) {
            this.pending.delete(key);
          }
          comProps[key] = this.props[key];
        }
      }
      const componentProps = {
        ...comLoading,
        ...comProps,
        ...this.state as any,
      };
      return React.createElement(element, componentProps, this.props.children);
    }
  }
  return AsyncComponent;
}

// tslint:disable:variable-name
export const Img =
  createAsyncComponent<React.ImgHTMLAttributes<HTMLImageElement>>("img", {
    // Transparent 1x1px png image
    src: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1" +
    "HAwCAAAAC0lEQVR4nGNiYAAAAAkAAxkR2eQAAAAASUVORK5CYII="
  });
