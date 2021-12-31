let isRunMap = {}
chrome.action.onClicked.addListener(tab => {
  console.log(tab.id, isRunMap, isRunMap[tab.id])

  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    files: ['bundle.js']
  })
  chrome.scripting.insertCSS({
    target: { tabId: tab.id, allFrames: true },
    files: ['bundle.css']
  })
  let text = ''
  if (isRunMap[tab.id]) {
    isRunMap[tab.id] = false
  } else {
    isRunMap[tab.id] = true
    text = 'run'
  }
  chrome.action.setBadgeText({
    text: text,
    tabId: tab.id
  })
})

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.status === 'loading') {
    console.log(tabId)
    isRunMap[tabId] = false
  }
})
