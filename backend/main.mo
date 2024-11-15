import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Text "mo:base/Text";

actor {
  type File = {
    name: Text;
    content: Text;
  };

  type Directory = {
    name: Text;
    files: [Text];
    subdirectories: [Text];
  };

  stable var fileEntries : [(Text, File)] = [];
  stable var directoryEntries : [(Text, Directory)] = [];

  var files = HashMap.fromIter<Text, File>(fileEntries.vals(), 10, Text.equal, Text.hash);
  var directories = HashMap.fromIter<Text, Directory>(directoryEntries.vals(), 10, Text.equal, Text.hash);

  public func createFile(path: Text, name: Text, content: Text) : async Bool {
    let file : File = { name = name; content = content };
    let fullPath = path # "/" # name;
    
    switch (directories.get(path)) {
      case (null) { return false; };
      case (?dir) {
        let updatedFiles = Array.append<Text>(dir.files, [name]);
        let updatedDir : Directory = {
          name = dir.name;
          files = updatedFiles;
          subdirectories = dir.subdirectories;
        };
        directories.put(path, updatedDir);
        files.put(fullPath, file);
        return true;
      };
    };
  };

  public query func readFile(path: Text) : async ?Text {
    switch (files.get(path)) {
      case (null) { null };
      case (?file) { ?file.content };
    };
  };

  public func updateFile(path: Text, content: Text) : async Bool {
    switch (files.get(path)) {
      case (null) { false };
      case (?file) {
        let updatedFile : File = {
          name = file.name;
          content = content;
        };
        files.put(path, updatedFile);
        true;
      };
    };
  };

  public func deleteFile(path: Text, name: Text) : async Bool {
    let fullPath = path # "/" # name;
    switch (files.remove(fullPath)) {
      case (null) { false };
      case (?_) {
        switch (directories.get(path)) {
          case (null) { false };
          case (?dir) {
            let updatedFiles = Array.filter<Text>(dir.files, func (f) { f != name });
            let updatedDir : Directory = {
              name = dir.name;
              files = updatedFiles;
              subdirectories = dir.subdirectories;
            };
            directories.put(path, updatedDir);
            true;
          };
        };
      };
    };
  };

  public func createDirectory(path: Text, name: Text) : async Bool {
    let fullPath = if (path == "/") { "/" # name } else { path # "/" # name };
    let newDir : Directory = {
      name = name;
      files = [];
      subdirectories = [];
    };
    
    switch (directories.get(path)) {
      case (null) { return false; };
      case (?dir) {
        let updatedSubdirs = Array.append<Text>(dir.subdirectories, [name]);
        let updatedDir : Directory = {
          name = dir.name;
          files = dir.files;
          subdirectories = updatedSubdirs;
        };
        directories.put(path, updatedDir);
        directories.put(fullPath, newDir);
        return true;
      };
    };
  };

  public query func listDirectory(path: Text) : async ?Directory {
    directories.get(path);
  };

  public func deleteDirectory(path: Text, name: Text) : async Bool {
    let fullPath = if (path == "/") { "/" # name } else { path # "/" # name };
    switch (directories.remove(fullPath)) {
      case (null) { false };
      case (?_) {
        switch (directories.get(path)) {
          case (null) { false };
          case (?dir) {
            let updatedSubdirs = Array.filter<Text>(dir.subdirectories, func (d) { d != name });
            let updatedDir : Directory = {
              name = dir.name;
              files = dir.files;
              subdirectories = updatedSubdirs;
            };
            directories.put(path, updatedDir);
            true;
          };
        };
      };
    };
  };

  system func preupgrade() {
    fileEntries := Iter.toArray(files.entries());
    directoryEntries := Iter.toArray(directories.entries());
  };

  system func postupgrade() {
    files := HashMap.fromIter<Text, File>(fileEntries.vals(), 10, Text.equal, Text.hash);
    directories := HashMap.fromIter<Text, Directory>(directoryEntries.vals(), 10, Text.equal, Text.hash);
    
    if (directories.size() == 0) {
      let rootDir : Directory = {
        name = "root";
        files = [];
        subdirectories = [];
      };
      directories.put("/", rootDir);
    };
  };
}
