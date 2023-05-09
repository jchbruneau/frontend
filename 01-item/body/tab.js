function resetActive() {
    let i;
    const tabs = document.getElementsByClassName('tab');
    const separators = document.getElementsByClassName('separator');
    const contents = document.getElementsByClassName('content');
    for (i = 0; i < tabs.length; i++) { tabs[i].classList.remove('active'); }
    for (i = 0; i < separators.length; i++) { separators[i].classList.add('disable'); }
    for (i = 0; i < contents.length; i++) { contents[i].classList.add('disable'); }
}

function clickTab(type) {
    resetActive();
    document.getElementById('tab-' + type).classList.add('active');
    document.getElementById('separator-' + type).classList.remove('disable');
    document.getElementById('code-' + type).classList.remove('disable');
}