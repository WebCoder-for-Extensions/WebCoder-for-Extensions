((context) => {
    "use strict";
    console.log('content.js');
    const ncw = !window.content_world;
    const { chrome } = context;
    const hnd_uuid = 'nuEcr';
    const hnd_toPageJS = "2P";
    const hnd_toContentJS = "2C";
    const config = {
        sendPrefix: hnd_toPageJS,
        listenPrefix: hnd_toContentJS
    };
    const IC = (() => {
        const {
            sendPrefix: spSend,
            listenPrefix: spListen
        } = config;
        let rListener = null, rHndId, rootElement, ix = 1;
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
            if ("bridge.onpurge" == tag) {
                if (rootElement !== window.document.documentElement) IC.refresh();
            } else if ("unlock" == tag) {
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
            } else if (rListener) {
                const responseFn = cbId ? msg => {
                    dispatchMyEvent(`${spSend}_${rHndId}`, {
                        m: "message.response",
                        a: msg,
                        r: cbId
                    });
                } : () => { };
                rListener({
                    method: tag,
                    args: data
                }, responseFn)
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
                    }));
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
                })));
            },
            refresh: () => {
                const e = rHndId;
                if (e) {
                    IC.cleanup();
                    IC.init(e);
                }
            },
            // switchId: e => {
            //     r && IC.cleanup();
            //     f(e);
            // },

            send: (t, n, r) => {

                // t string
                // n object
                // r fn
                // s void 0

                // t string

                if (typeof t !== 'string') return;

                r = typeof r === 'function' ? r : undefined;


                if (ncw) {
                    p();
                }

                // Define a function to dispatch an event
                const u = () => {
                    const eventPayload = {
                        m: t,
                        a: n,
                        r: r ? convToCallbackId(r) : null
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
            // sendToId: (e, n, o) => {
            //     dispatchMyEvent(`${spSend}_${e}`, {
            //         m: n,
            //         a: o,
            //         r: null
            //     })
            // },
            setMessageListener: fn => {
                rListener = fn
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
    if (typeof AbortSignal === 'undefined') {
        console.error("Your browser is not supported.")
        return;
    }
    IC.init(hnd_uuid);
    const runtimeExecutable = () => {
        try {
            return !!(chrome.runtime?.id);
        } catch (e) {
            try {
                return !!((chrome.runtime || 0).id);
            } catch (e) {
                return false;
            }
        }
    }

    let doNotSendMessage = false;

    const setupPortToBackround = () => {

        if (!(chrome.runtime?.id)) return null;

        const port = chrome.runtime.connect({
            name: 'self-channel'
        });

        port.onMessage.addListener((msg, port) => {
            const lastError = chrome.runtime.lastError;
            if (lastError) (lastError.message).valueOf();

        });

        // setInterval(() => {
        //     if (runtimeExecutable() && !doNotSendMessage) {


        //         port.postMessage({

        //             requestActive: true
        //         });

        //     }
        // }, 3000)


        port.onDisconnect.addListener(port => {
            const lastError = chrome.runtime.lastError;
            if (lastError) (lastError.message).valueOf();
            if (port.disconnected72) return;
            doNotSendMessage = true;
            port.disconnected72 = true;
            console.log('WebCoder_Extensions: Lost Connection from extension background.', 'doNotSendMessage', doNotSendMessage);
            window.postMessage({
                tryReconntionAfterInactive_y3u23egn: true
            }, "*");
        });

        setTimeout(() => {
            if (port.disconnected72) return;
            port.postMessage({
                dummyMessage: true
            });
        }, 800);

        console.log('WebCoder_Extensions: port connected (sent by content.js)')

        return port;

    };

    let port = setupPortToBackround();

    // chrome.runtime.sendMessage({
    //     requestActive: true
    // }, (res)=>{
    //     if(chrome.runtime.lastError) chrome.runtime.lastError.valueOf();
    //     return true;
    // })

    IC.setMessageListener(((evtDetail, handlerFn) => {
        let tmpDoNotSendMessage = doNotSendMessage;
        if (evtDetail.method === 'userscripts' && evtDetail?.args?.action === 'try-reconnect') {
            if (runtimeExecutable()) {
                tmpDoNotSendMessage = false;
                console.log('WebCoder_Extensions: reset doNotSendMessage')
            }
        }
        if (runtimeExecutable() && !tmpDoNotSendMessage) {

            chrome.runtime.sendMessage({
                ...evtDetail,
                method: "userscripts"
            }, (msg => {
                const lastError = chrome.runtime.lastError;
                if (lastError && runtimeExecutable()) console.warn(lastError.message);
                if (msg && msg.reconnectedInBackground_sz44sx5n) {
                    try {
                        port.disconnect();
                    } finally {
                        port.disconnected72 = true;
                    }
                    setTimeout(() => {
                        // avoid conflict with port.onDisconnect

                        port = setupPortToBackround();
                        if (port) {
                            msg.reconnectedInContent_sz44sx5n = true;
                            doNotSendMessage = false;
                            console.log('WebCoder_Extensions: Extension Communication in content.js');
                        } else {

                            msg.reconnectedInContent_sz44sx5n = false;
                        }

                        handlerFn(msg);
                    }, 30);
                } else {

                    handlerFn(msg);
                }
            }));

        } else {

            handlerFn({
                error: {
                    message: "The background page of WebCoder_Extensions was unloaded.",
                    code: 0x6C07
                }
            });

        }
    }));
})({ chrome });
