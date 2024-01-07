try {
    console.log('WebCoder_Extensions Alive', Date.now());
    window.stop();
} finally {

    top.postMessage({
        userjs_is_alive_tmn8f1qt: true
    }, "*");
}