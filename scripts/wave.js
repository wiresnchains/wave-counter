"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/app/store.ts
var store_exports = {};
__export(store_exports, {
  WaveStore: () => WaveStore
});
var WaveStore;
var init_store = __esm({
  "src/app/store.ts"() {
    "use strict";
    WaveStore = class {
      constructor(from = {}) {
        this.data = from.data || {};
        this.proxies = from.proxies || {};
      }
      async setValue(key, value) {
        const proxy = this.proxies[key];
        if (proxy) {
          const proxyResult = await proxy(value);
          if (!proxyResult)
            return;
        }
        this.data[key] = value;
        if (this.onDataChange)
          this.onDataChange(this, key);
      }
      getValue(key) {
        return this.data[key];
      }
      setProxy(key, handler) {
        this.proxies[key] = handler;
      }
      removeProxy(key) {
        delete this.proxies[key];
      }
      getDataKeys() {
        return Object.keys(this.data);
      }
    };
  }
});

// src/constants/attributes.ts
var WaveAttributes;
var init_attributes = __esm({
  "src/constants/attributes.ts"() {
    "use strict";
    ((WaveAttributes2) => {
      WaveAttributes2.data = "wave-data";
      WaveAttributes2.condition = "wave-condition";
    })(WaveAttributes || (WaveAttributes = {}));
  }
});

// src/constants/messages.ts
var WaveMessages;
var init_messages = __esm({
  "src/constants/messages.ts"() {
    "use strict";
    ((WaveMessages2) => {
      WaveMessages2.elementNotFound = "Element '%s' was not found";
      WaveMessages2.mountedUseStore = "Cannot use new stores while mounted";
      WaveMessages2.storeKeyOverlap = "Overlapping store keys";
      WaveMessages2.alreadyMounted = "App is already mounted";
      WaveMessages2.notMounted = "App is not mounted";
    })(WaveMessages || (WaveMessages = {}));
  }
});

// src/core/dom.ts
var WaveDom;
var init_dom = __esm({
  "src/core/dom.ts"() {
    "use strict";
    init_messages();
    WaveDom = class {
      constructor(selector) {
        const element = document.querySelector(selector);
        if (!element)
          throw new Error(WaveMessages.elementNotFound.replace("%s", selector));
        this.parent = element;
      }
      get root() {
        return this.parent;
      }
      getAllElements() {
        return Array.from(this.parent.getElementsByTagName("*"));
      }
      getElementsByAttribute(attribute, value) {
        return Array.from(this.parent.querySelectorAll(`[${attribute}${value ? `=${value}` : ""}]`));
      }
    };
  }
});

// src/core/logicalOperator.ts
var WaveLogicalOperator;
var init_logicalOperator = __esm({
  "src/core/logicalOperator.ts"() {
    "use strict";
    WaveLogicalOperator = class {
      constructor(attribute, handler) {
        this.attribute = attribute;
        this.handler = handler;
      }
    };
  }
});

// src/constants/logicalOperators.ts
var LOGICAL_OPERATORS;
var init_logicalOperators = __esm({
  "src/constants/logicalOperators.ts"() {
    "use strict";
    init_logicalOperator();
    LOGICAL_OPERATORS = [
      new WaveLogicalOperator(" = ", (data, compareWith) => {
        return data == compareWith;
      }),
      new WaveLogicalOperator(" > ", (data, compareWith) => {
        return data > compareWith;
      }),
      new WaveLogicalOperator(" >= ", (data, compareWith) => {
        return data >= compareWith;
      }),
      new WaveLogicalOperator(" < ", (data, compareWith) => {
        return data < compareWith;
      }),
      new WaveLogicalOperator(" <= ", (data, compareWith) => {
        return data <= compareWith;
      })
    ];
  }
});

// src/core/parser.ts
var WaveParser;
var init_parser = __esm({
  "src/core/parser.ts"() {
    "use strict";
    init_logicalOperators();
    ((WaveParser2) => {
      function parseArgument(argument, data) {
        const firstChar = argument.charAt(0);
        const lastChar = argument.charAt(argument.length - 1);
        const isString = (firstChar == '"' || firstChar == "'") && (lastChar == '"' || lastChar == "'");
        const parsedInt = Number(argument);
        return !Number.isNaN(parsedInt) ? parsedInt : argument == "true" ? true : argument == "false" ? false : isString ? argument.slice(1).slice(0, -1) : data ? firstChar == "!" ? !data[argument.slice(1)] : data[argument] : void 0;
      }
      WaveParser2.parseArgument = parseArgument;
      function parseCondition(condition, data) {
        const conditions = condition.split(" && ");
        let conditionsMet = true;
        for (let i = 0; i < conditions.length; i++) {
          const condition2 = conditions[i];
          let conditionMet = false;
          for (let j = 0; j < LOGICAL_OPERATORS.length; j++) {
            const logicalOperator = LOGICAL_OPERATORS[j];
            if (!condition2.includes(logicalOperator.attribute))
              continue;
            const args = condition2.split(logicalOperator.attribute);
            if (args.length < 2)
              continue;
            conditionMet = logicalOperator.handler(WaveParser2.parseArgument(args[0], data), WaveParser2.parseArgument(args[1], data));
          }
          if (!conditionMet) {
            conditionsMet = false;
            break;
          }
        }
        return conditionsMet;
      }
      WaveParser2.parseCondition = parseCondition;
    })(WaveParser || (WaveParser = {}));
  }
});

// src/app/app.ts
var app_exports = {};
__export(app_exports, {
  WaveApp: () => WaveApp
});
var WaveApp;
var init_app = __esm({
  "src/app/app.ts"() {
    "use strict";
    init_attributes();
    init_messages();
    init_dom();
    init_parser();
    WaveApp = class {
      constructor(selector) {
        this.selector = selector;
        this.stores = [];
      }
      useStore(store) {
        if (this.dom)
          throw new Error(WaveMessages.mountedUseStore);
        this.stores.push(store);
      }
      mount() {
        if (this.dom)
          throw new Error(WaveMessages.alreadyMounted);
        this.dom = new WaveDom(this.selector);
        for (let i = 0; i < this.stores.length; i++)
          this.stores[i].onDataChange = this.onDataChange.bind(this);
        this.initializeMountedElement();
      }
      unmount() {
        if (!this.dom)
          throw new Error(WaveMessages.notMounted);
        const data = this.getMergedStoreData();
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const elements = this.dom.getElementsByAttribute(WaveAttributes.data, key);
          for (let j = 0; j < elements.length; j++)
            elements[j].outerHTML = `{{ ${key} }}`;
        }
        const conditionElements = this.dom.getElementsByAttribute(WaveAttributes.condition);
        for (let i = 0; i < conditionElements.length; i++) {
          const element = conditionElements[i];
          if (element.style.display != "none")
            continue;
          element.style.display = "";
        }
        delete this.dom;
      }
      getMount() {
        if (!this.dom)
          throw new Error(WaveMessages.notMounted);
        return this.dom.root;
      }
      initializeMountedElement() {
        if (!this.dom)
          return;
        const elements = this.dom.getAllElements();
        const data = this.getMergedStoreData();
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const value = data[key];
          for (let j = 0; j < elements.length; j++) {
            const element = elements[j];
            if (!element.innerHTML.includes(`{{ ${key} }}`))
              continue;
            element.innerHTML = element.innerHTML.replaceAll(`{{ ${key} }}`, `<span ${WaveAttributes.data}="${key}">${value}</span>`);
          }
        }
        this.updateConditionals();
      }
      onDataChange(instance, changedKey) {
        if (!this.dom)
          return;
        const elements = this.dom.getElementsByAttribute(WaveAttributes.data, changedKey);
        const value = instance.getValue(changedKey);
        for (let i = 0; i < elements.length; i++)
          elements[i].innerHTML = value.toString();
        this.updateConditionals();
      }
      updateConditionals() {
        if (!this.dom)
          return;
        const elements = this.dom.getElementsByAttribute(WaveAttributes.condition);
        const data = this.getMergedStoreData();
        for (let i = 0; i < elements.length; i++) {
          const element = elements[i];
          const attribute = element.getAttribute(WaveAttributes.condition);
          if (!attribute)
            continue;
          const conditionsMet = WaveParser.parseCondition(attribute, data);
          element.style.display = conditionsMet ? "" : "none";
        }
      }
      getMergedStoreData() {
        const data = {};
        for (let i = 0; i < this.stores.length; i++) {
          const store = this.stores[i];
          const keys = store.getDataKeys();
          for (let j = 0; j < keys.length; j++) {
            const key = keys[j];
            if (data[key])
              console.warn(WaveMessages.storeKeyOverlap, key, this);
            data[key] = store.getValue(key);
          }
        }
        return data;
      }
    };
  }
});

// src/bundle.ts
init_store();
init_app();
