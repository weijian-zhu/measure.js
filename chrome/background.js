let isRun = false
chrome.action.onClicked.addListener(tab => {
  chrome.action.setBadgeBackgroundColor({
    color: '#ED5666',
    tabId: tab.id
  })
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['bundle.js']
  })
  if (isRun) {
    chrome.action.setBadgeText({
      text: '',
      tabId: tab.id
    })
  } else {
    chrome.action.setBadgeText({
      text: 'run',
      tabId: tab.id
    })
  }
  isRun = !isRun
})
