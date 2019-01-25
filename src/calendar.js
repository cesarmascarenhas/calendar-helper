/*
Calendar APP
01-08-2019
Author: Cesar A Mascarenhas
*/
let Calendar = function () {

    const WEEKDAYS  = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const MONTHS    = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const NOW       = new Date()

    this.todayMonth     = NOW.getMonth()
    this.todayDay       = NOW.getDate()
    this.todayYear      = NOW.getFullYear()
    this.currentDay     = 0
    this.currentMonth   = NOW.getMonth()
    this.currentYear    = NOW.getFullYear()

    this.nextMonth = () => {
        this.currentMonth + 1 > 11 ?
            (() => {
                this.currentMonth = 0
                this.currentYear += 1
            })() :
            this.currentMonth += 1
    }

    this.prevMonth = () => {
        this.currentMonth - 1 < 0 ?
            (() => {
                this.currentMonth - 1 < 0 ? this.currentMonth = 11 : this.currentMonth -= 1
                this.currentYear -= 1
            })() :
            this.currentMonth -= 1
    }

    this.nextYear = () => {
        this.currentYear += 1
    }

    this.prevYear = () => {
        this.currentYear -= 1
    }

    this.today = () => {
        this.currentMonth = this.todayMonth
        this.currentYear  = this.todayYear
    }

    this.getDayInWeek = (day) => {
        return WEEKDAYS[new Date(this.currentYear, this.currentMonth, day).getDay()]
    }

    this.getMonthLabel = (month = 0) => MONTHS[month]

    this.getDaysInMonth = (month = this.currentMonth) => 32 - new Date(this.currentYear, month, 32).getDate()

    this.checkToday = () => this.todayMonth === this.currentMonth && this.todayYear === this.currentYear ? this.todayDay : 0

    this.render = () => {

        let rendered = [...Array(42)]

        let current = new Date(this.currentYear, this.currentMonth)
        let start_day = current.getDay()
        let days = this.getDaysInMonth()
        let prevdays = this.getDaysInMonth(this.currentMonth - 1)

        let prev = prevdays - (start_day - 1)
        let monthday = 1

        rendered = rendered.map(() => {

            if (prev <= prevdays) {
                return prev++
            } else {
                if (monthday < days) {
                    return monthday++
                } else {
                    monthday = 1
                    return days
                }
            }
        })

        return {
            rendered: rendered,
            prevDays: start_day,
            currentDays: days + start_day - 1,
            today: this.checkToday(),
            monthLabel: this.getMonthLabel(this.currentMonth),
            month: this.currentMonth,
            year: this.currentYear,
            day: this.currentDay
        }


    }

}