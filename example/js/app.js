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
// APP ===========================================================================================================
let App = function () {

    const UI_CALENDAR = document.getElementById('calendar')
    const UI_MINI_CALENDAR = document.getElementById('mini-calendar')
    const UI_TRANSITION = document.getElementById('transition')
    const UI_DATE = document.getElementById('date')
    const UI_SMALL_DATE = document.getElementById('small-date')
    const UI_MINI_DATE = document.getElementById('mini-date')
    const UI_TODAY = document.getElementById('today')
    const UI_NEXT = document.getElementById('next')
    const UI_PREV = document.getElementById('prev')
    const UI_MINI_NEXT = document.getElementById('mini-next')
    const UI_MINI_PREV = document.getElementById('mini-prev')
    const UI_ADD = document.getElementById('add')
    const UI_APPOINTMENTS = document.getElementById('appointments')
    const UI_NAVIGATION = document.getElementById('navigation')
    const UI_BACK = document.getElementById('back')
    const UI_BACK_LABEL = document.getElementById('back-label')
    const UI_SCHEDULES = document.getElementById('schedules')
    const UI_CANCEL = document.getElementById('cancel')
    const UI_SAVE = document.getElementById('save')
    const UI_DELETE = document.getElementById('delete')
    const UI_TIME = document.getElementById('time')
    const UI_TITLE = document.getElementById('title')
    const UI_DESCRIPTION = document.getElementById('description')
    const UI_SCHEDULES_HEADER = document.getElementById('schedules-header')
    const UI_DATE_TIME = document.getElementById('date-time')
    const UI_SYSTEM_ALERT = document.getElementById('system-alert')
    const UI_SYSTEM_ALERT_MSG = document.getElementById('system-alert-msg')
    const UI_SYSTEM_ALERT_CLOSE = document.getElementById('system-alert-close')

    const ERROR_ENTRY_EXISTS = '<i class="fas fa-exclamation-triangle"></i> Event already exists, please edit or delete the previous entry.'
    const ERROR_EMPTY_FIELD  = '<i class="fas fa-exclamation-triangle"></i> Please, fill up all the fields to create an entry.'
    const SUCCESS_SAVED      = '<i class="fas fa-save"></i> Entry added.'
    const SUCCESS_MODIFIED   = '<i class="fas fa-save"></i> Entry modified.'
    const SUCCESS_DELETED    = '<i class="fas fa-trash-alt"></i> Entry deleted.'

    const HIDE_DATE = document.getElementById('selected-date')
    const HIDE_TIME = document.getElementById('selected-time')

    let storage = myStorage = window.localStorage
    let events  = storage.getItem('events') 
        events = events === null ? [] : JSON.parse(events)
    let schedule_open = false;
    let add_schedule_open = false;
    let calendar = new Calendar()
    let mini_calendar = new Calendar()
    let schedule_action = ''

    this.resetAnimation = () => {
        setTimeout(() => {
            UI_TRANSITION.className = ''
            UI_CALENDAR.className = ''
            UI_CALENDAR.innerHTML = UI_TRANSITION.innerHTML
            this.mountCalendar(UI_CALENDAR);
        }, 500)
    }

    this.calendarNext = () => {

        calendar.nextMonth()
        this.mountCalendar(UI_TRANSITION);

        UI_TRANSITION.className = 'uptransition'
        UI_CALENDAR.className = 'upcalendar'

        this.resetAnimation();

    }

    this.calendarPrev = () => {

        calendar.prevMonth()
        this.mountCalendar(UI_TRANSITION);

        UI_TRANSITION.className = 'downtransition'
        UI_CALENDAR.className = 'downcalendar'

        this.resetAnimation();

    }

    this.calendarMiniNext = () => {

        mini_calendar.nextMonth()
        this.mountCalendar(UI_MINI_CALENDAR);

    }

    this.calendarMiniPrev = () => {

        mini_calendar.prevMonth()
        this.mountCalendar(UI_MINI_CALENDAR);

    }

    this.mountCalendar = (active = UI_CALENDAR) => {

        let sheet = !add_schedule_open ? calendar.render() : mini_calendar.render()
        let label = !add_schedule_open ? UI_DATE : UI_MINI_DATE
        label.innerHTML = `${!add_schedule_open ? sheet.monthLabel : sheet.monthLabel.substring(0, 3)} - ${sheet.year}`

        UI_SMALL_DATE.innerHTML = `${sheet.monthLabel.substring(0, 3)} - ${sheet.year}`

        active.innerHTML = sheet.rendered.map((day, index) => {
           
            const { month, year } = sheet
            const range = (index >= sheet.prevDays && index <= sheet.currentDays)
            const uid = [day, month, year].join('-');

            return `<li id=${index} data-date="${uid}" class="${range ? 'selectable' : 'off'} ${day === sheet.day? 'selected' : ''}">
                        <div class="day">
                            <span class="${
                                    day === sheet.today && sheet.prevDays < index && index <= sheet.currentDays ?
                                    'today' :
                                    ''}"
                            >${day}</span>                            
                        </div>
                        <span class="${ this.checkEvents(uid).length > 0 && range ? 'event' : ''}"></span>
                    </li>`

        }).join('')

        if (!add_schedule_open) {
            this.selectables()
        } else {
            this.miniSelectables()
        }
    }

    this.setScheduleDate = (target) => {

        let selectables = document.querySelectorAll('#mini-calendar .selectable')
        let id = target.id
        Array.from(selectables).filter(
            selectable => {
                selectable.id == id ?
                    selectable.className += ' selected'
                    :
                    selectable.className = 'selectable'
            }
        )
        HIDE_DATE.value = target.dataset.date

    }

    this.miniSelectables = () => {
        let selectables = document.querySelectorAll('#mini-calendar .selectable')
        Array.from(selectables).map( 
            selectable => selectable.addEventListener('click', (e) => {
                this.setScheduleDate(e.currentTarget)
            })
        )
    }

    this.selectables = () => {
        let selectables = document.querySelectorAll('.selectable')
        Array.from(selectables).map(
            selectable => selectable.addEventListener('click', (e) => { 
                calendar.currentDay = parseInt(e.currentTarget.dataset.date.split('-')[0])
                this.appointments(e.currentTarget)
            })
        )
    }

    this.checkEvents = (date) => events.filter(event => event.uid === date)

    this.getEventInTime = (time, today) => events.filter((event, index) => event.uid === today && event.startAt === time)

    this.back = () => {

        UI_NAVIGATION.style = ''
        UI_BACK.style = ''
        UI_CALENDAR.className = 'selected'
        UI_CALENDAR.style.transform = `translateY(0px)`
        UI_APPOINTMENTS.style = ''
        UI_APPOINTMENTS.style = ''
        schedule_open = false
        calendar.currentDay = 0;

        let selectables = document.querySelectorAll('.selectable')
        Array.from(selectables).filter(
            selectable => {
                selectable.className = 'selectable'
            }
        )
    }

    this.mountSchedules = (date) => {

        let day_schedule = ''

        for (let i = 0; i <= 24; i++) {

            let time = i < 10 ? '0' + i : i
            let event = this.getEventInTime(time.toString(), date) 

            day_schedule +=
                `<div data-entry="${event.length > 0 ? 'entry' : '' }" class="schedule" data-time="${time}" data-date="${date}">
                    <span class="time">${time === 24 ? '00' : time}:00</span>
                    ${time < 24 ? event.length > 0 ? `<span class="content">${event[0].title}<br>${event[0].description}</span>` : '<span class="empty"></span>' : ''}
                </div>`

        }

        UI_APPOINTMENTS.innerHTML = day_schedule
        
        //SCROLL APPOINTMENTS TO THE FIRST ENTRY AVAILABLE
        let scroll = UI_APPOINTMENTS.querySelector('.schedule[data-entry=entry]')        
        setTimeout( () => { UI_APPOINTMENTS.scrollTo( 0, scroll !== null ? scroll.offsetTop - 10 : 0) }, 300 ) 
        
        //BIND ADDEVENTS
        this.schedules()

    }

    this.appointments = (target) => {

        let selectables = document.querySelectorAll('.selectable')
        let id = target.id
        let element = document.getElementById(id)
        let today = element.dataset.date
        let row = ~~(id / 7)
        let rect = {
            top: element.offsetTop,
            left: element.offsetLeft,
            width: element.offsetWidth,
            height: element.offsetHeight
        }
        let date = today.split('-')

        Array.from(selectables).filter(
            selectable => {
                selectable.id == id ?
                    selectable.className += ' selected'
                    :
                    selectable.className = 'selectable'
            }
        )

        UI_BACK_LABEL.innerHTML = `${calendar.getDayInWeek(date[0])} - ${calendar.getMonthLabel(date[1])} ${date[0]}, ${date[2]}`

        if (!schedule_open) {
            UI_NAVIGATION.style.transform = 'translateY(-100%)'
            UI_BACK.style.transform = 'translateY(-100%)'
            UI_CALENDAR.className = 'selected'
            UI_CALENDAR.style.transform = `translateY(-${rect.height * row}px)`
            UI_APPOINTMENTS.style.height = `calc(100% - ${rect.height + 160}px)` // counting paddings
            UI_APPOINTMENTS.style.transform = `translateY(-${UI_APPOINTMENTS.getBoundingClientRect().height - (rect.height + 120)}px)` // counting paddings
            schedule_open = true
        } else {
            UI_APPOINTMENTS.scrollTo(0, 0);
        }

        this.mountSchedules(today)

    }

    this.resetSchedules = () => {
        schedule_action     = ''
        UI_SCHEDULES.style  = ''
        HIDE_DATE.value     = ''
        HIDE_TIME.value     = ''
        add_schedule_open   = false
    }

    this.schedules_actions = (action, props = {}) => {

        let mount = (uid) => {

            localStorage.setItem('events', JSON.stringify(events))
            this.resetSchedules()
            this.mountCalendar()
            this.mountSchedules(uid)            
        
        }

        switch (action) {
            case 'cancel':
                this.resetSchedules()
                break
            case 'save':

                //VALIDATE EMPTY FIELDS
                if(this.addEventValidate()){
                    this.systemAlert(ERROR_EMPTY_FIELD,4)
                    return
                }                   

                if (schedule_action == 'add') {
                    //VALIDATE EXISTING ENTRIES
                    if (this.getEventInTime(HIDE_TIME.value, HIDE_DATE.value).length > 0) {
                        this.systemAlert(ERROR_ENTRY_EXISTS,4)
                        return
                    }
                    this.systemAlert(SUCCESS_SAVED)
                    events.push(props)
                    mount(props.uid)
                } else {
                    this.systemAlert(SUCCESS_MODIFIED)
                    events = events.filter(event => event.ui !== props.uid && event.startAt !== props.startAt)
                    events.push(props)
                    mount(props.uid)
                }
                break
            case 'delete':
                this.systemAlert(SUCCESS_DELETED)
                events = events.filter(event => event.ui !== props.uid && event.startAt !== props.startAt)
                mount(props.uid)
                break
        }

    }

    this.schedules = () => {
        let schedules = document.querySelectorAll('.schedule')
        Array.from(schedules).map(schedule => schedule.addEventListener('click', (e) => { this.addEventInschedule(e.currentTarget) }))
    }

    this.addEventValidate = () => {
        const  FIELDS = [UI_TITLE,UI_DESCRIPTION,HIDE_DATE,HIDE_TIME]
        return FIELDS.some( field => field.value === '')
    }

    this.addEvent = () => {


        schedule_action   = 'add'
        add_schedule_open = true;

        UI_DELETE.className = 'hide'
        UI_SCHEDULES.scrollTo(0, 0)
        UI_SCHEDULES_HEADER.innerHTML = 'Create New Appointment'
        UI_SCHEDULES.style.transform = 'translateY(-100%)'
        HIDE_TIME.value = UI_TIME.value = '00'

        UI_TITLE.value = ''
        UI_DESCRIPTION.value = ''
        UI_DATE_TIME.className = ''

        mini_calendar.currentMonth = calendar.currentMonth
        mini_calendar.currentYear = calendar.currentYear

        UI_MINI_DATE.innerHTML = `${mini_calendar.getMonthLabel(mini_calendar.currentMonth)} - ${mini_calendar.currentYear}`

        UI_SAVE.onclick = () => {       
            let date = HIDE_DATE.value.split('-')
            this.schedules_actions('save', {
                uid: HIDE_DATE.value,
                day: date[0],
                month: date[1],
                year: date[2],
                title: UI_TITLE.value,
                description: UI_DESCRIPTION.value,
                startAt: HIDE_TIME.value
            })
        }

        this.mountCalendar(UI_MINI_CALENDAR)

    }

    this.addEventInschedule = (target) => {

        let time = target.dataset.time
        let day = target.dataset.date
        let date = day.split('-')
        let range = parseInt(time) + 1
        range = range === 24 ? 00 : range

        if (time === '24') {
            return
        }

        HIDE_DATE.value = day
        HIDE_TIME.value = time

        UI_SCHEDULES.style.transform = 'translateY(-100%)'
        UI_DATE_TIME.className = 'hide'

        this.entry = (title,description) => {
            return {
                uid: day,
                day: date[0],
                month: date[1],
                year: date[2],
                title: title,
                description: description,
                startAt: HIDE_TIME.value
            }
        }
        

        if (target.querySelector('.content') !== null) {

            schedule_action = 'edit'
            let event = this.getEventInTime(time, day)[0]
            UI_SCHEDULES_HEADER.innerHTML = `Edit Appointment<br>
                                            <small>
                                                ${calendar.getDayInWeek(date[0])} - ${calendar.getMonthLabel(date[1])} ${date[0]}, ${date[2]}<br> from ${time}:00 to ${range < 10 ? '0' + range : range}:00 
                                            </small>`
            UI_TITLE.value = event.title
            UI_DESCRIPTION.value = event.description
            UI_DELETE.className = ''
            UI_DELETE.onclick = () => this.schedules_actions('delete', { uid: event.uid, startAt: HIDE_TIME.value })
            UI_SAVE.onclick = () => this.schedules_actions('save', this.entry(UI_TITLE.value,UI_DESCRIPTION.value))

        } else {
            schedule_action = 'add'
            UI_SCHEDULES_HEADER.innerHTML = `Create Appointment<br>
                                            <small>
                                                ${calendar.getDayInWeek(date[0])} - ${calendar.getMonthLabel(date[1])} ${date[0]}, ${date[2]}<br> from ${time}:00 to ${range < 10 ? '0' + range : range}:00 
                                            </small>`
            UI_TITLE.value = ''
            UI_DESCRIPTION.value = ''
            UI_DELETE.className = 'hide'
            UI_SAVE.onclick = () => this.schedules_actions('save',  this.entry(UI_TITLE.value,UI_DESCRIPTION.value))
        }


    }

    this.backToToday = () => {
        calendar.today()
        this.mountCalendar()
    }

    this.systemAlert = (msg = 'Error without message to display.', time = 2) => {

        UI_SYSTEM_ALERT_MSG.innerHTML = msg
        UI_SYSTEM_ALERT.style.transform = 'translate(-50%,calc(0% + 20px))'

        let clear_timeout = setTimeout(() => {
            UI_SYSTEM_ALERT.style = ''
        }, time * 1000)

        UI_SYSTEM_ALERT_CLOSE.onclick = () => {
            clearTimeout(clear_timeout);
            UI_SYSTEM_ALERT.style = ''
        }

    }

    this.init = () => {

        this.mountCalendar(UI_CALENDAR)
        UI_MINI_NEXT.addEventListener('click', this.calendarMiniNext);
        UI_MINI_PREV.addEventListener('click', this.calendarMiniPrev);
        UI_NEXT.addEventListener('click', this.calendarNext);
        UI_PREV.addEventListener('click', this.calendarPrev);
        UI_TODAY.addEventListener('click', () => this.backToToday());

        UI_BACK.addEventListener('click', this.back);
        UI_ADD.addEventListener('click', () => this.addEvent());
        UI_CANCEL.addEventListener('click', () => this.schedules_actions('cancel'));
        UI_TIME.onchange = target => { HIDE_TIME.value = target.currentTarget.value }

    }

}

let app = new App();
app.init();
