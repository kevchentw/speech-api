if (!('webkitSpeechRecognition' in window)) {
    var os = getMobileOperatingSystem();
    if (os == 'iOS' || os == 'Android') {
        $('#os').text(os);
    } else {
        swal(
            'Oops...',
            'Something went wrong!',
            'error'
        )
    }
} else {
    $('#os').text('Chrome');
    var recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;

    recognizing = false;

    var final_rst = [];
    var inter_rst = [];

    recognition.onstart = function() {
        recognizing = true;
        update_start_btn();
        console.log('recognition start');
        $('#status').text('正在辨識');
    };

    recognition.onend = function() {
        recognizing = false;
        update_start_btn();
        console.log('recognition end');
    };

    recognition.onresult = function(event) {
        console.log('recognition result');
        update_start_btn();
        $('#status').text('辨識完成');
        console.log(event);
        for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                final_rst.push(event.results[i][0].transcript);
                $('#result').val(event.results[i][0].transcript);
                $('#final_rst_panel').text(event.results[i][0].transcript);
            } else {
                inter_rst.push(event.results[i][0].transcript);
                $('#inter_rst_panel').text($('#inter_rst_panel').text() + ', ' + event.results[i][0].transcript);
            }
        }

    };

    function reset_recognition() {
        final_rst = [];
        inter_rst = [];
        $('#inter_rst_panel').text('');
        $('#final_rst_panel').text('');
        $('#result').val('');
        update_start_btn();
    }

    function getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i)) {
            return 'iOS';
        } else if (userAgent.match(/Android/i)) {
            return 'Android';
        } else {
            return 'unknown';
        }
    }

    function update_start_btn() {
        if (recognizing == true) {
            $('#start').removeClass('btn-primary').addClass('btn-danger');
            $('#start').text('停止辨識');
        } else {
            $('#start').removeClass('btn-danger').addClass('btn-primary');
            $('#start').text('開始辨識');
        }
    }
}

function voice_only_textarea(obj) {
    obj.on('keypress', function(event) {
        console.log('keypress');
        event.preventDefault();
        return false;
    });
    obj.on('paste', function(event) {
        console.log('paste');
        event.preventDefault();
        return false;
    });
}


$(document).ready(function() {
        $('#start').click(function() {
            console.log('click');
            if (recognizing == false) {
                reset_recognition();
                recognition.start();
            } else {
                recognition.stop();
            }
        });
        voice_only_textarea($('#result'));
    }
);
