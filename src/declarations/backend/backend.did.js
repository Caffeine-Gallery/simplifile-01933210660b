export const idlFactory = ({ IDL }) => {
  const Directory = IDL.Record({
    'files' : IDL.Vec(IDL.Text),
    'name' : IDL.Text,
    'subdirectories' : IDL.Vec(IDL.Text),
  });
  return IDL.Service({
    'createDirectory' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'createFile' : IDL.Func([IDL.Text, IDL.Text, IDL.Text], [IDL.Bool], []),
    'deleteDirectory' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'deleteFile' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'listDirectory' : IDL.Func([IDL.Text], [IDL.Opt(Directory)], ['query']),
    'readFile' : IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ['query']),
    'updateFile' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
