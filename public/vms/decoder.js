if ("function" === typeof importScripts) {
  importScripts('utils.js');
  importScripts('core.js');

  class Decoder {
    constructor() {
      this.decCtx = new Map();
      this.urlSrc = new Map();
      this.id = -1;
      this.isDebug = false;
      this.logger = null;
      this.token = "";
    }

    init(data) {
      this.id = data.id;
      this.isDebug = data.isDebug;
      this.token = data.token;
      this.logger = new Logger("Decoder " + this.id, this.isDebug);
    }

    setChannelSource(i, src) {
      if (this.decCtx.has(i)) {
        this.stop(i);
      }
      if (!this.decCtx.has(i)) {
        new VmsDecoder({
          "print": (text) => {
            console.log("print", text);
          },
          "printErr": (text) => {
            console.error("printErr", text);
          },
          "onAbort": (err) => {
            console.log("onAbort", err);
          }
        })
          .then(instance => {
            this.decCtx.set(i, instance);
            let ret = instance.cwrap("start", "number", ["number", "string", "string", "number"])(i, src, this.token, this.isDebug ? 1 : 0);
            // console.log("start cmd ret",i, ret);
          });
      }
    }

    stop(i) {
      if (this.decCtx.has(i)) {
        let instance = this.decCtx.get(i);
        let ret = instance.cwrap("stop", "number", [])();
        // console.log("stop cmd ret", i, ret);
        this.decCtx.delete(i);
        instance = null;
      }
    }

    pause(i) {
      if (this.decCtx.has(i)) {
        let instance = this.decCtx.get(i);
        let ret = instance.cwrap("pause", "number", [])();
        // console.log("pause cmd ret",i, ret);
      }
    }

    resume(i) {
      if (this.decCtx.has(i)) {
        let instance = this.decCtx.get(i);
        let ret = instance.cwrap("resume", "number", [])();
        // console.log("resume cmd ret",i, ret);
      }
    }

    seek(i, s) {
      if (this.decCtx.has(i)) {
        let instance = this.decCtx.get(i);
        let ret = instance.cwrap("seek", "number", ["number"])(s);
        // console.log("seek cmd ret",i, ret, s);
      }
    }

    urlSeek(i, s, u) {
      if (this.decCtx.has(i)) {
        this.stop(i);
      }
      if (!this.decCtx.has(i)) {
        new VmsDecoder({
          "print": (text) => {
            console.log("print", text);
          },
          "printErr": (text) => {
            console.error("printErr", text);
          },
          "onAbort": (err) => {
            console.log("onAbort", err);
          }
        })
          .then(instance => {
            this.decCtx.set(i, instance);
            let ret = instance.cwrap("start", "number", ["number", "string", "string", "number"])(i, u, this.token, this.isDebug ? 1 : 0);
            // console.log("start cmd ret",i, ret);
            ret = instance.cwrap("seek", "number", ["number"])(s);
            // console.log("seek cmd ret",i, ret, s);
          });
      }
    }

    speed(i, rate) {
      if (this.decCtx.has(i)) {
        let instance = this.decCtx.get(i);
        let ret = instance.cwrap("speed", "number", ["number"])(rate);
        // console.log("speed cmd ret",i, ret, rate);
      }
    }
  }

  self.decoder = new Decoder();

  self.onmessage = (evt) => {
    let objData = evt.data;
    switch (objData.t) {
      case initReq:
        self.decoder.init(objData);
        break;
      case urlReq:
        self.decoder.setChannelSource(objData.i, objData.u);
        break;
      case stopReq:
        self.decoder.stop(objData.i);
        break;
      case pauseReq:
        self.decoder.pause(objData.i);
        break;
      case resumeReq:
        self.decoder.resume(objData.i);
        break;
      case seekReq:
        self.decoder.seek(objData.i, objData.ts);
        break;
      case urlSeekReq:
        self.decoder.urlSeek(objData.i, objData.ts, objData.u);
        break;
      case speedReq:
        self.decoder.speed(objData.i, objData.r);
        break;
      default:
        this.logger.logInfo(objData);
        break;
    }
  }

  self.postMessage({
    t: readyRes
  })
}
