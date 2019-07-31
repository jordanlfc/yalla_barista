const path_name = window.location.pathname


//jquery 

$( document ).ready(function() {
    $('#uae').click(function (){
        $('#aed-box').removeClass('d-none')
        $('#gbp-box').addClass('d-none')
        $('#usd-box').addClass('d-none')
    });
    $('#uk').click(function (){
        $('#gbp-box').removeClass('d-none')
        $('#aed-box').addClass('d-none')
        $('#usd-box').addClass('d-none')
    });
    $('#usa').click(function (){
        $('#usd-box').removeClass('d-none')
        $('#gbp-box').addClass('d-none')
        $('#aed-box').addClass('d-none')
    });
    $('#business-login').click(function(){
        $('#login-form').prop('action', '/login1')
    });

    if(path_name !== "/"){
        $('.resize').each(function(){
            $('.resize').addClass('resize-img')
            
            $('#header').addClass('resize-header')
            $('#footer').addClass('footer-btm')
        });
    }
});




//normal JS 


