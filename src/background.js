(async (context) => {
    "use strict";
    const _self_ = self;
    _self_.oninstall = () => _self_.skipWaiting();
    const { chrome } = context;
    if (typeof AbortSignal === 'undefined') {
        console.error("Your browser is not supported.")
        return;
    }
    const myExtId = chrome.runtime?.id;
    if (!myExtId) {
        console.error("The extension id is undefined.")
        return;
    }
    const isDev = await new Promise(resolve => {
        chrome.management.getSelf(function (data) {
            resolve(data.installType === "development");
        });
    });
    function isUserScriptManager(e) {
        if (!e.hostPermissions.includes('<all_urls>')) return false;
        const arr = [
            // 'clipboardWrite', 
            // 'contextMenus', 
            // 'cookies', 
            // 'notifications', 
            'storage', 'tabs',
            // 'unlimitedStorage', 
            'webRequest', 'webRequestBlocking'
        ];
        for (const a of arr) {
            if (!e.permissions.includes(a)) return false;
        }
        return true;
    }

    let connectedCount = 0;
    let cidDisconnectAll = 0;
    let listOfExtensions_ = null;
    let userscriptMgrsStatus_ = '';
    const ignoreExtensionIds = new Set(); // those extensions are not communicable
    const getUserscriptMgrsStatus = (listOfExtensions) => {
        let r = ""
        for (const k in listOfExtensions) {
            const d = listOfExtensions[k];
            if (d && d.id === k) {
                r += `|${k}:${d.enabled ? 1 : 0}|`
            }
        }
        return r;
    }
    (function () {
        let manifest = chrome.runtime.getManifest();
        console.log("WebExtension:", `${manifest.name} [MV${manifest.manifest_version}] (${manifest.version}); ${isDev ? "Dev" : "Prod"}`);
    })();

    /**
     * 
     * 
     * // messageId: for communication control
     * // instanceId: for each editor page
     * // connectionId: for each background connection
     * // access_token: for userscript manager to check whether the external request can be accepted
     * 
     * // file path characters:
     * // "," ":" "*" "?" (") (') (`) "<" ">" "|" "~" are not allowed
     * // regular spaces [\xA0\u2000-\u200A\u202F\u205F\u3000] shall be converted to \x20
     * // zero width spaces [\u200B-\u200D\u2060\uFEFF] shall be removed
     * // special space chars '\u180E\u2800\u3164' shall be removed or converted to \x20
     * // chars '\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F' shall be encoded or not used
     * 
     * 
     * request
     * 
     * method: string = "userscripts"
     * action: string = "options"
     * messageId: string
     * connectionId: string
     * instanceId: string
     * activeUrls: Array<string> = [targetURL]
     * 
     * response
     * 
     * messageId: string
     * allow: Array<string> = ["options", "list", "get", "patch"]
     * access_token: string (optional)
     * 
     * 
     * 
     * 
     * 
     * 
     * request
     * 
     * method: string = "userscripts"
     * action: string = "list"
     * messageId: string
     * connectionId: string
     * instanceId: string
     * access_token: string
     * 
     * response
     * 
     * messageId: string
     * version: 1
     * list: Array<ScriptInfo>
     * 
     * ScriptInfo: Object
     * namespace: string
     * name: string
     * path: string                 // code; 0d334a55-7003-4d2e-8625-8ea95c6df28c/source
     * requires: Array<string>      // external scripts; 0d334a55-7003-4d2e-8625-8ea95c6df28c/external/https%3A%2F%2Fcdnjs.cloudflare.com%2Fajax%2Flibs%2Fjquery%2F3.7.1%2Fjquery.min.js
     * storage: string | undefined  // stored GM settings; 0d334a55-7003-4d2e-8625-8ea95c6df28c/source
     * 
     * 
     * 
     * 
     * 
     * 
     * request
     * 
     * method: string = "userscripts"
     * action: string = "list"
     * messageId: string
     * connectionId: string
     * instanceId: string
     * access_token: string
     * 
     * response
     * 
     * messageId: string
     * version: 2
     * files: Array<FileInfo>
     * 
     * FileInfo: Object
     * name: string
     * unders: Array<string>         // ["https://github.com/iFelix18","Greasy Fork++"]
     * path: string                 // code; 0d334a55-7003-4d2e-8625-8ea95c6df28c/source
     * 
     * 
     * 
     * 
     * 
     * request
     * 
     * method: string = "userscripts"
     * action: string = "get"
     * path: string                 // path for file of any type
     * ifNotModifiedSince: number   // to ensure the file is not modified by outside
     * messageId: string
     * connectionId: string
     * instanceId: string
     * access_token: string
     * 
     * response
     * 
     * messageId: string
     * value: string                // file content recevied to the editor
     * lastModified: number         // for file control
     * 
     * 
     * 
     * 
     * request
     * 
     * method: string = "userscripts"
     * action: string = "patch"
     * path: string                 // path for file of any type
     * value: code                  // file content sent to external for updating
     * lastModified: number         // to ensure the file is not modified by outside
     * messageId: string
     * connectionId: string
     * instanceId: string
     * access_token: string
     * 
     * response
     * 
     * messageId: string
     * 
     * 
     * 


     */

    const delayPn = delay => new Promise((fn => setTimeout(fn, delay)));

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

    const { devUtils } = (() => {

        let debugLevel = 0;

        const updateLoggingMethods = () => {
            const debugMethods = ["debug"];
            const logMethods = ["log"];
            const warnInfoMethods = ["warn", "info"];
            const errorMethods = ["error"];
            const allMethods = [...debugMethods, ...logMethods, ...warnInfoMethods, ...errorMethods];

            const activeMethods = [];
            if (debugLevel >= 80) activeMethods.push(...debugMethods);
            if (debugLevel >= 60) activeMethods.push(...logMethods);
            if (debugLevel >= 30) activeMethods.push(...warnInfoMethods);
            activeMethods.push(...errorMethods);

            allMethods.forEach(method => {
                devUtils[method] = activeMethods.includes(method) ? console[method].bind(console) : () => { };
            });
        };
        const devUtils = {
            set: e => {
                debugLevel = e;
                updateLoggingMethods();
            },
            get: () => debugLevel,
            debug: () => { }
            ,
            log: () => { }
            ,
            warn: () => { }
            ,
            info: () => { }
            ,
        };
        updateLoggingMethods();

        return { devUtils }

    })();


    const logLevelDev = 100;
    const logLevelRelease = 0;
    const connectionGateways = new Map();
    const access_tokens = {};
    const settingLogLevel = isDev ? logLevelDev : logLevelRelease;
    const targetURL = "https://vscode.dev/?connectTo=userjs";

    const createPipeline = () => {
        let pipelineMutex = Promise.resolve();
        const pipelineExecution = fn => {
            return new Promise((resolve, reject) => {
                pipelineMutex = pipelineMutex.then(async () => {
                    let res;
                    try {
                        res = await fn();
                    } catch (e) {
                        console.log("WebCoder_Extensions(0x8A01)", e);
                        reject(e);
                    }
                    resolve(res);
                }).catch(console.warn);
            });
        };
        return pipelineExecution;
    }
    const extInfoPipelineExecution = createPipeline();
    const commPipelineExec = createPipeline();
    const listingPipelineExec = createPipeline();
    const getListOfExtensions = () => new Promise(resolve => {
        chrome.management.getAll(result => {
            const mResult = {};
            for (const e of result) {
                if (e.enabled === true && e.isApp === false && e.type === 'extension' && typeof (e.id || 0) === 'string') {
                    if (e.id !== myExtId && isUserScriptManager(e)) {
                        mResult[e.id] = e;
                    }
                }
            }
            resolve(mResult);
        });
    });
    const closeAllGateways = (toClear) => {
        if (connectionGateways.size > 0) {
            connectionGateways.forEach(gateway => {
                console.log('disconnecting', gateway)
                if (gateway && typeof gateway.disconnect === 'function') {

                    // gateway.onDisconnect.addListener(()=>{
                    //     console.log(1233)
                    // })
                    try {
                        // for portDisconnection, this is usually no effect.
                        // for flushListOfUserScriptMgrs, it is to force to close all connections and request new connections.
                        gateway.disconnect();
                    } finally {
                        gateway.disconnected79 = true; // onDisconnect might not work
                    }
                }
            });
            toClear && connectionGateways.clear();
        }
    }
    const flushListOfUserScriptMgrs = async (newList = null, newListState = null) => {
        if (listOfExtensions_) return;
        closeAllGateways(1);

        // inquiry when the user wants to use the editor, instead of at the beginning
        const listOfExtensions = newList || (await getListOfExtensions());
        listOfExtensions_ = listOfExtensions;
        userscriptMgrsStatus_ = newListState || getUserscriptMgrsStatus(listOfExtensions);
        const listOfExtensionIds = Object.keys(listOfExtensions);
        console.log('available userscript managers', listOfExtensionIds, listOfExtensions);
    }




    const queryForWebPage = "userjs";
    const queryForIframe = "userjs_keepalive";

    async function flushListOfUserScriptMgrsAtNavigationIfNeeded() {
        let canSkipResetConnection = false;
        let newList = null;
        let newListState = null;
        if (listOfExtensions_) {
            canSkipResetConnection = true;

            if (connectionGateways.size > 0) {
                connectionGateways.forEach(gateway => {
                    if (gateway && gateway.disconnected79) canSkipResetConnection = false;
                });
                if (canSkipResetConnection === false) console.log("Reset connection due to disconnected ports");
            }

            if (canSkipResetConnection) {
                const oldListState = userscriptMgrsStatus_; // can be empty (first navigation)
                newList = await getListOfExtensions();
                newListState = getUserscriptMgrsStatus(newList);
                if (newListState !== oldListState) {
                    canSkipResetConnection = false;
                }
                if (canSkipResetConnection === false) console.log("Reset connection due to the change of UserScript managers");
            }

        }
        if (canSkipResetConnection === false) {
            listOfExtensions_ = null; // fetch the list of extensions after each navigation
            await flushListOfUserScriptMgrs(newList, newListState);
        }

    }

    chrome.webNavigation.onCommitted.addListener(details => {
        const lastError = chrome.runtime.lastError;
        if (lastError && runtimeExecutable()) lastError.valueOf();
        if (details.error || details.frameId > 0 || !(details.tabId > 0) || !details.url || details.parentFrameId >= 0) return;
        const { url: url, tabId: tabId } = details;
        // console.log(311, url, tabId);
        if (!url.startsWith(targetURL)) return;
        cidDisconnectAll && (clearTimeout(cidDisconnectAll), (cidDisconnectAll = 0));
        extInfoPipelineExecution(flushListOfUserScriptMgrsAtNavigationIfNeeded);

        chrome.scripting.executeScript({
            files: ["content.js"],
            target: {
                tabId: tabId,
                frameIds: [0]
            },
            injectImmediately: true,
            world: "ISOLATED"
        });
        chrome.scripting.executeScript({
            files: ["page.js"],
            target: {
                tabId: tabId,
                frameIds: [0]
            },
            injectImmediately: true,
            world: "MAIN"
        });
    }, {
        url: [
            { hostEquals: 'vscode.dev',  "schemes": ["https"] }

        ]

    });

    const monitorIframeActivity = () => { // for MV3
        // note: assume url for iframe manifest is https://vscode.dev/static/xxxxxxxx?${queryForIframe}=yyyyyyyy

        chrome.webNavigation.onBeforeNavigate.addListener((details) => {
            const lastError = chrome.runtime.lastError;
            if (lastError) lastError.valueOf();
            if (details.error || details.frameId === 0 || !(details.tabId > 0) || !details.url || details.parentFrameId < 0) return;
            if (details.frameType === "sub_frame" && details.url.startsWith('https://vscode.dev/static/') && details.url.includes(`?${queryForIframe}=`)) {

                if (lastError) console.log('onBeforeNavigate', lastError.message);

                if (chrome.runtime?.id && connectedCount > 0) {
                    chrome.scripting.executeScript({
                        files: ["iframe.js"],
                        target: {
                            tabId: details.tabId,
                            frameIds: [details.frameId]
                        },

                        injectImmediately: true,
                        // inject to page context to avoid creation of an isolated context solely used by this extension
                        world: "MAIN"
                    });

                } else {
                    console.log('This service worker was killed. Please reload the web page.');
                }

            }
        }, {
            url: [
                { hostEquals: 'vscode.dev', queryContains: `${queryForIframe}`, "schemes": ["https"] }

            ]

        });


    }

    monitorIframeActivity();

    function ignoreError(r) {
        return r.valueOf();
    }
    function connectOnce(target, fn) {
        if (typeof fn !== 'function') {
            console.warn('connectOnce: fn is not a function');
            return;
        }
        let listener = (...args) => {
            const lastError = chrome.runtime.lastError;
            const r = (fn ? fn(...args) : null);
            if (lastError || r === false) {
                try {
                    listener && target.removeListener && target.removeListener(listener);
                } finally {
                    listener = null;
                    fn = null;
                }
            }
        }
        target.addListener(listener);
    }
    const onMessageAsync = async (msg0, sendResponse0) => {

        try {

            await commPipelineExec(async () => {

                const action = ((msg0 || 0).args || 0).action;
                const instanceId = ((msg0 || 0).args || 0).instanceId;

                // console.log(122, action, instanceId, msg0)

                const activeUrls = [targetURL];

                function generateRandomID() {
                    return Math.floor(Math.random() * 982451653 + 982451653).toString(36);
                }
                function generateRandomTimedID() {
                    return `${generateRandomID()}.${Date.now().toString(36)}`;
                }

                function createExtensionGateway(extensionId) {
                    if (connectionGateways.get(extensionId) !== void 0) return;
                    connectionGateways.set(extensionId, false); // just in case; can be omitted
                    if (!chrome.runtime?.id) return; // avoid service worker bug
                    if (ignoreExtensionIds.has(extensionId)) return; // not communicable (tried before)
                    return new Promise((resolve => {
                        try {
                            const timeBegin = Date.now();
                            let extGateway = chrome.runtime.connect(extensionId, {
                                name: 'webcoder-for-extension-channel'
                            });
                            extGateway.extensionId79 = extensionId;
                            const sMessageId = generateRandomTimedID();
                            const connectionId = sMessageId;
                            function rejection() {
                                if (extGateway) {
                                    try {
                                        !extGateway.disconnected79 && extGateway.disconnect();
                                    } finally {
                                        extGateway.disconnected79 = true;
                                        extGateway = null;
                                    }
                                }
                                resolve();
                            }
                            connectOnce(extGateway.onMessage, (msg1, port) => {
                                const lastError = chrome.runtime.lastError;
                                if (lastError && runtimeExecutable()) console.warn(lastError.message);
                                if (msg1 && msg1.messageId === sMessageId) {
                                    let ok = false;
                                    if (extGateway && !extGateway.disconnected79) {
                                        if (msg1.access_token) access_tokens[extensionId] = { connectionId: `${connectionId}`, tokenId: `${msg1.access_token}` };
                                        if (msg1.allow && msg1.allow.includes("list")) {
                                            ok = true;
                                        }
                                    }
                                    if (ok) {
                                        const timeEnd = Date.now();
                                        extGateway.timeOfBasicResponse79 = timeEnd - timeBegin;
                                        connectionGateways.set(extensionId, extGateway);
                                        // the port will be still stored in the store after disconnection
                                        resolve();
                                    } else {
                                        try {
                                            port.disconnect(); // cannot request close connection?
                                        } finally {
                                            port.disconnected79 = true;
                                            rejection();
                                        }
                                    }
                                    return false;
                                }
                            });
                            connectOnce(extGateway.onDisconnect, (port) => {
                                // not always triggering as the service worker might be inactive 
                                // and the disconnection is due to this service worker not the external extension.
                                const lastError = chrome.runtime.lastError;
                                if (lastError && runtimeExecutable()) ignoreError(lastError);
                                extGateway && (extGateway.disconnected79 = true);

                                const extensionInfo = listOfExtensions_ ? listOfExtensions_[port.extensionId79 || 'nil'] : null;
                                if (extensionInfo && extensionInfo.id && extensionInfo.id === port.extensionId79) {
                                    if (connectionGateways.get(extensionInfo.id)) {
                                        console.log("An external port is just disconnected,", `\t${extensionInfo.id} \t${extensionInfo.name}`)
                                    } else if (!ignoreExtensionIds.has(extensionInfo.id)) {
                                        ignoreExtensionIds.add(extensionInfo.id);
                                        console.log("An external port is not connectable.", `\t${extensionInfo.id} \t${extensionInfo.name}`)
                                    }
                                }
                                rejection();
                                // if the connection was connected before, the disconnected port will remain in the store
                                // if the connection was initially rejected from the beginning, boolean false will remain in the store
                                return false;
                            });
                            extGateway && extGateway.postMessage({
                                method: "userscripts",
                                action: "options",
                                messageId: sMessageId,
                                connectionId: connectionId,
                                instanceId: instanceId,
                                activeUrls: activeUrls
                            });
                        } catch (e) {
                            devUtils.debug(`unable to talk to ${extensionId}`, e);
                            resolve();
                        }
                    }))

                }

                if (listOfExtensions_ === null) {
                    // at each begining of the new tab of using editor
                    await extInfoPipelineExecution(async () => {
                        if (listOfExtensions_ === null) await flushListOfUserScriptMgrs();
                    });
                }
                const listOfExtensionIds = listOfExtensions_ !== null ? Object.keys(listOfExtensions_) : [];

                if (!listOfExtensionIds.length) {
                    sendResponse0({
                        error: {
                            message: "Unable to find any UserScript manager"
                        }
                    })
                    return void 0;
                }

                const extensionIdsForConnectionRequests = listOfExtensionIds.filter(eid => connectionGateways.get(eid) === void 0)
                // const t = K.length && K.includes(B) ? ie.values.externalExtensionIds : __externalExtensionIds__;

                // connectionGateways could be empty

                if (extensionIdsForConnectionRequests.length > 0) {
                    // false = cannot communicate
                    // non-null object = active
                    // undefined = to be determined

                    await listingPipelineExec(async () => {

                        const promiseForAskingAll = extensionIdsForConnectionRequests.map(createExtensionGateway);
                        const selfResponse = () => new Promise(resolve => chrome.management.getSelf(resolve));
                        const promiseTermination = (async function () {

                            try {
                                await delayPn(30);
                                await selfResponse();
                                await delayPn(30);
                                const message = "uqgfpCvV4BsNZhP5wyMDXGZq9ynN73oAoN8617EVnnny4Qg85ko28Kf76svFwBbYzDnO1y1kVb7XNefd7ZP5Fy3gqWFnlRSKcF4s5Pnz0A5GxGKhslWoiZiOHKEv5wUX";
                                await crypto.subtle.digest("SHA-1", new TextEncoder().encode(message));
                                await delayPn(30);
                                await selfResponse();
                            } catch (e) {
                                console.warn(e);
                            } finally {
                                await delayPn(600); // no I/O operation in "options" action
                            }

                        })();

                        await Promise.race([Promise.all(promiseForAskingAll).catch(console.warn), promiseTermination]).catch(console.warn);

                        for (const eid of listOfExtensionIds) {
                            const cr = connectionGateways.get(eid);
                            if (cr === void 0) {
                                connectionGateways.set(eid, false); // mark the extensions that cannot be communicated
                            }
                        }

                    });


                }

                // connectionGateways is filled with gateways and access_tokens are ready

                const connectResults = listOfExtensionIds.filter((eid => {
                    const cr = connectionGateways.get(eid)
                    return cr && !cr.disconnected79
                })).map((eid => ({
                    id: eid,
                    extensionInfo: listOfExtensions_[eid],
                    port: connectionGateways.get(eid),
                    timeOfBasicResponse: (connectionGateways.get(eid).timeOfBasicResponse79 || null),
                    pipe: Promise.resolve()
                })));

                if (!connectResults.length) {
                    sendResponse0({
                        error: {
                            message: "No communicable UserScript manager"
                        }
                    })
                    return void 0;
                }
                // console.log('connectResults', connectResults);
                // console.log('access_tokens', access_tokens);

                // options list get patch

                // min = 338ms > 300ms
                // max = 910ms < 1s
                if (action === 'try-reconnect') {

                    console.log('try-reconnect');

                    await extInfoPipelineExecution(async () => {
                        listOfExtensions_ = null;
                        await flushListOfUserScriptMgrs();
                    });

                    sendResponse0({
                        reconnectedInBackground_sz44sx5n: true
                    });


                } else if (action === 'list') {

                    const timeOfBasicResponseALL = (Math.max(...connectResults.map(cr => cr.timeOfBasicResponse).filter(t => !(t > 160)).concat(160)) + 100) * 1.3;

                    const timeoutPromise = new Promise(resolve => setTimeout(resolve, 4000 + timeOfBasicResponseALL));

                    const results = await Promise.all(connectResults.map(cr => {
                        const { id: cId, port: cGateway, timeOfBasicResponse } = cr;
                        const requestPromise = new Promise(actionResolve => {

                            cr.pipe = cr.pipe.then(() => new Promise(pipeResolve => {

                                if (cGateway.disconnected79) {
                                    pipeResolve();
                                    actionResolve(null);
                                    return;
                                }

                                const sMessageId = generateRandomTimedID();

                                connectOnce(cGateway.onMessage, (msg, port) => {
                                    const lastError = chrome.runtime.lastError;
                                    if (lastError && runtimeExecutable()) console.warn(lastError.message);
                                    if (msg && msg.messageId === sMessageId) {
                                        pipeResolve();
                                        actionResolve(msg);
                                        return false;
                                    }
                                });
                                // communicate from editor background to userjs manager extension background
                                cGateway.postMessage({
                                    method: msg0.method,
                                    messageId: sMessageId,
                                    connectionId: access_tokens[cId] ? access_tokens[cId].connectionId : null,
                                    access_token: access_tokens[cId] ? access_tokens[cId].tokenId : null,
                                    instanceId: instanceId,
                                    ...msg0.args
                                });

                            }));

                        });
                        return Promise.race([timeoutPromise, requestPromise]).then(result => {
                            return {
                                id: cId,
                                name: listOfExtensions_[cId].name,
                                result: result || null // null for disconnected or timeout
                            }
                        });
                    }));


                    sendResponse0(results);


                } else if (action === 'get' || action === 'patch') {

                    const path = ((msg0 || 0).args || 0).path;
                    let reqPath = path;
                    let reqExtId = connectResults[0].cId || 'nil';
                    let colonIdx = typeof path === 'string' ? path.indexOf(':') : -1;
                    if (colonIdx > 0) {
                        reqPath = path.substring(colonIdx + 1);
                        reqExtId = path.substring(0, colonIdx);
                    }

                    const filterConnections = connectResults.filter(cr => cr.id === reqExtId);

                    const filterConnection = filterConnections[0];

                    if (filterConnections.length !== 1 || !filterConnection) {
                        sendResponse0({
                            error: {
                                message: "No connection for the requested UserScript manager."
                            }
                        });
                        return;
                    }


                    const timeOfBasicResponseTARGET = (Math.max(...filterConnections.map(cr => cr.timeOfBasicResponse).filter(t => !(t > 160)).concat(160)) + 100) * 1.3;

                    const { id: cId, port: cGateway } = filterConnection;

                    const resultPromise = new Promise(actionResolve => {

                        filterConnection.pipe = filterConnection.pipe.then(() => new Promise(pipeResolve => {

                            if (cGateway.disconnected79) {
                                pipeResolve();
                                actionResolve(null);
                                return;
                            }

                            const sMessageId = generateRandomTimedID();

                            connectOnce(cGateway.onMessage, (msg, port) => {
                                const lastError = chrome.runtime.lastError;
                                if (lastError && runtimeExecutable()) console.warn(lastError.message);
                                if (msg && msg.messageId === sMessageId) {
                                    pipeResolve();
                                    actionResolve(msg);
                                    return false;
                                }
                            })
                            // communicate from editor background to userjs manager extension background
                            const extMsg = {
                                method: msg0.method,
                                messageId: sMessageId,
                                connectionId: access_tokens[cId] ? access_tokens[cId].connectionId : null,
                                access_token: access_tokens[cId] ? access_tokens[cId].tokenId : null,
                                instanceId: instanceId,
                                ...msg0.args
                            };
                            if (extMsg.path && reqPath) extMsg.path = reqPath;
                            cGateway.postMessage(extMsg);

                        }));

                    });

                    const resolvedResult = (await Promise.race([delayPn(4000 + timeOfBasicResponseTARGET), resultPromise])) || {
                        error: {
                            message: "Port Communication Failure"
                        }
                    };
                    sendResponse0(resolvedResult); // send to webpage content runtime


                } else if (action === 'options') {

                    sendResponse0({
                        error: {
                            message: `The action "options" shall not be called directly by the page script.`
                        }
                    });
                } else {

                    sendResponse0({
                        error: {
                            message: `The action "${action}" is not recongized.`
                        }
                    });
                }
            });

        } catch (e) {

            sendResponse0({
                error: {
                    message: `Internal Error (0xA391)`
                }
            });

        }
    };

    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
        const lastError = chrome.runtime.lastError;
        if (lastError) console.warn(lastError.message);
        // a message request from webpage content runtime
        // console.log('WebCoder_Extensions.chrome.runtime_onMessage', msg, sender, sendResponse);
        onMessageAsync(msg, sendResponse);
        return true; // sendResponse to be called asynchronously
    });

    async function onBtnClickedAsync(e) {
        let s1 = [];
        let s2 = [];
        if (e && e.length) {
            const { id: currentWindowId } = await new Promise(resolve => chrome.windows.getCurrent(resolve));
            s1 = e.filter(s => s.windowId === currentWindowId);
            s2 = e.filter(s => s.windowId !== currentWindowId);
        }
        const f = (s) => chrome.tabs.update(s.id, {
            active: true
        }, (() => chrome.runtime.lastError));
        if (s1.length >= 1) {
            const s = s1[0];
            f(s);
        } else if (s2.length >= 1) {
            const s = s2[0];
            chrome.windows.update(s.windowId, { focused: true }, (window) => {
                f(s);
            });
        } else {
            chrome.tabs.create({
                url: targetURL,
                active: true
            }, (() => chrome.runtime.lastError));
        }
    }
    chrome.action.onClicked.addListener((() => {
        chrome.runtime.lastError;
        chrome.tabs.query({
            url: targetURL + "*"
        }, (e => {
            chrome.runtime.lastError;
            onBtnClickedAsync(e);
        }));
    }));


    const portDisconnection = (disconnectedPort) => {

        connectedCount--;
        console.log('connectedCount', connectedCount)
        if (connectedCount === 0) {
            cidDisconnectAll && (clearTimeout(cidDisconnectAll), (cidDisconnectAll = 0));
            cidDisconnectAll = setTimeout(() => {
                // when the service killer is died, this might not be executed.
                // the connections will be automatically disconnected and the disconnected message will be sent to another end.
                if (connectedCount === 0) {
                    cidDisconnectAll = 0;
                    closeAllGateways(0);
                    console.log('closeAllGateways DONE');
                }
            }, 16000);
            console.log('closeAllGateways Scheduled')
        }

    }

    const portOnMessage = (msg, port) => {

        const lastError = chrome.runtime.lastError;
        if (lastError) (lastError.message).valueOf();
        if (msg && msg.dummyMessage) {
            msg.dummyMessage.valueOf();
        }
        // dummyMessage
    }

    // connect from content.js
    chrome.runtime.onConnect.addListener((port) => {

        if (port.name !== 'self-channel') return;
        console.log('port connected (received from content.js)')

        connectedCount++;
        console.log('connectedCount', connectedCount);
        cidDisconnectAll && (clearTimeout(cidDisconnectAll), (cidDisconnectAll = 0));

        port.onDisconnect.addListener(portDisconnection);

        port.onMessage.addListener(portOnMessage); // make the port "active"

        // port.onMessage.addListener((msg, port)=>{

        //     if(msg && msg.requestActive){

        //         if(chrome.runtime.lastError) chrome.runtime.lastError.valueOf();
        //         console.log(155);

        //         // chrome.runtime.sendMessage({
        //         //     requestActive: true
        //         // }, (res)=>{
        //         //     if(chrome.runtime.lastError) chrome.runtime.lastError.valueOf();

        //         //     return true;
        //         // })

        //     }



        // })


    });


    // const fpn = async (sendResponse)=>{

    //     await delayPn(1e9);
    //     sendResponse(Date.now());

    // }

    // chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    //     if(message && message.requestActive){
    //         if(chrome.runtime.lastError){chrome.runtime.lastError.valueOf();}

    //         fpn(sendResponse);


    //         console.log(111, sender);


    //         chrome.tabs.sendMessage(sender.tab.id, {requestActive: true}, function(response) {


    //             if(chrome.runtime.lastError){chrome.runtime.lastError.valueOf();}


    //             fpn(response);

    //             console.log(123);
    //             return true;


    //         });

    //         return true;

    //     }

    // })


    commPipelineExec(async () => {
        devUtils.set(settingLogLevel);
        devUtils.log("WebCoder_Extensions initialization done");
    });
})({ chrome });
