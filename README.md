# FrontEnd Agnostic Calendar

## How to use it

Import the calendar.js file to your current project, then instantiate it

```js
let calendar = new Calendar()
```

## Methods

| Method       | Result                       |
|-----------------|-----------------------------|
| nextMonth | [`Void`] Move the pointer to the next month |
| prevMounth | [`Void`] Move the pointer to the previous month |
| nextYear | [`Void`] Move the pointer to the next year |
| prevYear | [`Void`] Move the pointer to the previous year |
|getDayInWeek| [`String`] Day of the week|
|render| [`Object`] Props resulting from the current pointer in month/year |

The main method to mount and display the calendar is `render`, it must be called every move from the pointer. The result is as follows:

```json
{
    "rendered":[
        30,31,1,2,3,4,5,
        6,7,8,9,10,11,12,
        13,14,15,16,17,18,19,
        20,21,22,23,24,25,26,
        27,28,29,30,31,1,2,
        3,4,5,6,7,8,9],
    "prevDays":2,
    "currentDays":32,
    "today":25,
    "monthLabel":"January",
    "month":0,
    "year":2019,
    "day":0
}
```
## Render props

| Property       | Value                       |
|-----------------|-----------------------------|
| rendered | [`Array`] Days are returned as an 7x6 grid representing the current month days, and if applicable days from the previous and next months in the extremities of the array |
| prevDays | [`Integer`] How many days from the previous month are been displayed |
| currentDays | [`Integer`] Current month's days, ranging from 0 to prevdays + daysFromCurrentMonth |
| today | [`Integer`] Current day |
|monthLabel| [`String`] Current month for localization|
| month | [`Integer`] Current month, from 0 to 11 |
| year | [`Integer`] Current year |
| day | [`Integer`] If a day needs to be selected, use calendar.currentDay = [`Integer`]day |

## Example
`See the example folder, it contains a full agenda featuring the calendar.js.
You can schedule events with it` :)
