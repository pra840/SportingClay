define(
    [
        "impl/translations"
    ],
    function (translations) {

        var onlyContainsNumbers = function (entry) {
            if (entry === "") return true;
            var RE = new RegExp("\^[0-9]+$");
            return (RE.test(entry));
        };

        return {
            mimicDateFromMillisUTC: function (millis) {
                if (!millis) {
                    return null;
                }
                var d = new Date(millis);
                var mimicDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
                return mimicDate;
            },
            formatDateTimeFromMillisUTC: function (millis) {
                if (!millis) {
                    return '';
                }
                return this.formatDateTime(this.mimicDateFromMillisUTC(millis));
            },
            formatDateFromMillisUTC: function (millis) {
                if (!millis) {
                    return '';
                }
                return this.formatDate(this.mimicDateFromMillisUTC(millis));
            },
            formatDateTimeFromMillis: function (millis) {
                if (!millis) {
                    return '';
                }
                return this.formatDateTime(new Date(millis));
            },
            formatFullDateFromMillisUTC: function (millis){
                if (!millis) {
                    return '';
                }
                return this.formatFullDate(this.mimicDateFromMillisUTC(millis));
            },
            formatDateAtTimeFromMillisUTC: function(m){
                var d = this.mimicDateFromMillisUTC(m);
                var dateString = this.formatMonthNameDate(d, false) + ", " + d.getFullYear() + " " + translations.get("At") + " " + this.formatTime(d); //+ d.toLocaleTimeString();
                return dateString;
            },
            formatShortDateFromMillisUTC: function(m){
                var d = this.mimicDateFromMillisUTC(m);
                return this.formatMonthNameDate(d, true);

            },
            formatDateTime: function (d) {
                return this.padToTwo((d.getMonth() + 1)) + "-" + this.padToTwo(d.getDate()) + "-" +
                    d.getFullYear() + " " + this.padToTwo(d.getHours()) + ":" + this.padToTwo(d.getMinutes());
            },
            formatFullDate: function(d){
                return this.formatMonthNameDate(d) + ", " + d.getFullYear();
            },
            padToTwo: function(number) {
                return (number < 10 ? '0' : '') + number;
            },
            formatTime: function (d) {
                var minutes = d.getMinutes();
                var hours = d.getHours();
                var meridiem = "AM";
                if (hours >= 12) {
                    meridiem = "PM";
                    if (hours > 12) {
                        hours = hours - 12;
                    }
                }else if (hours ==0){
                    hours = 12;
                }
                return hours + ":" + this.padToTwo(minutes) + " " + meridiem;
            },
            formatTimeFromMillisUTC: function (millis) {
                if (!millis) {
                    return '';
                }
                return (this.formatTime(this.mimicDateFromMillisUTC(millis)));
            },
            formatDateFromMillis: function (millis) {
                if (!millis) {
                    return '';
                }
                return this.formatDate(new Date(millis));
            },
            formatDate: function (d) {
                return this.padToTwo((d.getMonth() + 1)) + "-" + this.padToTwo(d.getDate()) + "-" +
                    d.getFullYear();
            },
            formatMonthNameDate: function (d, shortWord) {
                var months = [
                    translations.get("JanuaryText"),
                    translations.get("FebruaryText"),
                    translations.get("MarchText"),
                    translations.get("AprilText"),
                    translations.get("MayText"),
                    translations.get("JuneText"),
                    translations.get("JulyText"),
                    translations.get("AugustText"),
                    translations.get("SeptemberText"),
                    translations.get("OctoberText"),
                    translations.get("NovemberText"),
                    translations.get("DecemberText")
                ];
                return (shortWord ? months[d.getMonth()].slice(0,3) :  months[d.getMonth()])+ " " + d.getDate();
            },
            dateFromFormat: function (s) {
                var dateAndTime = s.split(" ");
                var dateParts = dateAndTime[0].split('-');
                var timeParts;
                if (dateAndTime.length == 2) {
                    timeParts = dateAndTime[1].split(':');
                } else {
                    timeParts = "00:00".split(':');
                }
                var d = new Date(dateParts[2], dateParts[0] - 1, dateParts[1], timeParts[0], timeParts[1], 0, 0);
                return d;
            },
            smartGetDate: function (date) {
                if (Object.prototype.toString.call(date) === "[object Date]") {
                    return date;
                }
                if (onlyContainsNumbers(date)) {
                    //from millis
                    return new Date(date);
                } else {
                    //from common format
                    return this.dateFromFormat(date);
                }
            },
            dateIsToday: function (inDate) {
                var today = new Date();
                today = today.setHours(0, 0, 0, 0);
                checkDate = inDate.setHours(0, 0, 0, 0);
                return today == checkDate;
            },
            dateIsInRange: function (inDate, inStart, inEnd) {
                var date = this.smartGetDate(inDate);
                var start = this.smartGetDate(inStart);
                var end = this.smartGetDate(inEnd);
                if (date < end && date > start) {
                    return true;
                }
                return false;
            }
        }
    }
);
