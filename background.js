function onError(error) {
  console.log(error);
}

var hideTab = async function(tab) {
  if (tab.active) {
    const tabs = await browser.tabs.query({ currentWindow: true, hidden: false});
    if (tabs.length > 1) {
      if (tabs[0].active) {
        await browser.tabs.update(tabs[1].id, { active: true });
      } else {
        await browser.tabs.update(tabs[0].id, { active: true });
      }
    } else {
      return false;
    }
  }
  await browser.tabs.hide(tab.id);
}

browser.menus.create({
  id: "panicbutton-hidethetab",
  title: "Hide the tab",
  contexts: ["tab", "page"]
});

browser.menus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "panicbutton-hidethetab") {
    hideTab(tab);
  }
});

browser.commands.onCommand.addListener(function(command) {
  if (command == "panic-buton-hide-current") {
    browser.tabs.query({active: true, windowId: browser.windows.WINDOW_ID_CURRENT}).then(tabs => browser.tabs.get(tabs[0].id)).then(hideTab, onError);
  }
});
