import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Directory {
  'files' : Array<string>,
  'name' : string,
  'subdirectories' : Array<string>,
}
export interface _SERVICE {
  'createDirectory' : ActorMethod<[string, string], boolean>,
  'createFile' : ActorMethod<[string, string, string], boolean>,
  'deleteDirectory' : ActorMethod<[string, string], boolean>,
  'deleteFile' : ActorMethod<[string, string], boolean>,
  'listDirectory' : ActorMethod<[string], [] | [Directory]>,
  'readFile' : ActorMethod<[string], [] | [string]>,
  'updateFile' : ActorMethod<[string, string], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
