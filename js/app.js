let Calendar = function () {

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const now = new Date()

    this.currentMonth   = now.getMonth()
    this.currentYear    = now.getFullYear()
    this.todayMonth     = now.getMonth()
    this.todayDay       = now.getDate()
    this.todayYear      = now.getFullYear()


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

    this.getDayInWeek = (day) => {
        return weekdays[new Date(this.currentYear, this.currentMonth, day).getDay()]
    }

    this.getMonthLabel = (month = 0) => months[month]

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
            year: this.currentYear
        }


    }

}
// APP ===========================================================================================================
let App = function () {

    let events = [
        {
            uid:'3-0-2019',
            day: 3,
            month: 0,
            year: 2019,
            title: "Send Code",
            description: "Send code for hackrank review Send code for hackrank review Send code for hackrank review",
            startAt: '15'
        },
        {
            uid:'3-0-2019',
            day: 3,
            month: 0,
            year: 2019,
            title: "Send Code",
            description: "Send code for hackrank review Send code for hackrank review Send code for hackrank review Send code for hackrank review Send code for hackrank review Send code for hackrank review",
            startAt: '16'
        },
        {
            uid:'14-1-2019',
            day: 14,
            month: 1,
            year: 2019,
            title: "Send Code",
            description: "Send code for hackrank review",
            startAt: '14'
        }
    ]

    const ui_calendar           = document.getElementById('calendar')
    const ui_mini_calendar      = document.getElementById('mini-calendar')
    const ui_transition         = document.getElementById('transition')
    const ui_date               = document.getElementById('date')
    const ui_mini_date          = document.getElementById('mini-date')
    const ui_next               = document.getElementById('next')
    const ui_prev               = document.getElementById('prev')
    const ui_mini_next          = document.getElementById('mini-next')
    const ui_mini_prev          = document.getElementById('mini-prev')
    const ui_add                = document.getElementById('add')
    const ui_appointments       = document.getElementById('appointments')
    const ui_navigation         = document.getElementById('navigation')
    const ui_back               = document.getElementById('back')
    const ui_back_label         = document.getElementById('back-label')
    const ui_schedules          = document.getElementById('schedules')
    const ui_cancel             = document.getElementById('cancel')
    const ui_save               = document.getElementById('save')
    const ui_delete             = document.getElementById('delete')
    const ui_time               = document.getElementById('time')
    const ui_title              = document.getElementById('title')
    const ui_description        = document.getElementById('description')
    const ui_schedules_header   = document.getElementById('schedules-header')
    const ui_date_time          = document.getElementById('date-time')
    const hide_mini_date        = document.getElementById('mini-selected-date')

    let schedule_open       = false;
    let add_schedule_open   = false;
    let calendar            = new Calendar()
    let mini_calendar       = new Calendar()

    this.resetAnimation = () => {
        setTimeout(() => {
            ui_transition.className = ''
            ui_calendar.className   = ''
            ui_calendar.innerHTML   = ui_transition.innerHTML
            this.mountCalendar(ui_calendar);
        }, 500)
    }

    this.mountNext = () => {

        calendar.nextMonth()
        this.mountCalendar(ui_transition);

        ui_transition.className = 'uptransition'
        ui_calendar.className   = 'upcalendar'

        this.resetAnimation();

    }

    this.mountPrev = () => {

        calendar.prevMonth()
        this.mountCalendar(ui_transition);

        ui_transition.className = 'downtransition'
        ui_calendar.className   = 'downcalendar'

        this.resetAnimation();

    }

    this.mountMiniNext = () => {

        mini_calendar.nextMonth()
        this.mountCalendar(ui_mini_calendar);

    }

    this.mountMiniPrev = () => {

        mini_calendar.prevMonth()
        this.mountCalendar(ui_mini_calendar);

    }

    this.mountCalendar = (active = ui_calendar) => {

        let sheet = !add_schedule_open ? calendar.render() : mini_calendar.render()
        let label = !add_schedule_open ? ui_date : ui_mini_date
        
        label.innerHTML = `${!add_schedule_open ? sheet.monthLabel : sheet.monthLabel.substring(0,3)} - ${sheet.year}`
        

        active.innerHTML  = sheet.rendered.map((day, index) => {

            const { month, year } = sheet
            const range = (index >= sheet.prevDays && index <= sheet.currentDays)
            const uid = [day, month, year].join('-');

            return `<li id=${index} data-date="${uid}" class="${range ? 'selectable' : 'off'}">
                        <div class="day">
                            <span class="${
                day === sheet.today && sheet.prevDays < index && index <= sheet.currentDays
                    ?
                    'today'
                    :
                    ''}">${day}</span>                            
                        </div>
                        <span class="${ this.checkEvents(uid).length > 0 && range ? 'event' : ''}"></span>
                    </li>`

        }).join('')
        
        if(!add_schedule_open){
            this.selectables()
        } else {
            this.miniSelectables()
        }
    }

    this.setScheduleDate = (target) => {
        let selectables = document.querySelectorAll('#mini-calendar .selectable')
        let id          = target.id
        Array.from(selectables).filter(
            selectable => {
            selectable.id == id ?
                selectable.className += ' selected'
                :
                selectable.className = 'selectable'
            }
        )
        hide_mini_date.value = target.dataset.date
    }

    this.miniSelectables = () => {
        let selectables = document.querySelectorAll('#mini-calendar .selectable')
        Array.from(selectables).map(selectable => selectable.addEventListener('click', (e) => { this.setScheduleDate(e.currentTarget) }))
    }

    this.selectables = () => {
        let selectables = document.querySelectorAll('.selectable')
        Array.from(selectables).map(selectable => selectable.addEventListener('click', (e) => { this.appointments(e.currentTarget) }))
    }

    this.checkEvents = (date) => events.filter( event => event.uid === date)

    this.getEventInTime = (time,today) => events.filter( (event,index) => event.uid === today && event.startAt === time )

    this.back = () => {
        ui_navigation.style         = ''
        ui_back.style               = ''
        ui_calendar.className       = 'selected'
        ui_calendar.style.transform = `translateY(0px)`
        ui_appointments.style       = ''
        ui_appointments.style       = ''
        schedule_open               = false

        let selectables = document.querySelectorAll('.selectable')
        Array.from(selectables).filter(
            selectable => {
                selectable.className = 'selectable'
            }
        )
    }
    this.appointments = (target) => {

        let selectables = document.querySelectorAll('.selectable')
        let id          = target.id
        let element     = document.getElementById(id)
        let today       = element.dataset.date 
        let row         = ~~(id / 7)
        let rect        = {
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

        ui_back_label.innerHTML = `${calendar.getDayInWeek(date[0])} - ${calendar.getMonthLabel(date[1])} ${date[0]}, ${date[2]}`
        
        if(!schedule_open){
            ui_navigation.style.transform   = 'translateY(-100%)'
            ui_back.style.transform         = 'translateY(-100%)'
            ui_calendar.className           = 'selected'
            ui_calendar.style.transform     = `translateY(-${rect.height * row}px)`
            ui_appointments.style.height    = `calc(100% - ${rect.height + 160}px)` // counting paddings
            ui_appointments.style.transform = `translateY(-${ui_appointments.getBoundingClientRect().height - (rect.height + 120)}px)` // counting paddings
            schedule_open = true
        } else {
            ui_appointments.scrollTo(0,0);
        }

        let day_schedule = ''
        for(let i = 0 ; i <= 24 ; i++){

            let time  = i < 10 ? '0'+i : i
            let event =  this.getEventInTime(time.toString(),today)

            day_schedule +=
                `<div class="schedule" data-time="${time}" data-date="${today}">
                    <span class="time">${time === 24 ? '00' : time}:00</span>
                    ${time < 24 ? event.length > 0 ? `<span class="content">${event[0].title}<br>${event[0].description}</span>` : '<span class="empty"></span>' : ''}
                </div>`
            
        }

        ui_appointments.innerHTML = day_schedule
        this.schedules()
    
    }

    this.schedules_actions = (action,props={}) => {

        switch(action){
            case 'cancel':                
                ui_schedules.style      = ''
                hide_mini_date.value    = ''
                add_schedule_open       = false;              
                break;
            case 'save':
               break;
        }

    }

    this.schedules = () => {
        let schedules = document.querySelectorAll('.schedule')
        Array.from(schedules).map(schedule => schedule.addEventListener('click', (e) => { this.addEventInschedule(e.currentTarget) }))
    }

    this.addEvent = () => {

        add_schedule_open = true;

        ui_schedules.scrollTo(0,0)
        ui_schedules_header.innerHTML = 'Create New Appointment'
        ui_schedules.style.transform = 'translateY(-100%)'
        ui_time.value = '00'
        
        ui_title.value = ''
        ui_description.value = ''
        ui_date_time.className = ''

        mini_calendar.currentMonth = calendar.currentMonth
        mini_calendar.currentYear  = calendar.currentYear
        
        ui_mini_date.innerHTML = `${mini_calendar.getMonthLabel(mini_calendar.currentMonth)} - ${mini_calendar.currentYear}`
       
        this.mountCalendar(ui_mini_calendar)

    }

    this.addEventInschedule = (target) => {
        
        let time   = target.dataset.time
        let day    = target.dataset.date
        let date   = day.split('-')
        let range  = parseInt(time) + 1
            range  = range === 24 ? 00 : range

        if(time === '24'){
            return
        }

        ui_schedules.style.transform = 'translateY(-100%)'
        ui_time.value = time
        ui_date_time.className = 'hide'
        
        if(target.querySelector('.content') !== null){
            let event = this.getEventInTime(time,day)[0]
            ui_schedules_header.innerHTML = `Edit Appointment<br>
                                            <small>
                                                ${calendar.getDayInWeek(date[0])} - ${calendar.getMonthLabel(date[1])} ${date[0]}, ${date[2]}<br> from ${time}:00 to ${range < 10 ? '0'+range : range}:00 
                                            </small>`
            ui_title.value = event.title
            ui_description.value = event.description
            ui_delete.className = ''
            ui_delete.onclick = () => this.schedules_actions('delete', event.uid)
            ui_save.onclick = () => this.schedules_actions('save', {
                uid:day,
                day:date[0],
                month:date[1],
                year:date[2],
                title:ui_title.value,
                description:ui_description.value,
                startAt:ui_time.value
            })
        } else {
            ui_schedules_header.innerHTML = `Create Appointment<br>
                                            <small>
                                                ${calendar.getDayInWeek(date[0])} - ${calendar.getMonthLabel(date[1])} ${date[0]}, ${date[2]}<br> from ${time}:00 to ${range < 10 ? '0'+range : range}:00 
                                            </small>`
            ui_title.value = ''
            ui_description.value = ''
            ui_delete.className = 'hide'
            ui_save.onclick = () => this.schedules_actions('save', {
                uid:day,
                day:date[0],
                month:date[1],
                year:date[2],
                title:ui_title.value,
                description:ui_description.value,
                startAt:ui_time.value
            })
        }

        
    }


    this.init = () => {

        this.mountCalendar(ui_calendar)
        ui_mini_next.addEventListener('click', this.mountMiniNext);
        ui_mini_prev.addEventListener('click', this.mountMiniPrev);
        ui_next.addEventListener('click', this.mountNext);
        ui_prev.addEventListener('click', this.mountPrev);
        
        ui_back.addEventListener('click', this.back);
        ui_cancel.addEventListener('click', () => this.schedules_actions('cancel'));
        ui_add.addEventListener('click', () => this.addEvent());

    }

}

let app = new App();
app.init();
