/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./workbox-8f0e986c'], (function (workbox) { 'use strict';

  importScripts();
  self.skipWaiting();
  workbox.clientsClaim();
  workbox.registerRoute("/", new workbox.NetworkFirst({
    "cacheName": "start-url",
    plugins: [{
      cacheWillUpdate: async ({
        request,
        response,
        event,
        state
      }) => {
        if (response && response.type === 'opaqueredirect') {
          return new Response(response.body, {
            status: 200,
            statusText: 'OK',
            headers: response.headers
          });
        }
        return response;
      }
    }]
  }), 'GET');
  workbox.registerRoute(/.*/i, new workbox.NetworkOnly({
    "cacheName": "dev",
    plugins: []
  }), 'GET');

}));


//service-worker to post, get and update coords
let temporaryData = null;

self.addEventListener('message', (event) => {
  if (event.data && event.data.id) {
    temporaryData = event.data;
  }
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data-post' && temporaryData) {
    event.waitUntil(handleSyncPost());

  } else if (event.tag === 'sync-data-put' && temporaryData) {
    event.waitUntil(handleSyncPut());

  } else if (event.tag.startsWith('syncGet-')) {
    const uniqueID = event.tag.split('syncGet-')[1];
    event.waitUntil(handleSyncGet(uniqueID))
  }
});

async function handleSyncGet(uniqueID) {
  try {
    const response = await fetch(`/api/location?uniqueID=${uniqueID}`)
    console.log('get-response:', response)
  } catch (error) {
    console.log('get-error:', error)
  }
}

async function handleSyncPost() {
  const data = temporaryData
  const url = '/api/location'
  const method = 'POST'

  try {
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      temporaryData = null
    } else {
      throw new Error('post-error')
    }
  } catch (error) {
    console.log('post-error:', error)
  }
}

async function handleSyncPut() {
  const data = temporaryData
  const url = '/api/location'
  const method = 'PUT'

  try {
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (response.ok) {
      temporaryData = null
    } else {
      throw new Error('post-error')
    }
  } catch (error) {
    console.log('put-error:', error)
  }
}



//# sourceMappingURL=sw.js.map
