function disableLoader() {
    const loader = document.getElementsByClassName('loader');
    loader[0].classList.toggle('disable');
}