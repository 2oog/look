const fmt = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

// ----------------------------------------------------------------

function timeDiff(dt) {
    let year = 31536000;
    let month = 2592000;
    let day = 86400;
    let hour = 3600;
    let seconds = 60;

    let now = new Date();
    let diff = Math.floor((now - dt) / 1000);

    let d_yrs = Math.floor(diff / year);
    let d_mos = Math.floor((diff % year) / month);
    let d_days = Math.floor(((diff % year) % month) / day);

    if (d_mos == 12) {
        d_mos -= 1;
        d_days += 30;
    }

    let d_hrs = Math.floor((diff % day) / hour);
    let d_mins = Math.floor((diff % hour) / seconds);
    let d_secs = Math.floor(diff % seconds);

    function f(number) {
        return `${('0' + number).slice(-2)}`;
    }

    if (d_yrs > 0 || d_mos > 0 || d_days > 0) {
        return `[` + `${(d_yrs > 0) ? d_yrs + 'y' : ''} ${(d_mos > 0) ? d_mos + 'm' : ''} ${(d_days > 0) ? d_days + 'd' : ''} ${f(d_hrs)}:${f(d_mins)}:${f(d_secs)}`.replace(/\s+/g, " ").trim() + `]`;
    } else if (d_hrs > 0) {
        return `[` + `${d_hrs}:${f(d_mins)}:${f(d_secs)}` + `]`;
    } else if (d_mins > 0) {
        return `[` + `${d_mins}:${f(d_secs)}` + `]`;
    } else {
        return `[` + `${d_secs}s` + `]`;
    }
}

function timeToStringA(dt, withTimeDiff = true) {
    let option = {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hourCycle: 'h23',
        timeZoneName: 'short'
    };
    return dt.toLocaleString("en-GB", option) + (withTimeDiff ? `<code>${timeDiff(dt)}</code>` : ``);
}

function timeToStringB(dt) {
    let op1 = { weekday: 'short' };
    let op2 = { year: 'numeric', month: 'numeric', day: 'numeric' };
    let op3 = { hourCycle: 'h23' };
    return `${dt.toLocaleDateString("en-GB", op1)}<br>${dt.toLocaleDateString("en-GB", op2)}<br>${dt.toLocaleTimeString("en-GB", op3)}`;
}

function isBoolean(o) {
    return typeof o == 'boolean';
}

function isObject(o) {
    return typeof o == "object";
}

function isArray(o) {
    return Array.isArray(o);
}

function booleanVisualization(b) {
    if (b) {
        return '✅';
    } else {
        return '❌';
    }
}

function twodigit(n) {
    return ('0' + n).slice(-2);
}

function secondToHMS(sec) {

    let d = Math.floor(sec / (86400));
    let h = Math.floor((sec % 86400) / 3600);
    let m = Math.floor((sec % 3600) / 60);
    let s = sec % 60;

    if (d > 0) {
        return `${d}:${twodigit(h)}:${twodigit(m)}:${twodigit(s)}`;
    } else if (h > 0) {
        return `${h}:${twodigit(m)}:${twodigit(s)}`;
    } else if (m > 0) {
        return `${m}:${twodigit(s)}`;
    } else {
        return `${s}`;
    }

}

function sort_by_key(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function parseQueryParams() {
    let queryParams = {};
    let queryString = window.location.search.substring(1);
    let pairs = queryString.split("&");

    for (const i = 0; i < pairs.length; i++) {
        let pair = pairs[i].split("=");
        let key = decodeURIComponent(pair[0]);
        let value = decodeURIComponent(pair[1] || "");
        queryParams[key] = value;
    }

    return queryParams;
}

// ----------------------------------------------------------------

function bulletnator(list) {
    let s = '<ul>';
    for (let l of list) {
        if (isArray(l)) {
            s = `${s}<li>${bulletnator(l)}</li>`;
        } if (isObject(l)) {
            s = `${s}<li>${tablenator(l)}</li>`;
        } else {
            s = `${s}<li>${l}</li>`;
        }
    }
    return `${s}</ul>`
}

function tablenator(dict) {

    let s = '<table>';
    for (let key in dict) {

        s = `${s}<tr><td class=short>${key}</td>`;

        if ((key == 'logo' || key == 'banner' || key == 'link') && dict[key] != null) {
            s = `${s}<td><a href="${dict[key]}" target="_blank">${dict[key]}</a></td>`;
        }

        else if (key == 'chatColor' && dict[key] != null) {
            s = `${s}<td><table style="background-color: transparent;"><tr style="padding: 0px;"><td style="padding: 0px; background-color: ${dict[key]}; width:50px;"></td><td style="padding: 0px; padding-left: 5px;">${dict[key]}</td></tr></table></td>`;
        }

        else if (key == 'id' || key == 'login' || key == 'banReason') {
            s = `${s}<td><code>${dict[key]}</code></td>`;
        }

        else if ((key == 'createdAt' || key == 'updatedAt' || key == 'startedAt') && dict[key] != null) {
            s = `${s}<td>${timeToStringA(new Date(Date.parse(dict[key])))}</td>`;
        }

        else if ((key == 'follows' || key == 'followers') && dict[key] != null) {
            s = `${s}<td>${fmt.format(dict[key])}</td>`;
        }

        else if (isBoolean(dict[key])) {
            s = `${s}<td>${booleanVisualization(dict[key])}</td>`;
        }

        else if (isArray(dict[key])) {
            s = `${s}<td>${bulletnator(dict[key])}</td>`;
        }

        else if (isObject(dict[key])) {
            s = `${s}<td>${tablenator(dict[key])}</td>`;
        }

        else {
            s = `${s}<td>${dict[key]}</td>`;
        }

        s = `${s}</tr>`;

    }

    s = `${s}</table>`;
    return s;

}

// ----------------------------------------------------------------
