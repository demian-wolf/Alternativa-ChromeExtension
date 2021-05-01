function get_current_language() {
    return document.getElementsByName("language")[0].value;
}

function get_current_date() {
    // source: https://stackoverflow.com/a/4929629/8661764
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    
    date = `${yyyy}-${mm}-${dd}`;
    return date;
}

function get_student_form() {
    // TODO: detect sudent form automatically
    return 9;
}

function fix_diary(data, is_json, fixer) {
    var req = new XMLHttpRequest();
    
    req.open("POST", "https://online-shkola.com.ua/schedule/diary/index.php", true);
    
    if (is_json) {
        req.responseType = "json"
    }
    
    req.send(JSON.stringify(data));
    
    req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
            fixer(req);
        }
    }
}

function fix_diarystats() {
    // TODO: make it possible to filter subjects and dates (change "date" and "subject_v")
    data = {"type": "stat",
            "date": get_current_date(),
            "week": "current",
            "class_n": get_student_form().toString(),
            "subject_v": "0"};
    
    fix_diary(data, true, function(req) {
            prg_elements = document.getElementsByClassName("progress-background");
            stats = [req.response.hw, req.response.test]
            console.log(stats);
            for (var type=0; type < 2; type++) {
                let done = stats[type].done;
                let percentage = stats[type].percentage;
                let total = stats[type].total;
                
                if (total === 0) {
                    percentage = 100;
                }
                
                prg_bgi = prg_elements[type].getElementsByClassName("progress-background__item")[0];
                prg_bgi.style.width = `${percentage}%`;
                
                prg_counter = prg_elements[type].getElementsByClassName("progress-counter")[0];
                prg_counter.innerHTML = `${done} з ${total} - ${percentage}%`;
            }
        })
}

function fix_diarytable(req) {
    // TODO: make it possible to filter subjects and dates (change "date" and "subject_v")
    data = {"type": "table",
            "date": get_current_date(),
            "week": "current",
            "language": get_current_language(),
            "isStudent": true,
            "class_n": get_student_form().toString(),
            "subject_v": "0"};
    
    fix_diary(data, false, function(req) {
        document.getElementById("diary-week").innerHTML = req.responseText;
        }
    )
}

fix_diarytable();
fix_diarystats();
