// This file is created by egg-ts-helper@1.35.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportFile from '../../../app/service/file';
import ExportTest from '../../../app/service/test';
import ExportUser from '../../../app/service/user';
import ExportWechat from '../../../app/service/wechat';

declare module 'egg' {
  interface IService {
    file: AutoInstanceType<typeof ExportFile>;
    test: AutoInstanceType<typeof ExportTest>;
    user: AutoInstanceType<typeof ExportUser>;
    wechat: AutoInstanceType<typeof ExportWechat>;
  }
}
