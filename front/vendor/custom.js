$(document).ready(function () {
    $("a.collapse-item").click(function () {
        $('a.collapse-item.active').not(this).removeClass('active');
        $(this).addClass('active');
    });

    $('#meta').click(function () {
        $('#metadata').toggle();
    });
});


// var ebModal = document.getElementById('mySizeChartModal');
// var ebBtn = document.getElementById("mySizeChart");
// var ebSpan = document.getElementsByClassName("ebcf_close")[0];

// ebBtn.onclick = function () {
//     ebModal.style.display = "block";
// }
// window.onclick = function (event) {
//     if (event.target == ebModal) {
//         ebModal.style.display = "none";
//     }
// }
