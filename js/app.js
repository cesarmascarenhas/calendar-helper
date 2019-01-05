let Calendar = function () {

    const weekdays  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
    const months    = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const now       = new Date()

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
        return weekdays[new Date(this.currentYear,this.currentMonth,day).getDay()]
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

let App = function () {

    let events = {
        "3-0-2019":{
            day:3,
            month:0,
            year:2019,
            title:"Send Code",
            description:"Send code for hackrank review",
            startAt:'3:00 PM',
            endAt:'4:00 PM'
        },
        "14-1-2019":{
            day:14,
            month:1,
            year:2019,
            title:"Send Code",
            description:"Send code for hackrank review",
            startAt:'3:00 PM',
            endAt:'4:00 PM'
        }
    }

    const ui_calendar       = document.getElementById('calendar')
    const ui_transition     = document.getElementById('transition')
    const ui_date           = document.getElementById('date')
    const ui_next           = document.getElementById('next')
    const ui_prev           = document.getElementById('prev')
    const ui_appointments   = document.getElementById('appointments') 
    const ui_day            = document.getElementById('day') 

    let active = 0;

    let calendar = new Calendar()

    this.resetAnimation = () => {
        setTimeout(() => {
            ui_transition.className = ''
            ui_calendar.className   = ''
            ui_calendar.innerHTML   = ui_transition.innerHTML
            this.mountCalendar();
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

    this.mountCalendar = (active = ui_calendar) => {

        let sheet = calendar.render()

        ui_date.innerHTML   = `${sheet.monthLabel} - ${sheet.year}`

        active.innerHTML    = sheet.rendered.map((day, index) => {

            const {month,year} = sheet
            const range = (index >= sheet.prevDays && index <= sheet.currentDays)
            const uid = [day,month,year].join('-');
            
            return `<li id=${index} data-date="${uid}" class="${ range ? 'selectable' : 'off' }">
                        <div class="day">
                            <span class="${
                                day === sheet.today && sheet.prevDays < index && index <= sheet.currentDays
                                ? 
                                    'today'
                                :
                                    ''}">${day}</span>                            
                        </div>
                        <span class="${ events[uid] !== undefined && range ? 'event' : '' }"></span>
                    </li>`
            
        }).join('')

        this.selectables()
    }

    this.selectables = () => {
        let selectables = document.querySelectorAll('.selectable')
        Array.from(selectables).map( selectable => selectable.addEventListener('click',(e)=>{this.appointments(e.currentTarget)}))
    }

    this.appointments = (target) =>{

        let id          = target.id
        let element     = document.getElementById(id);
        let rect        = {
            top: element.offsetTop,
            left: element.offsetLeft,
            width: element.offsetWidth,
            height: element.offsetHeight
        }      

        ui_appointments.style     = `width:${rect.width}px; height:${rect.height}px; top:${rect.top}px; left:${rect.left}px;`
        
        /*
        let id      = target.id
        let date    = target.dataset.date.split('-')
        let element = document.getElementById(id)
        let rect    = element.getBoundingClientRect()

        ui_appointments.style     = `width:${rect.width}px; height:${rect.height}px; top:${rect.y}px; left:${rect.x}px;`
        */
        ui_day.innerHTML          = element.innerHTML
        ui_appointments.className = 'open'

        console.log(calendar.getDayInWeek(date[0]))

        setTimeout(()=>{
            ui_appointments.className = 'opened'
        },400)
    }

    this.init = () => {

        this.mountCalendar()
        ui_next.addEventListener('click', this.mountNext);
        ui_prev.addEventListener('click', this.mountPrev);
        
    }

}

let app = new App();
app.init();
