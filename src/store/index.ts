/** 全局唯一数据中心 **/

import { init, Models, RematchDispatch, RematchRootState } from "@rematch/core";

import app from "@/models/app";
import sys from "@/models/sys";
import guster from "@/models/guster";

export interface RootModel extends Models<RootModel> {
  app: typeof app;
  sys: typeof sys;
  guster: typeof guster;
}

const rootModel: RootModel = { app, sys, guster };
const store = init({
  models: rootModel,
  redux: {
    reduxRematchOptions: {
      reduxDevTools: true,
    },
  } as any,
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;

export default store;
