//========================================================================================
//  HELP MODAL
//========================================================================================
var triggeringElement;

function setupModal() {
    modal = document.querySelector('.modal');
    modalContent = document.querySelector('.modal .modal-content');

    var helpIconLink = document.querySelector('.help-icon-link');
    helpIconLink.addEventListener('click', function(e) {
        triggeringElement = helpIconLink;
        showModal();
    });

    var helpLink = document.querySelector('.help-link');
    helpLink.addEventListener('click', function(e) {
        triggeringElement = helpLink;
        showModal();
    });

    modal.addEventListener('keydown', function(e) {
        if(e.key == 'Escape') {
            hideModal();
        }
    });
}

function showModal() {
    modal.className = modal.className.replace(/\hide\b/g, "").trim();
    modal.className = modal.className.replace(/\animated fadeOut\b/g, "").trim();
    modal.className += ' animated fadeIn';
    modal.addEventListener('click', hideModal);
    modal.focus();

    modalContent.className += ' animated fadeInDownBig';
    modalContent.className = modalContent.className.replace(/\animated fadeOutUpBig\b/g, "").trim();
}

function hideModal() {
    modal.className = modal.className.replace(/\animated fadeIn\b/g, "").trim();
    modal.className += ' animated fadeOut';
    modal.removeEventListener('click', hideModal);
    triggeringElement.focus();
    triggeringElement = null;

    setTimeout(function() {
        modal.className += ' hide';
    }, 1000);

    modalContent.className = modalContent.className.replace(/\animated fadeInDownBig\b/g, "").trim();
    modalContent.className += ' animated fadeOutUpBig';
}