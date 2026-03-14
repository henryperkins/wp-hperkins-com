// packages/asset-loader/src/index.ts
function injectImportMap(scriptModules) {
  if (!scriptModules || Object.keys(scriptModules).length === 0) {
    return;
  }
  const existingMapElement = document.querySelector(
    "script#wp-importmap[type=importmap]"
  );
  if (existingMapElement) {
    try {
      const existingMap = JSON.parse(existingMapElement.text);
      if (!existingMap.imports) {
        existingMap.imports = {};
      }
      existingMap.imports = {
        ...existingMap.imports,
        ...scriptModules
      };
      existingMapElement.text = JSON.stringify(existingMap, null, 2);
    } catch (error) {
      console.error("Failed to parse or update import map:", error);
    }
  } else {
    const script = document.createElement("script");
    script.type = "importmap";
    script.id = "wp-importmap";
    script.text = JSON.stringify(
      {
        imports: scriptModules
      },
      null,
      2
    );
    document.head.appendChild(script);
  }
}
function loadStylesheet(handle, styleData) {
  return new Promise((resolve) => {
    if (!styleData.src) {
      resolve();
      return;
    }
    const existingLink = document.getElementById(handle + "-css");
    if (existingLink) {
      resolve();
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = styleData.src + (styleData.version ? "?ver=" + styleData.version : "");
    link.id = handle + "-css";
    link.media = styleData.media || "all";
    link.onload = () => resolve();
    link.onerror = () => {
      console.error(`Failed to load stylesheet: ${handle}`);
      resolve();
    };
    document.head.appendChild(link);
  });
}
function loadScript(handle, scriptData) {
  if (!scriptData.src) {
    const marker = document.createElement("script");
    marker.id = handle + "-js";
    marker.textContent = "// Processed: " + handle;
    return marker;
  }
  const script = document.createElement("script");
  script.src = scriptData.src + (scriptData.version ? "?ver=" + scriptData.version : "");
  script.id = handle + "-js";
  script.async = false;
  return script;
}
function injectInlineStyle(handle, inlineStyle, position) {
  let styleContent = "";
  if (Array.isArray(inlineStyle)) {
    styleContent = inlineStyle.join("\n");
  } else if (typeof inlineStyle === "string") {
    styleContent = inlineStyle;
  }
  if (styleContent && styleContent.trim()) {
    const styleId = handle + "-" + position + "-inline-css";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = styleContent.trim();
      document.head.appendChild(style);
    }
  }
}
function injectInlineScript(handle, inlineScript, position) {
  let scriptContent = inlineScript;
  if (Array.isArray(scriptContent)) {
    scriptContent = scriptContent.join("\n");
  }
  const script = document.createElement("script");
  script.id = handle + "-" + position + "-js";
  script.textContent = scriptContent.trim();
  return script;
}
function buildDependencyOrderedList(assetsData) {
  const visited = /* @__PURE__ */ new Set();
  const visiting = /* @__PURE__ */ new Set();
  const orderedList = [];
  function visit(handle) {
    if (visited.has(handle)) {
      return;
    }
    if (visiting.has(handle)) {
      console.warn(
        `Circular dependency detected for handle: ${handle}`
      );
      return;
    }
    visiting.add(handle);
    if (assetsData[handle]) {
      const deps = assetsData[handle].deps || [];
      deps.forEach((dep) => {
        if (assetsData[dep]) {
          visit(dep);
        }
      });
    }
    visiting.delete(handle);
    visited.add(handle);
    if (assetsData[handle]) {
      orderedList.push(handle);
    }
  }
  Object.keys(assetsData).forEach((handle) => {
    visit(handle);
  });
  return orderedList;
}
async function performScriptLoad(scriptElements, destination) {
  let parallel = [];
  for (const scriptElement of scriptElements) {
    if (scriptElement.src) {
      const loader = Promise.withResolvers();
      scriptElement.onload = () => loader.resolve();
      scriptElement.onerror = () => {
        console.error(`Failed to load script: ${scriptElement.id}`);
        loader.resolve();
      };
      parallel.push(loader.promise);
    } else {
      await Promise.all(parallel);
      parallel = [];
    }
    destination.appendChild(scriptElement);
  }
  await Promise.all(parallel);
  parallel = [];
}
async function loadAssets(scriptsData, inlineScripts, stylesData, inlineStyles, htmlTemplates, scriptModules) {
  if (scriptModules) {
    injectImportMap(scriptModules);
  }
  const orderedStyles = buildDependencyOrderedList(stylesData);
  const orderedScripts = buildDependencyOrderedList(scriptsData);
  const stylePromises = [];
  for (const handle of orderedStyles) {
    const beforeInline = inlineStyles.before?.[handle];
    if (beforeInline) {
      injectInlineStyle(handle, beforeInline, "before");
    }
    stylePromises.push(loadStylesheet(handle, stylesData[handle]));
    const afterInline = inlineStyles.after?.[handle];
    if (afterInline) {
      injectInlineStyle(handle, afterInline, "after");
    }
  }
  const scriptElements = [];
  for (const handle of orderedScripts) {
    const beforeInline = inlineScripts.before?.[handle];
    if (beforeInline) {
      scriptElements.push(
        injectInlineScript(handle, beforeInline, "before")
      );
    }
    scriptElements.push(loadScript(handle, scriptsData[handle]));
    const afterInline = inlineScripts.after?.[handle];
    if (afterInline) {
      scriptElements.push(
        injectInlineScript(handle, afterInline, "after")
      );
    }
  }
  const scriptsPromise = performScriptLoad(scriptElements, document.body);
  await Promise.all([Promise.all(stylePromises), scriptsPromise]);
  if (htmlTemplates && htmlTemplates.length > 0) {
    htmlTemplates.forEach((templateHtml) => {
      const scriptMatch = templateHtml.match(
        /<script([^>]*)>(.*?)<\/script>/is
      );
      if (scriptMatch) {
        const attributes = scriptMatch[1];
        const content = scriptMatch[2];
        const script = document.createElement("script");
        const idMatch = attributes.match(/id=["']([^"']+)["']/);
        if (idMatch) {
          script.id = idMatch[1];
        }
        const typeMatch = attributes.match(/type=["']([^"']+)["']/);
        if (typeMatch) {
          script.type = typeMatch[1];
        }
        script.textContent = content;
        document.body.appendChild(script);
      }
    });
  }
}
var index_default = loadAssets;
export {
  index_default as default
};
//# sourceMappingURL=index.mjs.map
