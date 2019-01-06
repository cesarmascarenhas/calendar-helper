let Calendar = function () {

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const now = new Date()

    this.currentMonth = now.getMonth()
    this.currentYear = now.getFullYear()
    this.todayMonth = now.getMonth()
    this.todayDay = now.getDate()
    this.todayYear = now.getFullYear()

    this.getDayLabel = (day = 0) => days[day]
    this.getMonthLabel = (month = 0) => months[month]

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

    const events = [
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

    const ui_calendar = document.getElementById('calendar')
    const ui_transition = document.getElementById('transition')
    const ui_date = document.getElementById('date')
    const ui_next = document.getElementById('next')
    const ui_prev = document.getElementById('prev')
    const ui_appointments = document.getElementById('appointments')
    const ui_navigation = document.getElementById('navigation')
    const ui_back = document.getElementById('back')
    const ui_back_label = document.getElementById('back-label')

    let schedule_open   = false;
    let calendar        = new Calendar()

    this.resetAnimation = () => {
        setTimeout(() => {
            ui_transition.className = ''
            ui_calendar.className = ''
            ui_calendar.innerHTML = ui_transition.innerHTML
            this.mountCalendar();
        }, 500)
    }

    this.mountNext = () => {

        calendar.nextMonth()
        this.mountCalendar(ui_transition);

        ui_transition.className = 'uptransition'
        ui_calendar.className = 'upcalendar'

        this.resetAnimation();


    }

    this.mountPrev = () => {

        calendar.prevMonth()
        this.mountCalendar(ui_transition);

        ui_transition.className = 'downtransition'
        ui_calendar.className = 'downcalendar'

        this.resetAnimation();

    }

    this.mountCalendar = (active = ui_calendar) => {

        let sheet = calendar.render()

        ui_date.innerHTML = `${sheet.monthLabel} - ${sheet.year}`

        active.innerHTML = sheet.rendered.map((day, index) => {

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

        this.selectables()
    }

    this.selectables = () => {
        let selectables = document.querySelectorAll('.selectable')
        Array.from(selectables).map(selectable => selectable.addEventListener('click', (e) => { this.appointments(e.currentTarget) }))
    }

    this.checkEvents = (date) => {
        return events.filter( event => event.uid === date)
    }

    this.getEventInTime = (time,today) => {
        return events.filter( event => event.uid === today && event.startAt === time ? event : false)
    }
    this.back = () => {
        ui_navigation.style = ''
        ui_back.style = ''
        ui_calendar.className = 'selected'
        ui_calendar.style.transform = `translateY(0px)`
        ui_appointments.style = ''
        ui_appointments.style = ''
        schedule_open = false

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
            ui_navigation.style.transform = 'translateY(-100%)'
            ui_back.style.transform = 'translateY(-100%)'
            ui_calendar.className = 'selected'
            ui_calendar.style.transform = `translateY(-${rect.height * row}px)`
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
                `<div class="schedule">
                    <span class="time">${time === 24 ? '00' : time}:00</span>
                    ${time < 24 ? event.length > 0 ? `<span class="content">${event[0].title}<br>${event[0].description}</span>` : '<span class="empty"></span>' : ''}
                </div>`
            
        }

        ui_appointments.innerHTML = day_schedule
    
    }

    this.init = () => {

        this.mountCalendar()
        ui_next.addEventListener('click', this.mountNext);
        ui_prev.addEventListener('click', this.mountPrev);
        ui_back.addEventListener('click', this.back);

    }

}

let app = new App();
app.init();
