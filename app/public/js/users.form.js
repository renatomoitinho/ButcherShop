(function(globals) {

    globals.submitProfile = function(button){
        var form = document.querySelector('#profile');
        form.setAttribute('action', button.getAttribute('data-target'));
        form.submit();
    };

}(window));