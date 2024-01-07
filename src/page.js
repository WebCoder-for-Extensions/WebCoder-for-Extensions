(() => {
    "use strict";
    console.log('page.js');
    const hnd_uuid = 'nuEcr';
    const hnd_toPageJS = "2P";
    const hnd_toContentJS = "2C";
    // =================================================================================
    if (typeof AbortSignal === 'undefined') {
        console.error("Your browser is not supported.")
        return;
    }
    /** @type {globalThis.PromiseConstructor} */
    const Promise = (async function () { })().constructor;
    const WritableStream_ = globalThis.WritableStream;
    const File_ = globalThis.File;
    const Blob_ = globalThis.Blob;

    const responseError = (res, tag) => {
        if (res === null || res === undefined) {
            return new DOMException(`${tag}: An unknown error occurs (0xC001)`, "NotAllowedError");
        } else if (!res) {
            return new DOMException(`${tag}: An unknown error occurs (0xC002)`, "NotAllowedError");
        } else if (res && res.error && typeof res.error.message === "string" && res.error.number) {
            return new DOMException(`${tag}: Error ${res.error.number} occurs - ${res.error.message}`, res.error.number === 404 ? "NotFoundError" : res.error.number === 500 ? "SyntaxError" : "NotAllowedError");
        } else if (res && res.error && typeof res.error.message === "string") {
            return new DOMException(`${tag}: An error occurs - ${res.error.message}`, "NotAllowedError");
        } else if (res && typeof res.error === "string") {
            return new DOMException(`${tag}: An error occurs - ${res.error}`, "NotAllowedError");
        } else if (res && typeof res.error === "number") {
            return new DOMException(`${tag}: Error ${res.error} occurs`, res.error === 404 ? "NotFoundError" : res.error === 500 ? "SyntaxError" : "NotAllowedError")
        } else if (res && typeof res.error === "object") {
            return new DOMException(`${tag}: An error occurs - ${JSON.stringify(res.error)}`, "NotAllowedError");
        } else if (res && res.error) {
            return new DOMException(`${tag}: An error occurs - ${res.error}`, "NotAllowedError");
        } else if (typeof res === "string") {
            return new DOMException(`${tag}: An error occurs - ${res}`, "NotAllowedError");
        } else if (typeof res === "number") {
            return new DOMException(`${tag}: Error ${res} occurs`, res === 404 ? "NotFoundError" : res === 500 ? "SyntaxError" : "NotAllowedError")
        } else if (typeof res === "object") {
            return new DOMException(`${tag}: An error occurs - ${JSON.stringify(res)}`, "NotAllowedError");
        } else {
            return new DOMException(`${tag}: An unknown error occurs (0xC003)`, "NotAllowedError");
        }
    }

    class TimeoutError extends DOMException {
        constructor(msg = 'signal timed out') {
            super(msg, 'TimeoutError');
        }
    }

    const _genericTextChars = {
        1: '\x20\xA0\u2000-\u200A\u202F\u205F\u3000',
        2: '\u200B-\u200D\u2060\uFEFF',
        4: '\u180E\u2800\u3164',
        8: '\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\u2800',
        16: '\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\u2800\t\r\n' // plus tab (\x09), newline (\x0A), \r
    }
    const _genericTextREs = {
        1: new RegExp(`[${_genericTextChars[1]}]`, 'g'),
        2: new RegExp(`[${_genericTextChars[2]}]`, 'g'),
        4: new RegExp(`[${_genericTextChars[4]}]`, 'g'),
        8: new RegExp(`[${_genericTextChars[8]}]`, 'g'),
        16: new RegExp(`[${_genericTextChars[16]}]`, 'g')
    }
    function genericText(text, flag) {

        // https://unicode-explorer.com/articles/space-characters
        // https://medium.com/@ray102467/js-regex-3fbfe4d3115

        if (!text || typeof text !== 'string') return text;

        // regular space to space
        if (flag & 1) text = text.replace(_genericTextREs[1], (flag & (1 << 8)) ? '' : ' '); // 1 | 256

        // zero-width space to empty
        if (flag & 2) text = text.replace(_genericTextREs[2], '');

        // space chars to space
        if (flag & 4) text = text.replace(_genericTextREs[4], (flag & (1 << 8)) ? '' : ' '); // 4 | 1024

        // improper chars to empty
        if (flag & 8) text = text.replace(_genericTextREs[8], '');

        // improper+ chars to empty
        if (flag & 16) text = text.replace(_genericTextREs[16], '');

        return text;

    }
    function generateRandomID() {
        return Math.floor(Math.random() * 982451653 + 982451653).toString(36);
    }
    function generateRandomTimedID() {
        return `${generateRandomID()}.${Date.now().toString(36)}`;
    }
    const instanceId_ = generateRandomTimedID();
    const symbol1 = Symbol("adapter");
    function setStringTag(Class_, tag) {
        Object.defineProperty(Class_.prototype, Symbol.toStringTag, {
            value: tag,
            writable: false,
            enumerable: false,
            configurable: true
        });
    }
    function setEnumerable(Class_, props) {
        for (const property of props) {
            Object.defineProperty(Class_.prototype, property, { enumerable: true });
        }
    }

    /*
    class FileSystemHandleY extends FileSystemHandle{
        constructor(...args){
            super(...args);
            console.log('FileSystemHandleY', args.length, args);
        }

    }

    class FileSystemFileHandleY extends FileSystemHandleY{
        constructor(...args){
            super(...args);
            console.log('FileSystemFileHandleY', args.length, args);
        }
    }


    class FileSystemDirectoryHandleY extends FileSystemHandleY{
        constructor(...args){
            super(...args);
            console.log('FileSystemDirectoryHandleY', args.length, args);
        }
    }
    */


    class FileSystemHandleV {
        constructor(t) {
            this.kind = t.kind, this.name = t.name, this[symbol1] = t;

            // Object.setPrototypeOf(this, WritableStream_.prototype);
        }
        get isFile() {
            return "file" === this.kind
        }
        get isDirectory() {
            return "directory" === this.kind
        }
        async queryPermission(t = {
            mode: "read"
        }) {
            const n = this[symbol1];
            if (n.queryPermission) return n.queryPermission(t);
            if ("read" === t.mode) return "granted";
            if ("readwrite" === t.mode) return n.writable ? "granted" : "denied";
            throw new TypeError(`Mode ${t.mode} must be 'read' or 'readwrite'`)
        }
        async requestPermission(t = {
            mode: "read"
        }) {
            const n = this[symbol1];
            if (n.requestPermission) return n.requestPermission(t);
            if ("read" === t.mode) return "granted";
            if ("readwrite" === t.mode) return n.writable ? "granted" : "denied";
            throw new TypeError(`Mode ${t.mode} must be 'read' or 'readwrite'`)
        }
        async isSameEntry(t) {
            return this === t || this.kind === t.kind && !!t[symbol1] && await this[symbol1].isSameEntry(t[symbol1])
        }
    }
    setStringTag(FileSystemHandleV, "FileSystemHandle");
    class FileSystemWritableFileStreamV extends WritableStream_ {
        constructor(e, t) {
            super(e, t);
            this._closed = false;
            //  Object.setPrototypeOf(this, WritableStream_.prototype);
        }
        close() {
            this._closed = true;
            const e = this.getWriter(),
                t = e.close();
            return e.releaseLock(), t
        }
        seek(e) {
            return this.write({
                type: "seek",
                position: e
            })
        }
        truncate(e) {
            return this.write({
                type: "truncate",
                size: e
            })
        }
        write(e) {
            if (this._closed) return Promise.reject(new TypeError("Cannot write to a CLOSED writable stream"));
            const t = this.getWriter(),
                n = t.write(e);
            return t.releaseLock(), n
        }
    }
    setStringTag(FileSystemWritableFileStreamV, "FileSystemWritableFileStream");
    Object.defineProperties(FileSystemWritableFileStreamV.prototype, {
        close: {
            enumerable: true
        },
        seek: {
            enumerable: true
        },
        truncate: {
            enumerable: true
        },
        write: {
            enumerable: true
        }
    });
    const symbol2 = Symbol("adapter");
    class FileSystemFileHandleV extends FileSystemHandleV {
        constructor(e) {
            super(e), this.kind = "file", this[symbol2] = e;
            // Object.setPrototypeOf(this, WritableStream_.prototype);
            // console.log(5533, e)
        }
        async createWritable(e = {}) {
            return new FileSystemWritableFileStreamV(await this[symbol2].createWritable(e))
        }
        async getFile() {
            return this[symbol2].getFile()
        }
    }
    setStringTag(FileSystemFileHandleV, "FileSystemFileHandle");
    Object.defineProperties(FileSystemFileHandleV.prototype, {
        createWritable: {
            enumerable: true
        },
        getFile: {
            enumerable: true
        }
    });
    const symbol3 = Symbol("adapter");
    class FileSystemDirectoryHandleV extends FileSystemHandleV {
        constructor(e) {
            super(e), this.kind = "directory", this[symbol3] = e;
            if (FileSystemDirectoryHandleV.onCreate9188) FileSystemDirectoryHandleV.onCreate9188();
        }
        async getDirectoryHandle(e, t = {}) {
            if ("" === e) throw new TypeError("Name can't be an empty string.");
            if ("." === e || ".." === e || e.includes("/")) throw new TypeError("Name contains invalid characters.");
            return new FileSystemDirectoryHandleV(await this[symbol3].getDirectoryHandle(e, t))
        }
        getDirectory(e, t = {}) {
            return this.getDirectoryHandle(e, t)
        }
        async * entries() {
            for await (const [, e] of this[symbol3].entries()) yield [e.name, "file" === e.kind ? new FileSystemFileHandleV(e) : new FileSystemDirectoryHandleV(e)]
        }
        async * getEntries() {
            return this.entries()
        }
        async * keys() {
            for await (const [e] of this[symbol3].entries()) yield e
        }
        async * values() {
            for await (const [, e] of this.entries()) yield e
        }
        async getFileHandle(e, t = {}) {
            if ("" === e) throw new TypeError("Name can't be an empty string.");
            if ("." === e || ".." === e || e.includes("/")) throw new TypeError("Name contains invalid characters.");
            return t.create = !!t.create, new FileSystemFileHandleV(await this[symbol3].getFileHandle(e, t))
        }
        getFile(e, t = {}) {
            return this.getFileHandle(e, t)
        }
        async removeEntry(e, t = {}) {
            if ("" === e) throw new TypeError("Name can't be an empty string.");
            if ("." === e || ".." === e || e.includes("/")) throw new TypeError("Name contains invalid characters.");
            return t.recursive = !!t.recursive,
                this[symbol3].removeEntry(e, t)
        }
        async resolve(e) {
            if (await e.isSameEntry(this)) return [];
            const t = [{
                handle: this,
                path: []
            }];
            for (; t.length;) {
                const {
                    handle: n,
                    path: r
                } = t.pop();
                for await (const i of n.values()) { // n.values() is an async iterables
                    if (await i.isSameEntry(e)) return [...r, i.name];
                    "directory" === i.kind && t.push({
                        handle: i,
                        path: [...r, i.name]
                    })
                }
            }
            return null
        }
        [Symbol.asyncIterator]() {
            return this.entries()
        }
    }
    setStringTag(FileSystemDirectoryHandleV, "FileSystemDirectoryHandle");
    Object.defineProperties(FileSystemDirectoryHandleV.prototype, {
        getDirectoryHandle: {
            enumerable: true
        },
        entries: {
            enumerable: true
        },
        getFileHandle: {
            enumerable: true
        },
        removeEntry: {
            enumerable: true
        }
    });


    // =================================================================================
    const {
        INVALID: f,
        GONE: p,
        MISMATCH: m,
        MOD_ERR: w,
        SYNTAX: y,
        DISALLOWED: g
    } = {
        INVALID: ["seeking position failed.", "InvalidStateError"],
        GONE: ["A requested file or directory could not be found at the time an operation was processed.", "NotFoundError"],
        MISMATCH: ["The path supplied exists, but was not an entry of requested type.", "TypeMismatchError"],
        MOD_ERR: ["The object can not be modified in this way.", "InvalidModificationError"],
        SYNTAX: e => [`Failed to execute 'write' on 'UnderlyingSinkBase': Invalid params passed. ${e}`, "SyntaxError"],
        ABORT: ["The operation was aborted", "AbortError"],
        SECURITY: ["It was determined that certain files are unsafe for access within a Web application, or that too many calls are being made on file resources.", "SecurityError"],
        DISALLOWED: ["The request is not allowed by the user agent or the platform in the current context.", "NotAllowedError"]
    };
    class WritableV {
        constructor(e, t, n) {
            e.file, this.fileHandle = e, this.file = n ? t : new File_([], t.name, t), this.size = n ? t.size : 0, this.position = 0
        }
        async write(e) {
            if (!this.fileHandle.file) throw new DOMException(...p);
            let t = this.file;
            if ((e => "object" == typeof e && void 0 !== e.type)(e))
                if ("write" === e.type) {
                    if ("number" == typeof e.position && e.position >= 0 && (this.position = e.position, this.size < e.position && (this.file = new File_([this.file, new ArrayBuffer(e.position - this.size)], this.file.name, this.file), wEventEmitter && wEventEmitter.emit("modified", this.fileHandle))), !("data" in e)) throw new DOMException(...y("write requires a data argument"));
                    e = e.data
                } else {
                    if ("seek" === e.type) {
                        if (Number.isInteger(e.position) && e.position >= 0) {
                            if (this.size < e.position) throw new DOMException(...f);
                            return void (this.position = e.position)
                        }
                        throw new DOMException(...y("seek requires a position argument"))
                    }
                    if ("truncate" === e.type) {
                        if (Number.isInteger(e.size) && e.size >= 0) return t = e.size < this.size ? new File_([t.slice(0, e.size)], t.name, t) : new File_([t, new Uint8Array(e.size - this.size)], t.name, t), this.size = t.size, this.position > t.size && (this.position = t.size), this.file = t, void (wEventEmitter && wEventEmitter.emit("modified", this.fileHandle));
                        throw new DOMException(...y("truncate requires a size argument"))
                    }
                } e = new Blob_([e]);
            let n = this.file;
            const r = n.slice(0, this.position),
                i = n.slice(this.position + e.size);
            let s = this.position - r.size;
            s < 0 && (s = 0), n = new File_([r, new Uint8Array(s), e, i], n.name), this.size = n.size, this.position += e.size, this.file = n, wEventEmitter && wEventEmitter.emit("modified", this.fileHandle)
        }
        async close() {
            if (!this.fileHandle.file) throw new DOMException(...p);
            this.fileHandle.file.set(this.file), this.file = this.position = this.size = null,
                this.fileHandle.onclose && this.fileHandle.onclose(this.fileHandle)
        }
    }
    class FileWrapper {
        constructor(e = "", t = new File_([], e)) {
            this.file = t
        }
        async get() {
            return this.file
        }
        async set(e) {
            this.file = e
        }
    }
    class FileEntry {
        constructor(e = "", t = new FileWrapper, n = true) {
            this.kind = "file", this.deleted = false, this.file = t instanceof FileWrapper ? t : new FileWrapper(e, t), this.name = e, this.writable = n, wEventEmitter && wEventEmitter.emit("created", this)
        }
        async getFile() {
            if (this.deleted || null === this.file) throw new DOMException(...p);
            return await this.file.get()
        }
        async createWritable(e) {
            if (!this.writable) throw new DOMException(...g);
            if (this.deleted) throw new DOMException(...p);
            const t = await this.file.get();
            return new WritableV(this, t, !!e?.keepExistingData)
        }
        async isSameEntry(e) {
            return this === e
        }
        destroy() {
            wEventEmitter && wEventEmitter.emit("deleted", this), this.deleted = true, this.file = null
        }
    }
    class FolderEntry {
        constructor(folderName, folderWritable = true) {
            this.kind = "directory", this.deleted = false, this.name = folderName, this.writable = folderWritable, this._entries = {}, wEventEmitter && wEventEmitter.emit("created", this)
        }
        async * entries() {
            if (this.deleted) throw new DOMException(...p);
            yield* Object.entries(this._entries)
        }
        async isSameEntry(e) {
            return this === e
        }
        async getDirectoryHandle(e, t = {}) {
            if (this.deleted) throw new DOMException(...p);
            const n = this._entries[e];
            if (n) {
                if (n instanceof FileEntry) throw new DOMException(...m);
                return n
            }
            if (t.create) {
                const t = this._entries[e] = new FolderEntry(e);
                return wEventEmitter && wEventEmitter.emit("created", t), t
            }
            throw new DOMException(...p)
        }
        async getFileHandle(e, t = {}) {
            const n = this._entries[e];
            if (n) {
                if (n instanceof FileEntry) return n;
                throw new DOMException(...m)
            }
            if (t.create) return this._entries[e] = new FileEntry(e);
            throw new DOMException(...p)
        }
        async removeEntry(e, t = {}) {
            const n = this._entries[e];
            if (!n) throw new DOMException(...p);
            n.destroy(t.recursive), delete this._entries[e]
        }
        destroy(e) {
            for (const t of Object.values(this._entries)) {
                if (!e) throw new DOMException(...w);
                t.destroy(e)
            }
            wEventEmitter && wEventEmitter.emit("deleted", this);
            this._entries = {};
            this.deleted = true;
        }
    }
    let wFolderEntry, wEventEmitter;
    const getFolderEntry = e => {
        const {
            name: name,
            writeable: writeable = true,
            eventEmitter: eventEmitter,
            entries: entries
        } = e;
        wFolderEntry = new FolderEntry(name, writeable);
        entries && (wFolderEntry._entries = entries);
        wEventEmitter = eventEmitter;
        return wFolderEntry
    };
    const setTimeout_ = (self.vscodeOriginalSetTimeout || self.setTimeout).bind(self);
    const clearTimeout_ = (self.vscodeOriginalClearTimeout || self.clearTimeout).bind(self);
    const delayPn = delay => new Promise((fn => setTimeout_(fn, delay)));

    const ncw = !window.content_world;

    class EventController {
        constructor() {
            this.events = {}
        }
        on(e, t) {
            const {
                events: n
            } = this;
            let r = n[e];
            return r || (r = [], n[e] = r), r.push(t), () => this.off(e, t)
        }
        once(e, t) {
            const n = this.on(e, ((...e) => (n(), t.bind(this)(...e))));
            return n
        }
        off(e, t) {
            const n = this.events[e];
            if (n) {
                const e = n.indexOf(t);
                e >= 0 && n.splice(e, 1)
            }
        }
        emit(e, ...t) {
            const n = this.events[e];
            if (n)
                for (const e of n)
                    if (e(...t)) return true;
            return false
        }
    }
    const traceError = e => e.error;
    const MSG_TIMEOUT = "Extension communication timed out!";
    class FileWrapperWithCache extends FileWrapper {
        constructor(name, path, handler) {
            super(), this.name = name, this.path = path, this.handler = handler
        }
        async get() {
            const e = await this.handler.get(this.name, this.path, this.cache?.lastModified);
            return this.cache?.lastModified && e.lastModified === this.cache.lastModified || (this.cache = e), this.cache
        }
        async set(e) {
            this.cache = e, await this.handler.set(this.name, this.path, e)
        }
    }
    const ue = e => ({
        "/": "∕",
        "\\": "⑊",
    }[e] || e);
    const fe = e => e.replace(/[/:\\]/g, ue);
    const fe2 = e => genericText(fe(e), 1 | 2 | 16);

    const createPipeline = () => {
        let pipelineMutex = Promise.resolve();
        const pipelineExecution = fn => {
            return new Promise((resolve, reject) => {
                pipelineMutex = pipelineMutex.then(async () => {
                    let res;
                    try {
                        res = await fn();
                    } catch (e) {

                        console.log("WebCoder_Extensions(0x7A01)", e);
                        reject(e);
                    }
                    resolve(res);
                }).catch(console.warn);
            });
        };
        return pipelineExecution;
    }

    const ioPipelineExec = createPipeline();
    const folderAddPipelineExec = createPipeline();
    const observablePromise = (proc, timeoutPromise) => {
        let promise = null;
        return {
            obtain() {
                if (!promise) {
                    promise = new Promise(resolve => {
                        let mo = null;
                        const f = () => {
                            let t = proc();
                            if (t) {
                                mo.disconnect();
                                mo.takeRecords();
                                mo = null;
                                resolve(t);
                            }
                        }
                        mo = new MutationObserver(f);
                        mo.observe(document, { subtree: true, childList: true })
                        f();
                        timeoutPromise && timeoutPromise.then(() => {
                            resolve(null)
                        });
                    });
                }
                return promise
            }
        }
    }
    // =================================================================================

    // Object.defineProperty(Object.prototype,'cache', {
    //     get(){
    //         // debugger;
    //         return ()=>{

    //             console.log(1232)

    //         }
    //     },
    //     set(){
    //         // debugger;
    //         return true;
    //     },
    //     enumerable:true,
    //     configurable:true
    // });

    const em = Symbol();
    //     Object.defineProperty(Object.prototype,'kind', {
    //     get(){
    //         // debugger;
    //         console.log(this)
    //        return this[em];

    //     },
    //     set(nv){
    //         this[em]=nv;
    //         console.log(this)
    //         // debugger;
    //         return true;
    //     },
    //     enumerable:true,
    //     configurable:true
    // });

    const PromiseExternal = ((resolve_, reject_) => {
        const h = (resolve, reject) => { resolve_ = resolve; reject_ = reject };
        return class PromiseExternal extends Promise {
            constructor(cb = h) {
                super(cb);
                if (cb === h) {
                    /** @type {(value: any) => void} */
                    this.resolve = resolve_;
                    /** @type {(reason?: any) => void} */
                    this.reject = reject_;
                }
            }
        };
    })();

    const loaderReadyPromise = new PromiseExternal();

    const handlerStores = [];

    const attrLex = 'ivoymbnm';

    const eventHandlerF2G = new WeakMap();
    const eventHandlerG2F = new WeakMap();

    const DEBUG_EVENTS = false;

    function addEventListener_trash01() {

        // const list = ['target', 'dataTransfer', 'preventDefault', 'pageY', 'ctrlKey', 'altKey'];
        // const k = b;
        // b = function (evt) {
        //     let { target, dataTransfer, pageY, ctrlKey, altKey, type } = evt;
        //     pageY = 0;
        //     ctrlKey = altKey = false;

        //     const pvt = { target, dataTransfer, pageY, ctrlKey, altKey, type };
        //     pvt.isTrusted = true;
        //     pvt.preventDefault = () => evt.preventDefault();

        //     const types = ['Files'];

        //     pvt.dataTransfer = new Proxy(type === 'dragover' ? {} : dataTransfer, {

        //         get(target, prop, receiver) {
        //             if (prop === 'types') {

        //                 return types;
        //             } else {

        //                 console.log(32202, prop, typeof target[prop])
        //                 if (typeof target[prop] === 'function') return target[prop].bind(target);
        //                 return target[prop];
        //             }
        //         },

        //         set(target, prop, value, receiver) {

        //             if (prop === 'dropEffect') {

        //                 dataTransfer[prop] = value;
        //                 return true;
        //             } else {

        //                 console.log(32203, prop, typeof target[prop])
        //                 if (typeof target[prop] === 'function') return false;
        //                 target[prop] = value;
        //                 return true;
        //             }
        //         }
        //     });
        //     if (type === 'dragover') window.ssa = pvt
        //     if (type === 'drop') window.ssb = pvt
        //     if (type === 'dragover') window.ffa = k
        //     if (type === 'drop') window.ffb = k
        //     k(pvt);
        // }
    }

    const filterEventTypes = ['dragover', 'dragend', 'dragleave', 'drop']
    HTMLDivElement.prototype.addEventListener = function (a, b, c) {

        let doABC = false;

        try {

            const checking = () => (a === 'drop' || a === 'dragover') ? b.length >= 1 : true;

            if (!c && typeof b === 'function' && typeof a === 'string' && filterEventTypes.includes(a) && checking()) {


                let al;

                al = +(this.getAttribute(`${attrLex}`) || 0);
                if (!al) this.setAttribute(`${attrLex}`, al = handlerStores.push({}));
                let k = b;
                if (eventHandlerF2G.get(k)) {
                    b = eventHandlerF2G.get(k);
                } else {

                    b = function (evt) {
                        if (DEBUG_EVENTS && evt && !evt[attrLex]) console.log(evt.type, evt);
                        return k.call(this, evt);
                    }
                    eventHandlerF2G.set(k, b);
                    eventHandlerG2F.set(b, k);
                }
                const eStore = handlerStores[al - 1];
                eStore[a] = {
                    eventTarget: this, eventHandler: b, eventHandlerOri: k
                };

                if (eStore.dragover && eStore.drop) {

                    loaderReadyPromise.resolve();
                }


                doABC = true;
            }

        } finally {


            if (doABC) {

                return HTMLElement.prototype.addEventListener.call(this, a, b, c);
            } else {

                return HTMLElement.prototype.addEventListener.apply(this, arguments);
            }
        }

    };
    HTMLDivElement.prototype.removeEventListener = function (a, b, c) {

        let doABC = false;

        try {

            const checking = () => (a === 'drop' || a === 'dragover') ? b.length >= 1 : true;

            if (!c && typeof b === 'function' && typeof a === 'string' && filterEventTypes.includes(a) && checking()) {


                b = eventHandlerF2G.get(b) || b;


                doABC = true;
            }

        } finally {


            if (doABC) {

                return HTMLElement.prototype.removeEventListener.call(this, a, b, c);
            } else {

                return HTMLElement.prototype.removeEventListener.apply(this, arguments);
            }
        }

    };
    // ======================================
    let globalWorkerCallbackForList = null;
    /** @param {Window & typeof globalThis} win */
    function modifyWorker(win) {

        const eventHandling = (eventListener, event, target) => {
            // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#the_event_listener_callback
            if (!eventListener) return;
            if (typeof eventListener === 'function') {
                return eventListener.call(target, event);
            } else if (typeof eventListener.handleEvent === 'function') {
                return eventListener.handleEvent(event);
            }
        }

        win.Worker = ((WorkerOriginal) => {

            /** @type {WeakMap<Worker, Set<EventListener> & {fValue: Function | null}} */
            const eventHandlerStore = new WeakMap();

            class Worker extends WorkerOriginal {
                constructor(aURL, options) {
                    super(aURL, options);
                    const store = new Set();
                    store.fValue = null;
                    eventHandlerStore.set(this, store);
                }

                set onmessage(value) {
                    const store = eventHandlerStore.get(this);
                    value = (typeof value === "function" ? value : null);
                    store && (store.fValue = value);
                    super.onmessage = value;
                    return true;
                }
                get onmessage() {
                    return super.onmessage;
                }

                postMessage(msg) {
                    const { method, vsWorker, req } = msg;
                    if ("listDirectory" !== method && "searchDirectory" !== method) {
                        super.postMessage(msg);
                    } else {
                        // response the file searching request with empty result
                        const resultMsg = {
                            data: {
                                vsWorker: vsWorker,
                                seq: req,
                                method: method,
                                type: 1,
                                res: {
                                    results: [],
                                    limitHit: 0
                                }
                            }
                        };
                        setTimeout_(() => { // simulate setImmediate
                            const store = eventHandlerStore.get(this);
                            if (store) {
                                eventHandling(store.fValue, resultMsg, null);
                                if (store.size > 0) {
                                    for (const fn of store) {
                                        eventHandling(fn, resultMsg, null);
                                    }
                                }
                            }
                        }, 27);
                    }
                }
                addEventListener(evtType, eventListener) {
                    if ("message" === evtType) {
                        const store = eventHandlerStore.get(this);
                        store && store.add(eventListener);
                    }
                    return super.addEventListener(evtType, eventListener);
                }
                removeEventListener(evtType, eventListener) {
                    if ("message" === evtType) {
                        const store = eventHandlerStore.get(this);
                        store && store.delete(eventListener);
                    }
                    return super.removeEventListener(evtType, eventListener);
                }
            }

            return Worker;
        })(win.Worker);


    }



    function visualizeFilename(text) {

        text = text.replace(/^[a-zA-Z][-\w]+\:?(\/\/|⑊|∕∕)([^\/∕⑊\s]+)(\/|∕)/, '$2::');
        text = text.replace(/〜/g, '~');
        text = text.replace(/(\/|∕)/g, '〜')

        text = text.replace(/(@[a-zA-Z0-9]{32}|@[a-zA-Z0-9]{40}|@[a-zA-Z0-9]{64}|@[a-zA-Z0-9]{96}|@[a-zA-Z0-9]{128})\b/, '');
        text = text.replace(/::(gh|npm)〜(@?)/, '::$1.')

        return text;

    }
    function visualizeWord(text) {


        text = text.replace(/^[a-zA-Z][-\w]+\:?(\/\/|⑊|∕∕)([^\/∕⑊\s]+)(\/|∕)/, '$2::');
        text = text.replace(/〜/g, '~');
        text = text.replace(/(\/|∕)/g, '〜')

        return text;

    }

    const cssTextFn = () => `
                        
        @keyframes onAddFolderButtonInDialogAppeared {
            from {
                background-position-x: 3px;
            }
            to {
                background-position-x: 4px;
            }
        }

        .webcoder-for-extensions .monaco-dialog-box .monaco-button[title*="Add Folder"]:not(.secondary) {
            animation: onAddFolderButtonInDialogAppeared 1ms linear 0s 1 normal forwards;
        }


        @keyframes onYesITrustButtonInDialogAppeared {
            from {
                background-position-x: 3px;
            }
            to {
                background-position-x: 4px;
            }
        }

        .webcoder-for-extensions .monaco-dialog-box .monaco-button[title*="I trust"]:not(.secondary) {
            animation: onYesITrustButtonInDialogAppeared 1ms linear 0s 1 normal forwards;
        }


        @keyframes onYesButtonInDialogAppeared {
            from {
                background-position-x: 3px;
            }
            to {
                background-position-x: 4px;
            }
        }

        .webcoder-for-extensions .monaco-dialog-box .monaco-button[title*="Yes"]:not(.secondary) {
            animation: onYesButtonInDialogAppeared 1ms linear 0s 1 normal forwards;
        }


        body iframe#pshfz4uv[id] {

        position: fixed !important;
        top: -80px !important;
        left: -80px !important;
        width: 98px !important;
        height: 98px !important;
        /* z-index: 9999999; */

        z-index: -1 !important;
        pointer-events: none !important;
        opacity: 0.01 !important;

    
    }

    `;


    let promiseAddFolderBtn = null;
    let promiseYestITrustBtn = null;
    let promiseFileCreateWithDOMModification = null;
    let promiseFileCreateWithDOMModificationCounter = 0;

    let virualFolderRootPromise = new PromiseExternal();

    const mo = new MutationObserver(() => {

        if (promiseFileCreateWithDOMModification) {
            promiseFileCreateWithDOMModification.resolve();
            promiseFileCreateWithDOMModification = null;
        }
    });
    mo.observe(document, { subtree: true, childList: true });

    (async () => {

        const win = window;
        // const WorkerOriginal = win.Worker;
        let virualFolderRoots;
        let virualFolderRootsPending = null;
        let gclick = null;

        const config = {
            sendPrefix: hnd_toContentJS,
            listenPrefix: hnd_toPageJS
        };

        const IC = (() => {
            const {
                sendPrefix: spSend,
                listenPrefix: spListen
            } = config;
            let rHndId, rootElement, ix = 1;
            const ixLog = new Map();
            let shallEventQueue = false;
            const eventQueue = [];
            const convToCallbackId = cb => {
                ixLog.set(++ix, cb);
                return ix;
            };
            const dispatchMyEvent = (evtTag, evtDetail) => {
                const evt = new CustomEvent(evtTag, {
                    detail: evtDetail
                });
                dispatchEvent.call(window, evt);
            };
            const ceEventHandler = evt => {
                const {
                    m: tag,
                    r: cbId,
                    a: data
                } = evt instanceof CustomEvent ? evt.detail : {};
                if ("bridge.onpurge" == tag) (async () => {
                    if (rootElement !== window.document.documentElement) IC.refresh();
                })();
                else if ("unlock" == tag) {
                    shallEventQueue = false;
                    const e = eventQueue.slice(0);
                    eventQueue.length = 0;
                    e.forEach((e => e()))
                } else if ("message.response" == tag) {
                    if (null == cbId) throw "Invalid Message";
                    if (cbId) {
                        let fn = ixLog.get(cbId);
                        if (fn) {
                            ixLog.delete(cbId);
                            const d = (data === undefined) ? null : data;
                            fn(d);
                        }
                    }
                }
            };
            let p = () => { };
            const IC = {
                init: async uuid4 => {

                    let pz = rHndId ? 0 : uuid4;
                    if (pz) { rHndId = pz; }
                    if (rHndId) {
                        rootElement = window.document.documentElement;
                        addEventListener(`${spListen}_${rHndId}`, ceEventHandler, true);
                    }


                    await new Promise((resolve => {
                        const t = window.document.readyState;
                        if ("interactive" == t || "complete" == t) {
                            resolve()
                        } else {
                            window.addEventListener("DOMContentLoaded", resolve, {
                                capture: true,
                                once: true
                            });
                        }
                    }));
                    await (ncw ? (rootElement = document.documentElement, p = () => {
                        rootElement !== document.documentElement && (IC.refresh(), dispatchMyEvent(`${spSend}_${rHndId}`, {
                            m: "unlock",
                            a: void 0,
                            r: null
                        }))
                    }) : new Promise((resolve => {
                        if (ncw) throw "not supported";

                        // Create a MutationObserver to monitor DOM changes
                        const observer = new MutationObserver((mutations) => {
                            // Iterate over mutation records
                            const isRootElementAdded = mutations.some((mutation) => {
                                // Check if the root element is added in this mutation
                                return mutation.addedNodes.some(node => node === document.documentElement);
                            });

                            // If the root element is added, resolve and disconnect the observer
                            if (isRootElementAdded) {
                                resolve(document);
                                observer.disconnect();
                            }
                        });

                        // Start observing the document for childList changes
                        observer.observe(document, {
                            childList: true
                        });


                    })).then((() => {
                        shallEventQueue = true;
                        IC.send("bridge.onpurge");
                        IC.refresh();
                    })))
                },
                refresh: () => {
                    const e = rHndId;
                    if (e) {
                        IC.cleanup();
                        IC.init(e);
                    }
                },
                // switchId: e => {
                //     i && m.cleanup();
                //     f(e);
                // },

                /** @returns {void} */
                send: (tag, data, cb) => {
                    // t string
                    // n object
                    // r fn
                    // s void 0

                    // t string

                    if (typeof tag !== 'string') return;

                    cb = typeof cb === 'function' ? cb : undefined; // function | void

                    if (ncw) {
                        p();
                    }

                    // Define a function to dispatch an event
                    const u = () => {
                        const eventPayload = {
                            m: tag,
                            a: data,
                            r: cb ? convToCallbackId(cb) : null,
                            n: undefined
                        };
                        dispatchMyEvent(`${spSend}_${rHndId}`, eventPayload);
                    };

                    // Conditionally execute or queue the event dispatch
                    if (shallEventQueue) {
                        eventQueue.push(u);
                    } else {
                        u();
                    }
                },
                cleanup: () => {
                    if (rHndId) {
                        removeEventListener(`${spListen}_${rHndId}`, ceEventHandler, true);
                        rootElement = void 0;
                        rHndId = void 0
                    }
                }
            };
            return IC
        })();


        modifyWorker(win);

        const promiseOnError = Promise.race([
            delayPn(1400),
            observablePromise(() => win.onerror).obtain()
        ]);

        IC.init(hnd_uuid);
        let showed = false;
        win.vscodeOriginalShowOpenFilePicker = win.showOpenFilePicker;
        win.showOpenFilePicker = async () => {
            promiseAddFolderBtn = null;
            if (showed === true) {
                const res = await win.vscodeOriginalShowOpenFilePicker();
                console.log('showOpenFilePicker', res);
                return res;
            }
            return []
        };
        win.vscodeOriginalShowDirectoryPicker = win.showDirectoryPicker;
        let p39 = 0;
        win.showDirectoryPicker = async function () {

            promiseAddFolderBtn = null;

            console.log(5332, arguments);
            if (p39) {
                // debugger
            }

            const virualFolderRoot = await folderAddPipelineExec(async () => {

                if (!showed) {

                    await Promise.race([virualFolderRootPromise, delayPn(100 * 50)]);
                    if (!virualFolderRoots) {
                        alert("No extension is there to communicate.");
                        throw new DOMException("No extension is there to communicate.");
                    }


                    const virualFolderRoot = virualFolderRootsPending[0];
                    virualFolderRootsPending = virualFolderRootsPending.slice(1);
                    if (virualFolderRootsPending.length >= 1) {

                        folderAddPipelineExec(async () => {
                            window.mee = gclick;
                            // p39=1;
                            // document.body.dispatchEvent(new Event("mouse"))

                            await delayPn(100);

                        }).then(() => {
                            // win.showDirectoryPicker({
                            //     startIn: virualFolderRoot
                            // })

                            if (gclick) gclick.click();
                        })
                    }

                    return virualFolderRoot;


                }

            });

            if (showed === false) {
                if (virualFolderRoot && virualFolderRootsPending && virualFolderRootsPending.length === 0) {
                    showed = true;
                }
                return virualFolderRoot;
            }


            const res = await win.vscodeOriginalShowDirectoryPicker();
            console.log('showDirectoryPicker', res);
            return res;


        };
        async function getFileList() {

            const timeoutPromise = delayPn(6000);

            const res = (await Promise.race([timeoutPromise, new Promise(resolve => {
                IC.send("userscripts", { action: "list", instanceId: instanceId_ }, resolve);
            })]) || {
                error: {
                    message: "Self Communication Failure"
                }
            });
            if (!res || traceError(res)) {
                throw responseError(res, "WebCoder_Extensions(0x3C77)");
            }
            return res;
        }

        function isValidFilename(filename) {
            if (!filename || typeof filename !== "string") return false;
            return !/[<>:"/\\|?*]/.test(filename)
        }

        function convertToVFSEntry1(extId, extName, result) {

            if (!extId || !extName) return false;

            if (!result || !result.list) return false;

            const entries = result.list;

            const vfsEntries = [];

            for (const {
                path: path_,
                name: name_,
                namespace: ns_,
                requires: requires_,
                storage: storage_
            } of entries) {

                const path = `${path_ || ''}`;
                if (!path) continue;
                const storage = `${storage_ || ''}`;
                const requires = (requires_ || 0).length > 0 ? requires_ : [];
                const paths = [path, storage, ...requires].filter((e => !!e && typeof e === 'string'));
                for (let path of paths) {



                    path = `${path}` || "undefined";

                    const ns = `${ns_}` || "<namespace missing>";
                    const name = `${name_}` || "<filename missing>";

                    if (!path || !ns || !name) continue;

                    /* 
                        '0d334a55-8256-4d2e-8625-5a58a923768a/source'
                        '0d334a55-8256-4d2e-8625-5a58a923768a/storage'
                        '0d334a55-8256-4d2e-8625-5a58a923768a/external/https%3A%2F%2Ffastly.jsdelivr.net%2Fgh%2Fsizzlemctwizzle%2FGM_config%4006f2015c04db3aaab9717298394ca4f025802873%2Fgm_config.min.js'
                        '0d334a55-8256-4d2e-8625-5a58a923768a/external/https%3A%2F%2Ffastly.jsdelivr.net%2Fnpm%2F%40violentmonkey%2Fshortcut%401.4.1%2Fdist%2Findex.min.js'
                    */
                    let [, fileCategory, ...urlPaths] = path.split("/");

                    let folderLayers = [
                        fe2(ns),
                        fe2(name)
                    ];
                    if ("external" === fileCategory) {
                        folderLayers.push(fileCategory);
                    }


                    // Determine the file name based on the category and path.
                    let fileName;
                    if (fileCategory === "source") {
                        fileName = "script.user.js";
                    } else if (fileCategory === "storage") {
                        fileName = "storage.json";
                    } else if (urlPaths && urlPaths.length > 0) {
                        fileName = fe2(decodeURIComponent(urlPaths.join("/")));
                    } else if (isValidFilename(`${fileCategory}`)) {
                        fileName = fe2(`${fileCategory}`)
                    } else {
                        fileName = "<name missing>";
                    }


                    const vfsEntry = {
                        vPath: folderLayers.join('/') + '/' + fileName,
                        uPath: extId + ':' + path
                    }

                    vfsEntries.push(vfsEntry);


                }

            }

            return vfsEntries;

        }


        function convertToVFSEntry2(extId, extName, result) {


            if (!extId || !extName) return false;
            if (!result || !result.files) return false;

            const files = result.files;

            const vfsEntries = [];




            for (const {
                name: name_,
                unders: unders_,
                path: path_,
            } of files) {


                /* 
                    '0d334a55-8256-4d2e-8625-5a58a923768a/source'
                    '0d334a55-8256-4d2e-8625-5a58a923768a/storage'
                    '0d334a55-8256-4d2e-8625-5a58a923768a/external/https%3A%2F%2Ffastly.jsdelivr.net%2Fgh%2Fsizzlemctwizzle%2FGM_config%4006f2015c04db3aaab9717298394ca4f025802873%2Fgm_config.min.js'
                    '0d334a55-8256-4d2e-8625-5a58a923768a/external/https%3A%2F%2Ffastly.jsdelivr.net%2Fnpm%2F%40violentmonkey%2Fshortcut%401.4.1%2Fdist%2Findex.min.js'
                */

                const name = `${name_}` || "";
                const unders = (unders_ || 0).length > 0 ? unders_ : [];
                const path = `${path_}` || "";

                if (!name || !unders || !path) continue;

                let folderLayers = unders.map(folder => {
                    return fe2(`${folder}` || "undefined")
                });

                const fileName = fe2(name);

                const vfsEntry = {
                    vPath: folderLayers.join('/') + '/' + fileName,
                    uPath: extId + ':' + path
                }

                vfsEntries.push(vfsEntry);

            }

            return vfsEntries;

        }

        async function getFolderTreeInfo() {

            const vfsSheets = [];

            const fileListResult = await getFileList();

            if (!fileListResult || traceError(fileListResult)) {
                throw responseError(fileListResult, "WebCoder_Extensions(0x3C21)");
            }

            if (fileListResult && fileListResult.length >= 1) {

                for (const { id: extId, name: extName, result } of fileListResult) {

                    let vfsEntries;

                    if (!result || traceError(result)) {
                        throw responseError(result, "WebCoder_Extensions(0x3C24)");
                    }

                    if (!result.version && result.list) result.version = 1;

                    if (result.version === 1) vfsEntries = convertToVFSEntry1(extId, extName, result);
                    else if (result.version === 2) vfsEntries = convertToVFSEntry2(extId, extName, result);
                    else {
                        console.log("Syntax Error in list response. (0001)", { id: extId, name: extName, result });
                        continue;
                    }

                    if (vfsEntries !== false) {

                        vfsSheets.push({ id: extId, name: extName, vfsEntries })
                    } else {

                        console.log("Syntax Error in list response. (0002)", { id: extId, name: extName, result, vfsEntries });
                        continue;
                    }

                }

            }

            return vfsSheets;
        }

        let _vfsSheets;
        try {
            _vfsSheets = await getFolderTreeInfo();
        } catch (e) {
            await promiseOnError.then();
            throw e;
        }

        if (!_vfsSheets) _vfsSheets = [];


        let _vfsEntries = _vfsSheets.length >= 1 ? _vfsSheets[0].vfsEntries : [];

        let _vfsEntries2 = _vfsEntries;

        const rHandlerForFileSystemDirectoryHandleV = {
            get: async (filename, fsPath, timestamp) => {

                if (!n || !filename || !fsPath) throw new DOMException('Syntax Error', 'SyntaxError');
                return await ioPipelineExec((async () => {

                    const promiseTimeout = delayPn(15000);
                    const promiseRequest = new Promise(resolve => {
                        IC.send("userscripts", {
                            action: "get",
                            path: fsPath,
                            ifNotModifiedSince: timestamp,
                            instanceId: instanceId_
                        }, resolve);
                    });
                    const res = await Promise.race([promiseTimeout, promiseRequest]);

                    if (res === undefined) {
                        throw new TimeoutError(MSG_TIMEOUT);
                    }

                    if (!res || traceError(res) || !(res.lastModified > 0) || typeof res.lastModified !== 'number') {

                        throw responseError(res, "WebCoder_Extensions(0x3F41)");

                    }

                    return new File([res.value || ""], filename, { lastModified: res.lastModified });
                }));


            }
            , set: async (filename, fsPath, n) => {


                if (!n || !filename || !fsPath) throw new DOMException('Syntax Error', 'SyntaxError');
                if (typeof filename !== "string" || typeof fsPath !== "string" || typeof n.text !== "function") {
                    throw new DOMException('Syntax Error', 'SyntaxError');
                }
                return await ioPipelineExec((async () => {

                    let codeValue = await n.text();
                    if (typeof codeValue !== "string") {
                        codeValue = undefined
                    }
                    let timestamp = n.lastModified;
                    if (typeof timestamp !== 'number') {
                        timestamp = undefined;
                    }



                    const promiseTimeout = delayPn(15000);
                    const promiseRequest = new Promise(resolve => {
                        IC.send("userscripts", {
                            action: "patch",
                            path: fsPath,
                            value: codeValue,
                            lastModified: timestamp,
                            instanceId: instanceId_
                        }, resolve);
                    });
                    const res = await Promise.race([promiseTimeout, promiseRequest]);

                    if (res === undefined) {
                        throw new TimeoutError(MSG_TIMEOUT);
                    }

                    if (!res || traceError(res)) {

                        throw responseError(res, "WebCoder_Extensions(0x3F42)");


                    }


                }));

            }
        };


        function prepareFolderTree(options) {

            let folderName = options.folderName;
            if (typeof folderName !== 'string' || !folderName) folderName = 'unused';


            const {
                vFolderRoot = new FolderEntry(folderName, false),
                vfsEntries
            } = options;



            let handler = rHandlerForFileSystemDirectoryHandleV;

            const reductionHelper = function (accum, currentVal) {
                return (accum._entries[currentVal] || (accum._entries[currentVal] = new FolderEntry(currentVal, false)));
            }


            for (const vfsEntry of vfsEntries) {

                let { vPath, uPath } = vfsEntry;
                if (typeof vPath !== 'string' || typeof uPath !== 'string') {
                    console.warn(`uPath and vPath shall be strings.`);
                    continue;
                }
                if (!/^([-a-z]{32}:)?[\w]+[-\w.\/%]*$/.test(uPath)) {
                    console.warn(`uPath "${uPath}" is currently not yet supported.`);
                    continue;
                }
                vPath = genericText(vPath, 1 | 2 | 16);
                vPath = vPath.trim();
                if (!vPath.length) continue;

                let s = vPath.split('/');

                let folderLayers = [];
                let filename = '';

                function addFolderLayer(t) {

                    if (typeof t !== 'string') return;
                    // if ( t && /^[\x7F-\uFFFF]|[\x7F-\uFFFF]$/.test(t)) {
                    //     console.warn(`The folder path "${t}" is not allowed`);
                    //     t = t.replace(/^[\x7F-\uFFFF]+|[\x7F-\uFFFF]+$/g, '');
                    // }
                    if (t) {

                        folderLayers.push(fsFolderName(t));
                    }
                }

                for (let i = 0; i < s.length; i++) {
                    if (i === s.length - 1) {

                        const si = s[i];
                        filename = visualizeFilename(si);
                        // console.log(213001, filename)
                        // let doDollar = /^[-.:\/@\w⑊∕]+$/.test(si) && !/--/.test(si);

                        const ks = filename;
                        let u0 = [ks];

                        const fs = ks.split('〜');
                        const f0 = fs[0];
                        let m;
                        m = /^\w[-.\w]*::[-.\w]+(@(\d+.){0,5}\d+)$/.exec(f0);
                        // console.log(213002, f0, m )
                        let left = 0;
                        if (m && m[0]) {
                            left = m[0].length;
                        }

                        let right = fs[fs.length - 1].length;

                        u0 = [left > 0 ? ks.slice(0, left) : '', (ks.substring(left, ks.length - right) || ''), right > 0 ? ks.slice(-right) : '']


                        // console.log(213005, u0)

                        if (u0.length > 1) {

                            for (let j = 0; j < u0.length - 1; j++) {
                                let t = u0[j];

                                if (t) t = t.replace(/^〜|〜$/g, '');

                                // if(doDollar) t=t.replace(/--/g,'〜');

                                addFolderLayer(t);

                            }

                            filename = u0[u0.length - 1];
                        }





                    } else {

                        const si = s[i];
                        // let doDollar = /^[-.:\/@\w⑊∕]+$/.test(si) && !/--/.test(si);

                        const t = visualizeWord(si)

                        addFolderLayer(t);
                    }
                }

                // vPath: Violentmonkey Scripts/New Userscript 2/script.user.js
                // uPath: 0d334a55-7003-4d2e-8625-8ea95c6df28c/source

                // console.log(213009, JSON.stringify({ filename, folderLayers }));
                if (filename && folderLayers.length >= 1) {

                    // Use the reduce function to process the entry details and create a nested folder structure.
                    let c = folderLayers.reduce(reductionHelper, vFolderRoot); // nested folder entry

                    let d = new FileWrapperWithCache(filename, uPath, handler);
                    c._entries[filename] = new FileEntry(filename, d, true);
                }



            }

            const fileSystemDirectoryHandle = new FileSystemDirectoryHandleV(vFolderRoot);

            return {
                vFolderRoot,
                vfsEntries,
                fileSystemDirectoryHandle
            }


        }



        // console.log('_vfsEntries', _vfsEntries)
        const { vFolderRoot: vFolderRoot, _e1, _f1 } = prepareFolderTree({ vfsEntries: _vfsEntries });
        // const { vFolderRoot: vFolderRoot2, _e2, _f2 } = prepareFolderTree({ vfsEntries: _vfsEntries });
        // const { vFolderRoot: vFolderRoot3, _e3, _f3 } = prepareFolderTree({ vfsEntries: _vfsEntries });
        // const { vFolderRoot: vFolderRoot4, _e4, _f4 } = prepareFolderTree({ vfsEntries: _vfsEntries });
        // const { vFolderRoot: vFolderRoot5, _e5, _f5 } = prepareFolderTree({ vfsEntries: _vfsEntries });
        _vfsEntries = null;

        virualFolderRoots = [
            new FileSystemDirectoryHandleV(getFolderEntry({ name: "WebCoder_Extensions", eventEmitter: new EventController, entries: vFolderRoot._entries })),
            // new FileSystemDirectoryHandleV(getFolderEntry({ name: "WebCoder_Extensions_2", eventEmitter: new EventController, entries: vFolderRoot2._entries })),
            // new FileSystemDirectoryHandleV(getFolderEntry({ name: "WebCoder_Extensions_3", eventEmitter: new EventController, entries: vFolderRoot3._entries })),
            // new FileSystemDirectoryHandleV(getFolderEntry({ name: "WebCoder_Extensions_4", eventEmitter: new EventController, entries: vFolderRoot4._entries })),
            // new FileSystemDirectoryHandleV(getFolderEntry({ name: "WebCoder_Extensions_5", eventEmitter: new EventController, entries: vFolderRoot5._entries }))
        ];
        virualFolderRootsPending = virualFolderRoots.slice(0);

        win.FileSystemDirectoryHandle = FileSystemDirectoryHandleV;
        win.FileSystemFileHandle = FileSystemFileHandleV;

        virualFolderRootPromise.resolve();



        console.log("WebCoder_Extensions FileSystem registration finished");

        const ADD_MODE = 2;


        const getOpenFolderButton = async () => {
            return await observablePromise(() => {
                if (!window.onerror) return; // check onerror
                const elm = ADD_MODE === 1 ? document.querySelector(".codicon-folder-opened") : null;
                let t = elm ? elm.parentNode : null;
                if (!t) {
                    const es = document.querySelectorAll(".monaco-text-button");
                    for (const e of es) {
                        const n = e ? e.textContent : null;
                        if (typeof n === "string" && n.includes("Open Folder")) {
                            t = e;
                            break;
                        }
                    }
                }
                return t;
            }).obtain();
        }

        const onReadyAsync = () => {
            return new Promise(resolve => {
                if (document.readyState != 'loading') {
                    resolve();
                } else {
                    window.addEventListener("DOMContentLoaded", resolve, false);
                }
            });
        }

        // =================================================================================


        const gDragEvent = () => {

            class FileList {

                constructor(arr) {

                    this.__arr__ = arr;
                    for (let i = 0; i < arr.length; i++) {
                        Object.defineProperty(this, i, {
                            configurable: true,
                            enumerable: true,
                            writable: false,
                            value: arr[i]
                        });
                        // this[i]=arr[i];
                    }

                }

                item(index) {
                    return this.__arr__[index];
                }

                // add(file){
                //     // add(data, type)
                //     // add(file)

                //     throw new DOMException(DOMException.NOT_SUPPORTED_ERR, "The operation is not supported");
                //     // this.__arr__.push(file);

                // }

                // clear(){
                //     this.__arr__.length=0;

                // }
                get length() {

                    return this.__arr__.length;
                }
                // remove(index){


                //     this.__arr__.splice(index, 1);

                // }
                [Symbol.iterator]() {
                    let n = 0;
                    const arr = this.__arr__;
                    return {
                        next() {
                            return { value: arr[n++], done: n >= arr.length };
                        }
                    };
                }
            }
            setStringTag(FileList, "FileList");



            const FileMapper = new WeakMap();

            class Blob {
                constructor(obj) {
                    FileMapper.set(this, obj);

                }

                get size() {
                    const obj = FileMapper.get(this);
                    return obj.size;
                }
                get type() {
                    const obj = FileMapper.get(this);
                    return obj.type;
                }

                arrayBuffer() {
                    throw new DOMException(DOMException.NOT_SUPPORTED_ERR, "This operation is not supported");

                }
                slice() {
                    throw new DOMException(DOMException.NOT_SUPPORTED_ERR, "This operation is not supported");

                }
                stream() {
                    throw new DOMException(DOMException.NOT_SUPPORTED_ERR, "This operation is not supported");

                }
                text() {
                    throw new DOMException(DOMException.NOT_SUPPORTED_ERR, "This operation is not supported");
                }

            }
            setStringTag(Blob, "Blob");

            class File extends Blob {
                constructor(obj) {
                    super(obj);
                    FileMapper.set(this, obj);

                }


                get lastModified() {

                    const obj = FileMapper.get(this);
                    return obj.lastModified;
                }
                get lastModifiedDate() {

                    const obj = FileMapper.get(this);
                    return obj.lastModifiedDate;
                }
                get name() {

                    const obj = FileMapper.get(this);
                    return obj.name;
                }

                get webkitRelativePath() {

                    const obj = FileMapper.get(this);
                    return obj.webkitRelativePath;
                }



            }
            setStringTag(File, "File");
            setEnumerable(File, ["lastModified", "lastModifiedDate", "name", "webkitRelativePath"]);



            function createFile(obj) {

                if (!obj) {
                    throw 'createFile obj is not found'
                }

                if (!obj.lastModified && obj.lastModifiedDate) {
                    obj.lastModified = +obj.lastModifiedDate || 0;
                }

                if (!(obj.lastModified > 0)) {
                    delete obj.lastModified;
                    delete obj.lastModifiedDate;
                }

                if (!obj.type) obj.type = '';
                if (!obj.webkitRelativePath) obj.webkitRelativePath = '';


                /*
                if(obj.name ==="_locales"){

                    if(nEvt) return [...nEvt.dataTransfer.files].filter(c=>c.name===obj.name)[0];
                    var f = new File(["console.log(123)"], "_locales", { type: 'text/javascript' });
                    return f;
                }else 
                if(obj.name ==="images"){
                
                    if(nEvt) return [...nEvt.dataTransfer.files].filter(c=>c.name===obj.name)[0];
                    var f = new File(["console.log(456)"], "images", { type: 'text/javascript' });
                    return f;
                }else{
                    var f = new File(["console.log(666)"], obj.name, { type: 'text/javascript' });
                    return f;

                }
                */

                return new File(obj)

            }



            class DataTransferItem {

                getAsFile() {
                    throw 'TODO';
                }
                /** @return {Promise<FileSystemFileHandle>} */
                async getAsFileSystemHandle() {
                    const entry = this;
                    const file = fileItemMapper.get(entry);
                    if (file && typeof file.name === 'string' && file.name.length > 0) {

                        const fileHandle = fileHandleMapper.get(file);
                        if (fileHandle instanceof Array) {

                            const vfsEntries = fileHandle;
                            const { vFolderRoot, _e, fileSystemDirectoryHandle } = prepareFolderTree({ vfsEntries: vfsEntries, folderName: file.name });
                            fileHandleMapper.set(file, fileSystemDirectoryHandle);
                            return fileSystemDirectoryHandle;
                        } else if (fileHandle instanceof FileSystemDirectoryHandleV) {

                            return fileHandle;

                        }
                    }


                    // return entry.getAsFileSystemHandle()
                }
                getAsString() {
                    throw 'TODO';
                }
                webkitGetAsEntry() {
                    throw 'TODO';
                }
                get kind() {
                    return 'file';
                }

                get type() {
                    return '';
                }


            }

            setStringTag(DataTransferItem, "DataTransferItem");
            setEnumerable(DataTransferItem, ["kind", "type"]);


            const DataMapper = new WeakMap();
            const fileHandleMapper = new WeakMap();

            class DataTransferItemList {

                constructor(obj) {
                    DataMapper.set(this, obj);
                    for (let i = 0; i < obj.length; i++) {
                        this[i] = obj[i];
                    }

                }

                add() {

                    throw 'TODO DataTransferItemList.add';
                }
                clear() {
                    const obj = DataMapper.get(this);
                    obj.length = 0;

                }

                get length() {

                    const obj = DataMapper.get(this);
                    return obj.length;

                }
                remove(idx) {
                    if (typeof idx === 'number') {

                        const obj = DataMapper.get(this);
                        obj.splice(idx, 1);
                        return;
                    }
                    throw 'TODO DataTransferItemList.remove';

                }

            }
            setStringTag(DataTransferItemList, "DataTransferItemList");
            setEnumerable(DataTransferItemList, ["length"]);


            class DataTransfer {
                constructor(obm) {
                    DataMapper.set(this, obm);


                    if (!obm.files744 && obm.strcutureData) {

                        const arr = obm.strcutureData.map(e => {
                            const name = e.folderName;
                            const file = createFile({
                                lastModifiedDate: randomLastModifiedDate(),
                                name: name,
                                size: 64
                            });
                            fileHandleMapper.set(file, e.folderHandler);
                            return file;
                        })

                        obm.files744 = new FileList(arr);
                        obm.strcutureData = null;
                    }


                    const files = obm.files744;
                    let items = obm.items744;

                    if (!items) {


                        if (!files || files.length === 0) {

                            if (!items) items = new DataTransferItemList([]);
                            else if (items.length > 0) items.clear();

                        } else {

                            if (!items) {
                                const items744Arr = [];
                                for (let i = 0; i < files.length; i++) {
                                    let dtItem = new DataTransferItem();
                                    items744Arr.push(dtItem);
                                    fileItemMapper.set(dtItem, files[i]);
                                }
                                items = new DataTransferItemList(items744Arr);
                            }
                        }

                        if (obm.items744 !== items) obm.items744 = items;

                    }

                    let types = obm.types744;
                    if (items) {

                        if (!types) {

                            types = items.length > 0 ? ['Files'] : [];

                        }

                    } else {

                        if (!types) {
                            types = [];
                        } else if (types.length > 0) {
                            types.length = 0;
                        }
                    }
                    if (obm.types744 !== types) obm.types744 = types;


                    this.dropEffect = 'none';
                    this.effectAllowed = 'all';
                }

                get items() {

                    const obm = DataMapper.get(this);

                    return obm.items744;
                }

                get types() {


                    const obm = DataMapper.get(this);

                    return obm.types744;


                }

                get files() {
                    // if(nEvt ){

                    //     const oFiles = nEvt.dataTransfer.files
                    //     return oFiles;
                    // }


                    const obm = DataMapper.get(this);


                    return obm.files744;

                }
                getData(format) {

                    // if(format === 'CodeEditors'){

                    //     console.log(370, format, nEvt?.dataTransfer,  nEvt?.dataTransfer?.getData(format) )


                    // }else if(format == 'ResourceURLs'){

                    //     console.log(370, format, nEvt?.dataTransfer,  nEvt?.dataTransfer?.getData(format))

                    // }else if(format == 'CodeFiles'){
                    //     console.log(370, format, nEvt?.dataTransfer,  nEvt?.dataTransfer?.getData(format))


                    // }else if(format == 'Terminals'){

                    //     console.log(370, format, nEvt?.dataTransfer,  nEvt?.dataTransfer?.getData(format))

                    // }
                    return '';

                }
            }

            setStringTag(DataTransfer, "DataTransfer");
            setEnumerable(DataTransfer, ['items', 'types', 'files'])


            const fileItemMapper = new WeakMap(); // cannot set to data entry, set to proxy instead

            function getDateBeforeMiliSeconds(ms) {
                if (typeof ms !== 'number' || ms < 0) {
                    throw new Error('Invalid input: t must be a non-negative number');
                }
                const newDate = new Date(Date.now() - ms);

                return newDate;
            }

            const randomLastModifiedDate = () => getDateBeforeMiliSeconds(Math.round((Math.random() * 10 + 10) * 1000));


            const createDataTransfer = (_obm) => {

                const t = _obm;



                const dt = new DataTransfer(t);

                DataMapper.set(dt, t)


                return dt;

            }


            return { createDataTransfer }

        }
        // =================================================================================


        function cssPrepare() {

            const cssStyle = document.createElement('style');
            cssStyle.id = 'wshyjcwj';
            cssStyle.textContent = cssTextFn();
            document.head.appendChild(cssStyle);

            const handleDOMAppearFN = new Map();
            handleDOMAppearFN.set('onAddFolderButtonInDialogAppeared', (evt) => {
                if (promiseAddFolderBtn) {
                    promiseAddFolderBtn.resolve(evt.target);
                    promiseAddFolderBtn = null;
                }
            });

            handleDOMAppearFN.set('onYesITrustButtonInDialogAppeared', (evt) => {
                if (promiseYestITrustBtn) {
                    promiseYestITrustBtn.resolve(evt.target);
                    promiseYestITrustBtn = null;
                }
            })



            handleDOMAppearFN.set('onYesButtonInDialogAppeared', (evt) => {
                if (promiseYestITrustBtn) {
                    const target = evt.target;
                    const dialogBox = target.closest('.monaco-dialog-box');
                    if (!dialogBox) return;
                    let textContent = dialogBox.textContent;
                    if (textContent.length > 12) {
                        textContent = genericText(textContent, 1 | 2 | 8);
                        if (textContent.replace(/\s+/g, ' ').includes('Do you trust')) {
                            promiseYestITrustBtn.resolve(target);
                            promiseYestITrustBtn = null;
                        }
                    }
                }
            })

            const capturePassive = { capture: true, passive: true };

            document.addEventListener('animationstart', (evt) => {
                const animationName = evt.animationName;
                if (!animationName) return;
                let func = handleDOMAppearFN.get(animationName);
                if (func) func(evt);
            }, capturePassive)

            document.documentElement.classList.add('webcoder-for-extensions');

        }

        const isNoDialog = () => !document.querySelector('.monaco-dialog-modal-block.dimmed .monaco-dialog-box')
        async function noDialogAsync() {
            await observablePromise(() => isNoDialog()).obtain();
        }

        await onReadyAsync(); // waiting for page loaded


        FileSystemDirectoryHandleV.onCreate9188 = function () {
            // clear the promises for dialog actions when system folder is created
            if (promiseAddFolderBtn || promiseYestITrustBtn) {
                if (!promiseFileCreateWithDOMModification) {
                    promiseFileCreateWithDOMModificationCounter++;
                    if (promiseFileCreateWithDOMModificationCounter > 1e9) promiseFileCreateWithDOMModificationCounter = 9;
                    let t = promiseFileCreateWithDOMModificationCounter;
                    promiseFileCreateWithDOMModification = new PromiseExternal();
                    promiseFileCreateWithDOMModification.then(() => {
                        if (t !== promiseFileCreateWithDOMModificationCounter) return;
                        setTimeout_(() => {
                            if (t !== promiseFileCreateWithDOMModificationCounter) return;
                            if (isNoDialog()) {
                                promiseAddFolderBtn = null;
                                promiseYestITrustBtn = null;
                            }
                        }, 400);
                    });
                }
            }
        }

        await noDialogAsync();

        // await new Promise(resolve => requestAnimationFrame(resolve)); // only on foreground

        let openBtn;
        openBtn = await getOpenFolderButton(); // waiting for DOM

        await Promise.race([loaderReadyPromise, delayPn(800)]); // waiting for js scripting
        await delayPn(1); // allow js scripting completion (like setImmediate)

        await noDialogAsync();

        openBtn = await getOpenFolderButton();  // find the true openBtn
        // await new Promise(resolve => requestAnimationFrame(resolve)); // only on foreground

        cssPrepare();

        const vFileDrag = gDragEvent();

        const dummyDragEvent = new DragEvent("dragover");


        const baseDragEventObjectFn = (obj) => ({

            ...obj,

            get sourceCapabilities() {
                return { firesTouchEvents: false };
            },

            get view() {
                return window;
            },

            preventDefault() {
                this.defaultPrevented = false;
                this.returnValue = false;
            },

            stopImmediatePropagation() {

            },
            stopPropagation() {

            },

            initEvent() {

            },

            composedPath() {
            },

            // UIEvent
            initUIEvent() {
            },

            // MouseEvent
            initMouseEvent() {
            },

            getModifierState() {
            },

        });

        const dummyDragEventProxyHandler = {
            get(target, prop, receiver) {
                if (target.hasOwnProperty(prop)) {
                    return target[prop];
                } else {
                    return dummyDragEvent[prop];
                }
            },
            set(target, prop, value, receiver) {
                if (target.hasOwnProperty(prop)) {
                    target[prop] = value;
                }
                return true;
            },
            getPrototypeOf(target) {
                return DragEvent.prototype
            },
            has(target, key) {
                return key in dummyDragEvent
            },
            ownKeys(target) {
                return Reflect.ownKeys(dummyDragEvent);
            }

        };

        function fsFolderName(folderName) {
            return genericText(folderName, 1 | 2 | 16).trim().replace(/\s+/g, ' ');
            // return genericText(folderName, 1 | 2 | 8).trim().replace(/\s+/g, '_');
        }

        async function triggerAddFolders(eStore) {

            await noDialogAsync();

            const eTarget = eStore.drop.eventTarget;
            if (!eTarget) return;
            const subTarget = eTarget.querySelector('.monaco-scrollable-element') || eTarget;
            const hEventTarget = eStore.drop.eventTarget;

            const obm = {
                dom: subTarget
            };
            const sheets = _vfsSheets || [];

            obm.strcutureData = sheets.map(sheet => {


                const extId = sheet.id;

                const extName = sheet.name;

                return {
                    folderName: fsFolderName(extName),
                    folderHandler: sheet.vfsEntries,
                }


            }).concat([
                {
                    folderName: fsFolderName("Sample Folder 1 <DEMO>"),
                    folderHandler: _vfsEntries2.length > 2 ? _vfsEntries2.slice(0, 2) : [],
                },
                {
                    folderName: fsFolderName("Sample Folder 2 <DEMO>"),
                    folderHandler: _vfsEntries2.length > 3 ? [_vfsEntries2[3]] : [],
                },
                {
                    folderName: fsFolderName("Sample Folder 3 <DEMO>"),
                    folderHandler: _vfsEntries2.length > 5 ? _vfsEntries2.slice(-2) : [],
                },
            ]);
            obm.dataTransfer399 = vFileDrag.createDataTransfer(obm);

            const evtParams = {

                [attrLex]: 1,
                isTrusted: true,
                dataTransfer: obm.dataTransfer399 || null,

                pageY: 0,
                ctrlKey: false,
                altKey: false,

                detail: 0,
                eventPhase: 3,

                bubbles: true,
                cancelBubble: false,
                cancelable: true,
                composed: true,
                currentTarget: subTarget,
                defaultPrevented: false,
                fromElement: null,
                srcElement: subTarget,
                target: subTarget, // ***
                toElement: subTarget,
            }

            const evtDragover = new Proxy(baseDragEventObjectFn({

                type: "dragover",

                ...evtParams,
                timeStamp: Math.floor(performance.now()),

            }), dummyDragEventProxyHandler);
            eStore.dragover.eventHandler.call(hEventTarget, evtDragover);

            await delayPn(1);
            await noDialogAsync();


            const evtDrop = new Proxy(baseDragEventObjectFn({
                [attrLex]: 1,
                type: "drop",
                isTrusted: true,
                dataTransfer: obm.dataTransfer399 || null,

                ...evtParams,
                timeStamp: Math.floor(performance.now()),

            }), dummyDragEventProxyHandler);


            promiseFileCreateWithDOMModification = null;
            promiseFileCreateWithDOMModificationCounter++;
            if (promiseFileCreateWithDOMModificationCounter > 1e9) promiseFileCreateWithDOMModificationCounter = 9;
            promiseAddFolderBtn = new PromiseExternal();

            promiseYestITrustBtn = new PromiseExternal();

            eStore.drop.eventHandler.call(hEventTarget, evtDrop);

            showed = true;

            promiseAddFolderBtn.then((btn) => {
                btn.click();
            });

            promiseYestITrustBtn.then((btn) => {
                btn.click();
            });

        }

        if (!openBtn) return;
        async function clickOpen() {

            await noDialogAsync();
            gclick = openBtn;
            promiseFileCreateWithDOMModification = null;
            promiseFileCreateWithDOMModificationCounter++;
            if (promiseFileCreateWithDOMModificationCounter > 1e9) promiseFileCreateWithDOMModificationCounter = 9;
            promiseYestITrustBtn = new PromiseExternal();
            if (document.querySelector(".codicon-folder-opened, .monaco-text-button")) openBtn.click();
            promiseYestITrustBtn.then((btn) => {
                btn.click();
            });
        }

        if (ADD_MODE === 2) {

            // await delayPn(1000);
            openBtn = await getOpenFolderButton();

            // console.log(openBtn, openBtn.closest(`[${attrLex}]`))

            let eventTargetW = openBtn.closest(`[${attrLex}]`);
            if (!eventTargetW) return;

            const al = +(eventTargetW.getAttribute(`${attrLex}`) || 0);
            if (!al) return;
            const eStore = handlerStores[al - 1];

            console.log('handlerStores', handlerStores)


            if (eStore.drop && eStore.dragover && eStore.drop.eventTarget === eStore.dragover.eventTarget) {

            } else {
                return;
            }


            // await clickOpen();

            // await delayPn(3000);

            await triggerAddFolders(eStore);

        } else {




            await clickOpen();

        }



        console.log("WebCoder_Extensions: FileSystem automatically opened");


        !(() => { // for MV3

            let iframe_ = null;

            let iframeURLp_ = false;
            const removeIframeAfterDisconnected = false;
            const detachMsgListenerAfterDisconnected = false;

            let defaultManifest_ = ''; // https://vscode.dev/static/stable/code.webmanifest
            const getDummyIframeURL = () => {
                const element = document.querySelector('link[rel="manifest"][href]');
                const url = (element ? element.href : '') || defaultManifest_ || '';
                if (!defaultManifest_ && url) defaultManifest_ = url;
                if (!url) return null;
                let m = null;
                try {
                    m = new URL(url);
                } catch (e) {
                    return null;
                }
                return {
                    url,
                    isSameOrigin: m.origin === location.origin
                }
            }


            const attachIframeDOM = (iu) => {

                // Attach an iframe on DOM Page to make the Service Worker Alive.
                const iframe = document.createElement('iframe');
                iframe.id = 'pshfz4uv';
                // mainfest is a static text/plain file that can be accessed in iframe without error

                if (!iu) {
                    console.log('WebCoder_Extensions: Unable to setup iframe url');
                    return;
                }
                makeURL(iframe, iurl(iu.url));
                __urlChangedAlready = true;
                iframe.sandbox = iu.isSameOrigin ? 'allow-scripts' : 'allow-same-origin allow-scripts'; // for window.stop() being executed in the loading of the page
                document.body.appendChild(iframe);
                console.log("WebCoder_Extensions: Iframe Injected");

                return iframe;
            };

            const iurl = (url) => {
                const search = `?userjs_keepalive=${generateRandomTimedID()}`;
                return `${url}${search}`;
            };



            const makeURL = (iframe, url) => {
                if (iframe.p5499Tpc) {

                    let location = null;
                    try {
                        location = iframe.contentWindow.location;
                    } catch (e) { }
                    if (location && typeof location.replace === 'function') {
                        // location.replace would not affect browser history in the top frame
                        location.replace(url);
                    } else {
                        // fallback
                        iframe.src = url;
                    }

                } else {
                    iframe.p5499Tpc = 1;
                    iframe.src = url;
                }
                console.log('url set', url)
            }

            // const aliveRequestInterval = 3400; 
            // const aliveRequestInterval = 8200;

            const aliveRequestInterval = 13400;

            let __sendNextRequest = false;
            let __cid;
            let __tryReconnectedRequest;
            let __lastExecution;
            let __receiveMessage = null;


            const msgHandler = (evt) => {
                if (!__receiveMessage) return;

                const msg = evt.data;

                if (msg && msg.userjs_is_alive_tmn8f1qt) {
                    __sendNextRequest = true;
                }
                if (msg && msg.tryReconntionAfterInactive_y3u23egn && !__tryReconnectedRequest) {
                    __tryReconnectedRequest = true;
                    // make a faster request;
                    __cid && clearInterval(__cid);
                    __cid = false;
                    __lastExecution = 0;
                    setTimeout_(loopFunc, 1);
                    // note: sendNextRequest is true (set before) and not yet consumed in func
                }

            };

            const changeURL = () => {
                const iframe = iframe_;
                const iframeURLq = getDummyIframeURL();
                if (!iframeURLq) {
                    console.log('WebCoder_Extensions: Unable to update iframe url');
                    return;
                }
                if (iframeURLp_.url !== iframeURLq.url || iframeURLp_.isSameOrigin !== iframeURLq.isSameOrigin) {
                    return;
                }
                const url = iurl(iframeURLq.url);

                makeURL(iframe, url);
            }


            const loopFunc = () => {
                // note: this function might work much longer than the expected duration due to timer throttling
                // e.g. 3.4s -> 4s -> 17s
                const iframe = iframe_;
                const now = Date.now();
                if (__cid === false) {
                    __cid = setInterval(loopFunc, aliveRequestInterval);
                    console.log('WebCoder_Extensions: tryReconntionAfterInactive request recevied from content.js');
                    __sendNextRequest = false;
                } else {
                    if (!__cid) __cid = setInterval(loopFunc, aliveRequestInterval);
                    if (now - __lastExecution < 80) return; // avoid duplicated calls
                }
                __lastExecution = now;
                if (!__sendNextRequest) {
                    console.log('WebCoder_Extensions: The page is disconnected from the service worker.');
                    __cid && clearInterval(__cid);
                    __cid = 0;
                    if (removeIframeAfterDisconnected) {
                        try {
                            if (iframe.isConnected === true) iframe.remove();
                        } catch (e) { }
                    }
                    if (detachMsgListenerAfterDisconnected) {
                        try {
                            window.removeEventListenerEventListener('message', msgHandler, false);
                        } catch (e) { }
                        __receiveMessage = null;
                    } else {
                        __receiveMessage = false;

                    }

                    IC.send("userscripts", { action: "try-reconnect", instanceId: instanceId_ }, function (msg) {

                        if (msg && msg.error && msg.error.code === 0x6C07) {
                            console.log('WebCoder_Extensions: The page has to be reloaded due to the unloaded extension.'); // e.g. manual reload
                        } else if (msg && msg.reconnectedInBackground_sz44sx5n && msg.reconnectedInContent_sz44sx5n) {


                            console.log('WebCoder_Extensions: The page is now reconnected to the extension.');
                            keepAlivePageJS();
                            // console.log(1999,msg)


                            // tryReconnectedRequest = false

                        } else if (msg && msg.reconnectedInContent_sz44sx5n === false) {
                            console.log('WebCoder_Extensions: The extension was terminated. Please reload the page.');

                        }

                    });
                    return;
                }
                __sendNextRequest = false;

                if (!__urlChangedAlready) changeURL();
                __urlChangedAlready = false;

                // if (!__cid) __cid = setInterval(loopFunc, aliveRequestInterval);

                // iframe.src = generateBlankPageBlobURL()+`?${Date.now()}`; // wake up webworker
            };

            let __urlChangedAlready = false;
            const keepAlivePageJS = () => {

                // __sendNextRequest = true;

                __cid = 0;
                __tryReconnectedRequest = false;
                __lastExecution = 0;

                if (__receiveMessage === null) {
                    __receiveMessage = true;
                    window.addEventListener('message', msgHandler, false);
                } else {
                    __receiveMessage = true;
                }


                __sendNextRequest = false;

                if (iframeURLp_ === false) iframeURLp_ = getDummyIframeURL();
                const iframe = iframe_ || (iframe_ = attachIframeDOM(iframeURLp_));
                if (iframe.isConnected === false) document.body.appendChild(iframe);

                if (!__urlChangedAlready) changeURL();
                __urlChangedAlready = false;

                // works when the editor is in foreground.
                __cid = setInterval(loopFunc, aliveRequestInterval);

            }
            keepAlivePageJS();

        })();


    })();
})();
