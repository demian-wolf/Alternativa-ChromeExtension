function get_current_language() {
    return document.getElementsByName("language")[0].value;
}

function get_current_date() {
    function padStart(string, length, filler) {  // polyfill for older browsers
        while (string.length < length) {
            string = filler + string;
        }
        return string;
    }

    // source: https://stackoverflow.com/a/4929629/8661764
    var today = new Date();
    var dd = padStart(String(today.getDate()), 2, '0');
    var mm = padStart(String(today.getMonth() + 1), 2, '0');
    var yyyy = today.getFullYear();

    date = `${yyyy}-${mm}-${dd}`;
    return date;
}

function get_student_form() {
    // TODO: detect sudent form automatically
    return 9;
}

function fix_diary(data, fixer) {
    fetch("https://online-shkola.com.ua/schedule/diary/index.php", {
        method: "POST",
        mode: "same-origin",
        headers: {"Referer": "https://www.online-shkola.com.ua/schedule/diary.php"},
        body: JSON.stringify(data)
    }).then((response) => fixer(response));
}

function fix_diarystats() {
    // TODO: make it possible to filter subjects and dates (change "date" and "subject_v")
    data = {
        "type": "stat",
        "date": get_current_date(),
        "week": "current",
        "class_n": get_student_form().toString(),
        "subject_v": "0"
    };

    fix_diary(data, function (response) {
        prg_elements = document.getElementsByClassName("progress-background");
        response.json().then((json) => {
            stats = [json.hw, json.test];
            for (var type = 0; type < 2; type++) {
                let done = stats[type].done;
                let percentage = stats[type].percentage;
                let total = stats[type].total;

                if (total === 0) {
                    percentage = 100;
                }

                prg_bgi = prg_elements[type].getElementsByClassName("progress-background__item")[0];
                prg_bgi.style.width = `${percentage}%`;

                prg_counter = prg_elements[type].getElementsByClassName("progress-counter")[0];
                prg_counter.innerHTML = `${done} з ${total} - ${percentage}%`;  // TODO: should depend on the language
            }
        });
    });
}

function fix_diarytable() {
    // TODO: make it possible to filter subjects and dates (change "date" and "subject_v")
    data = {
        "type": "table",
        "date": get_current_date(),
        "week": "current",
        "language": get_current_language(),
        "isStudent": true,
        "class_n": get_student_form().toString(),
        "subject_v": "0"
    };

    fix_diary(data, function (response) {
            response.text().then((html) => document.getElementById("diary-week").innerHTML = html);
        }
    )
}

setTimeout(function() {  // FIXME: replace this workaround with normal solution
    fix_diarystats();
    fix_diarytable();
}, 0);
