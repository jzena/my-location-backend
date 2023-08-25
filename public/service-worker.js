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
