

# FileSystemHandle

## Instance properties

kind Read only
Returns the type of entry. This is 'file' if the associated entry is a file or 'directory'.

name Read only
Returns the name of the associated entry.

Instance methods
isSameEntry()
Compares two handles to see if the associated entries (either a file or directory) match.

queryPermission() Experimental
Queries the current permission state of the current handle.

remove() Experimental Non-standard
Requests removal of the entry represented by the handle from the underlying file system.

requestPermission() Experimental
Requests read or readwrite permissions for the file handle.









# FileSystemFileHandle

## Instance methods

getFile()
Returns a Promise which resolves to a File object representing the state on disk of the entry represented by the handle.

createSyncAccessHandle()
Returns a Promise which resolves to a FileSystemSyncAccessHandle object that can be used to synchronously read from and write to a file. The synchronous nature of this method brings performance advantages, but it is only usable inside dedicated Web Workers.

createWritable()
Returns a Promise which resolves to a newly created FileSystemWritableFileStream object that can be used to write to a file.

=========================================



# FileSystemDirectoryHandle

## Instance methods


Regular methods:

FileSystemDirectoryHandle.getDirectoryHandle()
Returns a Promise fulfilled with a FileSystemDirectoryHandle for a subdirectory with the specified name within the directory handle on which the method is called.

FileSystemDirectoryHandle.getFileHandle()
Returns a Promise fulfilled with a FileSystemFileHandle for a file with the specified name, within the directory the method is called.

FileSystemDirectoryHandle.removeEntry()
Attempts to asynchronously remove an entry if the directory handle contains a file or directory called the name specified.

FileSystemDirectoryHandle.resolve()
Returns a Promise fulfilled with an Array of directory names from the parent handle to the specified child entry, with the name of the child entry as the last array item.

Asynchronous iterator methods:

FileSystemDirectoryHandle.entries()
Returns a new async iterator of a given object's own enumerable property [key, value] pairs.

FileSystemDirectoryHandle.keys()
Returns a new async iterator containing the keys for each item in FileSystemDirectoryHandle.

FileSystemDirectoryHandle.values()
Returns a new async iterator containing the values for each index in the FileSystemDirectoryHandle object.

FileSystemDirectoryHandle[@@asyncIterator]()
Returns the entries function by default.

