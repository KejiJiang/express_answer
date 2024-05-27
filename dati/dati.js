function a() {
    $.ajax({
        url: "http://127.0.0.1:8888/login/manager",
        type: "POST",
        dataTypes: "json",
        data: {
            "theme": theme.value,
            "joinnums": joinnums.value,
            "remianingall": remainingall.value,
            "remainingward": remainingward.value,
        },
        success: function (res) {
            console.log(res);
            if (flag == 1) {

            } else {

            }
        },
        error: function (res) {
            alert(res.responseText);
        }
    })
}